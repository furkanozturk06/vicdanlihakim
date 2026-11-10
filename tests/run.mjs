// Automated playthroughs (npm test).
// Starts a Vite dev server, opens tests/playthrough.html in headless Chrome through the
// DevTools protocol and plays whole games with different player types, then checks
// that each one reaches the ending it should.
//
// Needs Google Chrome or Microsoft Edge. Set CHROME_PATH to use another browser binary.
import { createServer } from 'vite';
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SCENARIOS = [
    { name: 'Dürüst hakim', query: 'policy=honest', expect: { end: 'Kasabanın Hakimi', branch: 'surgun', tutorial: 5 } },
    { name: 'Ağaya boyun eğen', query: 'policy=surgunFavored', expect: { end: 'Emekli', branch: 'surgun' } },
    { name: 'Kıyak geçip dürüst kalan', query: 'policy=borcHonest', expect: { end: 'Emekli', branch: 'borc' } },
    { name: 'Vatana ihaneti örtbas eden', query: 'policy=borcCorrupt', expect: { end: 'İdam', branch: 'borc' } },
    { name: 'Sonsuz mod, 25 gün', query: 'policy=honest&endless=1&maxDays=25', expect: { mode: 'endless', stoppedAt: 26 } },
];

function findChrome() {
    const candidates = [
        process.env.CHROME_PATH,
        'C:/Program Files/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
    ].filter(Boolean);
    const found = candidates.find(p => existsSync(p));
    if (!found) throw new Error('Chrome bulunamadı. CHROME_PATH ortam değişkeniyle yolunu verin.');
    return found;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Opens one URL in a fresh headless browser and waits for the report in #result
async function play(chromePath, url, timeoutSec = 240) {
    const port = 9300 + Math.floor(Math.random() * 500);
    const profile = mkdtempSync(join(tmpdir(), 'hakim-test-'));
    const chrome = spawn(chromePath, [
        '--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`,
        `--user-data-dir=${profile}`, 'about:blank',
    ], { stdio: 'ignore' });

    try {
        let target;
        for (let i = 0; i < 50 && !target; i++) {
            try {
                target = await (await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' })).json();
            } catch {
                await sleep(200);
            }
        }
        if (!target) throw new Error('Tarayıcıya bağlanılamadı');

        const ws = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise(r => ws.addEventListener('open', r));
        let id = 0;
        const waiting = new Map();
        ws.addEventListener('message', (m) => {
            const d = JSON.parse(m.data);
            if (waiting.has(d.id)) { waiting.get(d.id)(d); waiting.delete(d.id); }
        });
        const send = (method, params = {}) => new Promise(r => { const i = ++id; waiting.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

        const deadline = Date.now() + timeoutSec * 1000;
        while (Date.now() < deadline) {
            await sleep(1000);
            const r = await send('Runtime.evaluate', {
                expression: "document.getElementById('result') ? document.getElementById('result').textContent : ''",
                returnByValue: true,
            });
            const text = r.result?.result?.value ?? '';
            if (text.startsWith('{')) { ws.close(); return JSON.parse(text); }
        }
        ws.close();
        throw new Error('Zaman aşımı');
    } finally {
        chrome.kill();
        await sleep(300);
        try { rmSync(profile, { recursive: true, force: true }); } catch { /* profile still locked: leave it */ }
    }
}

function check(scenario, r) {
    const problems = [];
    const e = scenario.expect;
    if (r.errors.length) problems.push(`hata: ${r.errors.join(' | ')}`);
    if (e.end && r.end !== e.end) problems.push(`son "${r.end}", beklenen "${e.end}"`);
    if (e.branch && r.branch !== e.branch) problems.push(`kol "${r.branch}", beklenen "${e.branch}"`);
    if (e.mode && r.mode !== e.mode) problems.push(`mod "${r.mode}", beklenen "${e.mode}"`);
    if (e.stoppedAt && r.stoppedAt !== e.stoppedAt) problems.push(`${r.stoppedAt}. günde durdu, beklenen ${e.stoppedAt}`);
    if (e.tutorial && r.tutorialSteps !== e.tutorial) problems.push(`öğretici ${r.tutorialSteps} adım, beklenen ${e.tutorial}`);
    if (r.repeats) problems.push(`${r.repeats} dava tekrar etti`);
    if (r.deferred !== r.reopened) problems.push(`${r.deferred} teklif masaya bırakıldı ama ${r.reopened} kez açıldı`);
    if (e.end && !r.deferred) problems.push('hiç teklif masaya bırakılmadı');
    if (e.end && e.branch && !r.settings.endlessUnlocked) problems.push('hikâye bitti ama sonsuz mod açılmadı');
    return problems;
}

const chromePath = findChrome();
const server = await createServer({ server: { port: 5199, strictPort: false, open: false }, logLevel: 'error' });
await server.listen();
const base = server.resolvedUrls.local[0].replace(/\/$/, '');

let failed = 0;
console.log(`Otomatik oyun testleri (${SCENARIOS.length} senaryo)\n`);
for (const scenario of SCENARIOS) {
    const started = Date.now();
    try {
        const r = await play(chromePath, `${base}/tests/playthrough.html?${scenario.query}`);
        const problems = check(scenario, r);
        const secs = ((Date.now() - started) / 1000).toFixed(1);
        const summary = r.end ? `son: ${r.end}` : `${r.stoppedAt - 1} gün oynandı`;
        if (problems.length) {
            failed++;
            console.log(`✗ ${scenario.name} (${secs} sn) – ${problems.join('; ')}`);
        } else {
            console.log(`✓ ${scenario.name} (${secs} sn) – ${summary}, ${r.cases.length} dava, ${r.deferred} teklif masadan karara bağlandı`);
        }
    } catch (err) {
        failed++;
        console.log(`✗ ${scenario.name} – ${err.message}`);
    }
}

await server.close();
console.log(failed ? `\n${failed} senaryo başarısız.` : '\nBütün senaryolar geçti.');
process.exit(failed ? 1 : 0);
