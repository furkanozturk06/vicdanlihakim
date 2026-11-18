/**
 * Story Data (TURKISH)
 * Directives, defendant names, bribe/threat offers and newspaper generation.
 */

import { L, LANG } from './i18n.js';

// Daily directives from the ministry
export const DIRECTIVES = [
    {
        text: L('Bakanlık bugün artan para cezaları talep ediyor.'),
        crimeFilter: ['pettyTheft', 'vandalism', 'fraud', 'blackmail'],
        bonus: 'fine',
        bonusAmount: 1.5,
    },
    {
        text: L('Kamu güvenliği endişesi: Hapis cezalarına öncelik verin.'),
        crimeFilter: ['assault', 'burglary', 'murder', 'arson'],
        bonus: 'jail',
        bonusAmount: 1.3,
    },
    {
        text: L('Merhamet gösterin - cezaevleri doldu.'),
        crimeFilter: null,
        bonus: 'release',
        bonusAmount: 1.5,
    },
    {
        text: L('Yolsuzlukla mücadele: Beyaz yakalı suçlara sert olun.'),
        crimeFilter: ['fraud', 'corruption', 'smuggling', 'blackmail'],
        bonus: 'jail',
        bonusAmount: 1.4,
    },
    {
        text: L('Sakin bir gün. Vicdanınızın sesini dinleyin.'),
        crimeFilter: null,
        bonus: null,
        bonusAmount: 1,
    },
    {
        text: L('Trafik haftası: Yollarda düzeni sağlayın.'),
        crimeFilter: ['traffic'],
        bonus: 'jail',
        bonusAmount: 1.3,
    },
    {
        text: L('Uyuşturucuyla mücadele: Satıcılara göz açtırmayın.'),
        crimeFilter: ['drugs'],
        bonus: 'jail',
        bonusAmount: 1.3,
    },
    {
        text: L('Olağanüstü güvenlik toplantısı: Devlete ve halka karşı suçlarda taviz yok.'),
        crimeFilter: ['terrorism', 'treason', 'armsTrafficking', 'humanTrafficking'],
        bonus: 'jail',
        bonusAmount: 1.3,
    },
];

export const FINAL_DIRECTIVE = {
    text: L('Bakanlık: Bugünkü son davada "hassasiyet" bekleniyor.'),
    crimeFilter: null,
    bonus: null,
    bonusAmount: 1,
};

export const INTRO = {
    title: L('Adalet Bakanlığı'),
    text: L('Sayın Hakim,\n\nŞehrin Ağır Ceza Mahkemesine atandınız. Önümüzdeki on beş gün boyunca kararlarınız bakanlıkça değerlendirilecektir.\n\nHer sabah bakanlığın talimatını alacaksınız. Kanun kitabı masanızda. Sanıkları sorgulamak için günlük hakkınız sınırlıdır; dosyaları dikkatle okuyun.\n\nUnutmayın: Kanun ile vicdan her zaman aynı şeyi söylemez.'),
    button: L('Göreve Başla'),
};

// First-game tutorial, shown on the very first case
export const TUTORIAL = [
    {
        target: '.case-file',
        title: L('Dava Dosyası'),
        text: L('Sanığın kim olduğu, ne yaptığı ve deliller burada. Uzun dosyaları parmağınla kaydırabilirsin.'),
    },
    {
        target: '.case-interrogation',
        title: L('Sorgu'),
        text: L('Günde 3 sorgu hakkın var. Sorgu, dosyadaki gizli delili açar. Bazı davalarda doğru karar için bu delil şart.'),
    },
    {
        target: '#rulebook-btn',
        title: L('Kanun Kitabı'),
        text: L('Her suçun olağan cezası ve özel halleri burada yazar. Zamanla kanuna yeni ek maddeler gelecek; takipte kal.'),
    },
    {
        target: '#sentencing-panel',
        title: L('Karar'),
        text: L('Kanuna uygun karar bakiyene ve itibarına yarar. Fazla sert kararlar vicdanını, fazla hafif kararlar itibarını yer.'),
    },
    {
        target: '#stats-bar',
        title: L('Görevin'),
        text: L('Bakiyen ya da itibarın sıfırlanırsa görevden alınırsın. On beş gün dayan; ardından hikâyen başka bir yerde sürecek. Rüşvet ve tehditlere dikkat et.'),
    },
];

// "Nasıl Oynanır" from the main menu
export const HOW_TO_PLAY = {
    title: L('Nasıl Oynanır'),
    text: L('Her gün sanıklar karşına gelir. Dava dosyasını oku, gerekirse sanığı sorgula (günlük sorgu hakkın sınırlı) ve KANUN kitabındaki maddelere göre kararını ver.\n\nKanuna uygun karar bakiyene ve itibarına yarar. Fazla sert kararlar vicdanını, fazla hafif kararlar itibarını yer. Bakiyen ya da itibarın sıfırlanırsa görevden alınırsın. Vicdanın sıfırlanırsa ailen gider, geceleri uyuyamazsın.\n\nRüşvet ve tehditler gelecek; kabul etmek kolaydır ama bedeli vardır. Akşamları ailenle geçen anlar da hikâyeyi değiştirir.\n\nBazen savcı ya da avukat ayağa kalkıp itiraz eder: "Kanuna göre şu ceza verilmeli, sayın hakim!" Her itiraz doğru değildir; hemen kanma, kanun kitabına ve delillere bakarak kendin karar ver.\n\nHikâye 30 gün sürer. Bitirince Sonsuz Mod açılır.'),
    choices: [
        { label: L('Anladım'), value: 'ok' },
        { label: L('Öğreticiyi sonraki oyunda göster'), value: 'replay' },
    ],
};

// Endless mode, unlocked by finishing the 30-day story
export const ENDLESS_INTRO = {
    title: L('Sonsuz Mod'),
    text: L('Hikâye bitti, ama mahkemenin kapısı hiç kapanmıyor.\n\nBu modda her gün yeni sanıklar gelir. Kanun, sorgu, temyiz ve teklifler aynen sürer; ama her on günde bir sorgu hakkın azalır ve rüşvet teklifleri sıklaşır.\n\nBakiyen ya da itibarın sıfırlanana kadar ne kadar dayanabilirsin?'),
    button: L('Kürsüye Çık'),
};

// Minister's son: the last case of day 15; his statement comes from the trial (trial.js)
export const FINALE = {
    crimeType: 'traffic',
    name: L('Kerem B.'),
    age: 24,
    gender: 'm',
    offer: {
        icon: '📞',
        title: L('Bakanlıktan bir telefon'),
        text: L('Müsteşar arıyor: "Hakim Bey, bakanımızın oğlunun geleceği bir kaza yüzünden kararmamalı. Beraat verirseniz terfiniz ve ₺200.000 ikramiye hazır."'),
        accept: L('Beraat ver'),
        decline: L('Kanunu uygula'),
        amount: 200000,
    },
};

// Recurring characters
export function inspectorReport(accuracy) {
    const pct = Math.round(accuracy * 100);
    if (accuracy >= 0.75) {
        return { title: L('Müfettiş Kaya\'nın Raporu'), text: L('Kararlarınızın %{0}\'i kanuna uygun. Bakanlık memnun: ₺15.000 ikramiye.', pct), money: 15000, reputation: 5 };
    }
    if (accuracy >= 0.5) {
        return { title: L('Müfettiş Kaya\'nın Raporu'), text: L('Kararlarınızın %{0}\'i kanuna uygun. "Fena değil, ama kanun kitabını daha sık açın."', pct), money: 0, reputation: 0 };
    }
    return { title: L('Müfettiş Kaya\'nın Raporu'), text: L('Kararlarınızın yalnızca %{0}\'i kanuna uygun. "Bu gidişle koltuğunuz tehlikede." İtibar -10.', pct), money: 0, reputation: -10 };
}

// ---------- Selin Aydın (journalist) and Müfettiş Kaya (inspector) ----------

// Day 3 morning: Selin leaves a note
export const SELIN_NOTE = {
    icon: '✉️',
    title: L('Gazeteci Selin Aydın\'dan Not'),
    text: L('Masanıza bırakılmış bir zarf: "Bakanlığın silah ihalesindeki rüşveti araştırıyorum. Belgeleri yayımlarsam beni susturmaya çalışacaklar. Bir gün dosyam önünüze gelebilir. Kanuna sadık kalacağınıza inanıyorum. — S.A."'),
    choices: [
        { label: L('Notu sakla'), value: 'keep' },
        { label: L('Notu yak'), value: 'burn' },
    ],
};

// Day 5: Selin on trial; the ministry wants her dead
export const SELIN_DIRECTIVE = {
    text: L('Bakanlık: Bugünkü "vatana ihanet" davasında en ağır ceza bekleniyor.'),
    crimeFilter: null,
    bonus: null,
    bonusAmount: 1,
};

export const SELIN_CASE = {
    crimeType: 'treason',
    name: L('Selin Aydın'),
    age: 34,
    gender: 'f',
    statement: {
        text: L('Halk, vergilerinin rüşvete gittiğini bilmeliydi. Pişman değilim.'), emotion: 'defiant', sympathy: true, law: 'whistleblower',
        detail: L('Gazeteci Selin Aydın'),
        summary: L('Bakanlığın silah ihalesindeki rüşvet yazışmalarını gazetesinde yayımladı. Savcılık "vatana ihanet" diyor.'),
        evidence: [
            L('Belgeler yalnızca gazetede yayımlanmış; yabancı bir devlete verildiğine dair hiçbir kanıt yok.'),
            L('Yayından sonra iki bakan yardımcısı rüşvetten tutuklandı.'),
        ],
        question: L('Belgeleri kime verdin?'), answer: L('Sadece okurlarıma. Bir de size Hakim Bey: gerçeği.'),
    },
    offer: {
        icon: '📞',
        title: L('Bakanlıktan bir telefon'),
        text: L('Müsteşar arıyor: "Bu kadın devletin sırlarını sattı. İdam kararı verin. ₺150.000 ikramiye ve terfi sizi bekliyor."'),
        accept: L('İdam ver'),
        decline: L('Kanunu uygula'),
        amount: 150000,
    },
};

// Day 6 morning: what became of Selin
export function selinAftermath(selin) {
    if (selin === 'death') {
        return { icon: '🕯️', title: L('Sessiz Bir Sabah'), text: L('Gazete Selin Aydın\'ın idamını küçük bir köşede verdi. Ertesi gün iki muhabir daha istifa etti. Şehirde kimse yüksek sesle konuşmuyor.'), reputation: -10, conscience: -10 };
    }
    if (selin === 'release') {
        return { icon: '📰', title: L('Selin Aydın Serbest'), text: L('Manşet: "Basın özgürlüğü kazandı." Bakanlık ise kararınızı "skandal" olarak nitelendirdi.'), reputation: 5, conscience: 0 };
    }
    if (selin === 'correct') {
        return { icon: '📰', title: L('Cezaevinden Bir Mektup'), text: L('Selin Aydın cezaevinden yazdı: "Hakim bana kanunun öngördüğü cezayı verdi; bakanlığa boyun eğmedi. Bu ülkede hâlâ hakimler var."'), reputation: 8, conscience: 3 };
    }
    return { icon: '⚖️', title: L('Temyiz Başvurusu'), text: L('Selin Aydın\'ın avukatları "ağır ceza" kararına karşı temyize gitti. Basın sizi bakanlığın sözcüsü olarak anıyor.'), reputation: -8, conscience: -5 };
}

// Day 7 morning: Kaya, depending on how lawful you have been
export function kayaVisit(accuracy) {
    if (accuracy >= 0.7) {
        return { ally: true, icon: '🕵️', title: L('Müfettiş Kaya\'nın Uyarısı'), text: L('Kaya odanızın kapısını kapattı: "Ayla Öğretmen davası son günlerine giriyor. Bakanlık dosyadaki her delil için savaşacak. Bilin ki ben kanunun yanındayım."') };
    }
    return { ally: false, icon: '🕵️', title: L('Müfettiş Kaya\'nın Tavsiyesi'), text: L('Kaya gülümsedi ama gözleri soğuktu: "Bakanlıkla iyi geçinin Hakim Bey. Ayla Öğretmen davasını fazla uzatmayın. Herkes için en iyisini yaparsınız, değil mi?"') };
}

// Day 9 morning: the press before the finale
export function finaleRumor(selin) {
    if (selin === 'correct' || selin === 'release') {
        return { icon: '📰', title: L('Selin Aydın\'ın Yeni Haberi'), text: L('Selin Aydın, bakanın oğlunun karıştığı ölümlü kazanın örtbas edilmeye çalışıldığını yazdı. Bütün şehir yarınki davayı bekliyor.'), reputation: 5 };
    }
    return { icon: '🤐', title: L('Gazeteler Susuyor'), text: L('Bakanın oğlunun karıştığı kazadan hiçbir gazete söz etmiyor. Yarınki dava sessiz sedasız görülecek.'), reputation: 0 };
}

// ---------- Appeals ----------
export function appealText(a) {
    const fix = a.tooHarsh
        ? L('Sanık tahliye edildi; haksız yere yattığı günler için devlet tazminat ödeyecek.')
        : L('Dava yeniden görülecek; sanık şimdilik serbest.');
    // Appeals saved before the case details were kept only have the short label
    if (!a.name) return L('"{0}" davasında verdiğiniz "{1}" kararı bozuldu. Kanuna göre doğrusu: {2}. {3}', a.detail, a.verdictLabel, a.correctLabel, fix);
    return L('{0}. gün gördüğünüz dava: {1}, {2} yaşında. Suç: {3} ({4}).\n{5}\n\nVerdiğiniz "{6}" kararı bozuldu. Kanuna göre doğrusu: {7}. {8}',
        a.judgedDay, a.name, a.age, a.crime, a.detail, a.summary, a.verdictLabel, a.correctLabel, fix);
}

// Names by gender so a defendant's name matches how they look
const FIRST_NAMES = {
    f: [
        'Ayşe', 'Fatma', 'Zeynep', 'Emine', 'Elif', 'Hatice', 'Merve', 'Esra', 'Derya', 'Sevgi',
        'Gül', 'Nur', 'Yasemin', 'Selma', 'Büşra', 'Canan', 'Dilek', 'Ebru', 'Filiz', 'Gamze',
        'Hülya', 'İpek', 'Kübra', 'Leyla', 'Melek', 'Nesrin', 'Özlem', 'Pınar', 'Sibel', 'Tuğba',
    ],
    m: [
        'Ahmet', 'Mehmet', 'Mustafa', 'Hüseyin', 'Hasan', 'İbrahim', 'Osman', 'Murat', 'Kemal', 'Burak',
        'Serkan', 'Cem', 'Tolga', 'Erkan', 'Barış', 'Ali', 'Emre', 'Fatih', 'Gökhan', 'Halil',
        'İsmail', 'Kadir', 'Levent', 'Mert', 'Necati', 'Okan', 'Ramazan', 'Sinan', 'Tuncay', 'Volkan',
    ],
};
const SURNAME_INITIALS = 'ABÇDEGHKMÖSŞTUYZ';

export function randomGender() {
    return Math.random() < 0.5 ? 'f' : 'm';
}

export function randomName(gender = randomGender()) {
    const list = FIRST_NAMES[gender] || FIRST_NAMES.m;
    const first = list[Math.floor(Math.random() * list.length)];
    const initial = SURNAME_INITIALS[Math.floor(Math.random() * SURNAME_INITIALS.length)];
    return `${first} ${initial}.`;
}

// Offers made to the judge during a case
export const OFFERS = {
    bribe: {
        icon: '✉️',
        title: L('Masada bir zarf'),
        text: (amount) => L('Sanığın avukatı masanıza kalın bir zarf bırakıyor: "Beraat kararı verirseniz ₺{0} sizin. Kimse bilmeyecek."', amount),
        accept: L('Zarfı al'),
        decline: L('Geri çevir'),
        forcedVerdict: 'release',
    },
    threat: {
        icon: '🗡️',
        title: L('Kapıda bir fısıltı'),
        text: () => L('Mahkeme kapısında kimliği belirsiz biri yaklaşıyor: "Bu sanığa ceza verirsen ailene geçmiş olsun, Hakim Bey."'),
        accept: L('Boyun eğ'),
        decline: L('Aldırma'),
        forcedVerdict: 'fine-minor',
    },
};

// Filler stories for the newspaper
const FILLER_NEWS = [
    L('Belediye yeni otobüs hattını hizmete açtı.'),
    L('Meteoroloji uyardı: Hafta sonu kar bekleniyor.'),
    L('Şehir stadyumunda yenileme çalışmaları başladı.'),
    L('Ekmek fiyatlarına yeni zam kapıda.'),
    L('Liman işçileri ücret artışı için toplandı.'),
    L('Hastanelerde grip yoğunluğu sürüyor.'),
    L('Tarihi çarşıda restorasyon tamamlandı.'),
    L('Okullarda yarıyıl tatili yaklaşıyor.'),
];

/**
 * Build the end-of-day newspaper from the day's verdict log.
 * Each log entry: { crime, detail, name, verdict, correct, diff, sympathy, offer, exposed, returning }
 */
// ---- Newspaper headlines that tell what the case was (Turkish only) ----
// "Dedesinin tüfeğiyle yasak bölgede avlanırken yakalandı." becomes the phrase
// "Dedesinin tüfeğiyle yasak bölgede avlanırken yakalanan", so a headline can read
// "... yakalanan Elif Z. hakkında verilen ağır ceza tepki çekti". The past-tense
// verb at the end of the first sentence turns into a participle (-an/-en).
// Returns null when that would not read well; the headline then names the case
// and its summary is printed under it.

// First sentences whose final verb belongs to someone else (a fire, a victim,
// other firms...), so "...-an <defendant>" would say the wrong thing
const NOT_THE_DEFENDANT = [
    'Piknikte attığı sigaradan çıkan yangın',
    'Balkonundaki mangaldan çıktığı söylenen yangın',
    'Para karşılığı verdiği yalan ifadeyle masum bir adam',
    'Dört firma,',
    'İnternetten "ucuz insülin" diye sattığı sahte ilacı kullanan',
    'Salgın döneminde "aşı" diye sattığı sıvıyı',
    'Ruhsatsız bir klinikte böbreği alınan genç bir göçmen',
    'Emekli maaşıyla geçinen sanık,',
    'Eski eşinin mahrem fotoğrafları',
];

const VOWELS = 'aeıioöuü';
const WHO_MAX = 90; // characters
const BACK_VOWELS = 'aıou';

export function caseWho(summary) {
    if (!summary) return null;
    if (LANG === 'en') return caseWhoEn(summary);
    if (LANG !== 'tr') return null;
    const first = summary.split(/(?<=[.!?])\s/)[0].replace(/[.!?]$/, '');
    if (NOT_THE_DEFENDANT.some(start => first.startsWith(start))) return null;
    // another finished verb inside the sentence ("girdi, ...", "yaktı ve ...") or a
    // second clause after ";" would leave half the sentence unchanged
    if (first.includes(';') || /[dt][ıiuü](,| ve | ama )/.test(first)) return null;
    const words = first.split(' ');
    const verb = words.pop();
    const past = verb.match(/^(.*)[dt][ıiuü]$/);
    if (!past) return null;
    let stem = past[1];
    if (/(yor|mış|miş|muş|müş)$/.test(stem)) return null;   // "satıyordu", "almıştı"
    if (verb === 'dedi') return [...words, 'diyen'].join(' ');
    if (verb === 'yedi') return [...words, 'yiyen'].join(' ');
    // "etmek" and its compounds soften: etti, kaybetti -> eden, kaybeden (but iletti -> ileten)
    if (/^(etti|kaybetti|kaydetti|reddetti|affetti|hissetti|seyretti)$/.test(verb)) stem = stem.replace(/et$/, 'ed');
    if (/gitti$/.test(verb)) stem = stem.replace(/git$/, 'gid'); // gitti -> giden
    const vowels = stem.split('').filter(ch => VOWELS.includes(ch));
    if (!vowels.length) return null;
    const ending = BACK_VOWELS.includes(vowels[vowels.length - 1]) ? 'an' : 'en';
    const participle = VOWELS.includes(stem[stem.length - 1]) ? `${stem}y${ending}` : stem + ending;
    const phrase = [...words, participle].join(' ');
    // a very long phrase would make the headline too long for one screen
    return phrase.length <= WHO_MAX ? phrase : null;
}

// English: the first sentence of the summary becomes a clause after the name,
// "Elif Z., caught hunting in a protected area ..." / "Mert G., who took two
// wallets ..." / "Ali V., who, while drunk at a wedding, shoved a guest ...".
// Returns null when the sentence does not start in a way that allows this.
const EN_MAX = 110; // characters
const EN_PAST = /^(took|sold|built|lent|broke|hit|beat|gave|made|set|ran|stole|shot|kept|left|put|sent|spent|told|wrote|drove|threw|bought|brought|got|led|let|paid|said|sat|stood|struck|swore|tore|wore|won|held|hid|fed|fled|fought|grew|hung|knew|lost|met|rode|shook|slid|split|spread|stuck|swept|swung|taught|thought|became|began|came|chose|drew|drank|ate|fell|flew|forgot|went|cut|lit|dug|bit|blew)$/;
// passive participles: "caught hunting", "detained because ..." - no "who"
const EN_PASSIVE = /^(caught|arrested|detained|reported|charged|accused|convicted|sentenced|identified|stopped|seen|taken)$/;
const EN_ADVERBIAL = /^(As|While|At|In|On|After|For|During|Before|When|Since|Despite|Though|Although|With|Without|Over|Under|Using|Through)\b/;

function enVerbClause(words) {
    const verb = words[0].toLowerCase();
    if (!/^[a-z-]+$/.test(verb)) return null;
    const rest = words.slice(1).join(' ');
    if (EN_PASSIVE.test(verb)) return [verb, rest].join(' ').trim();
    if (verb.endsWith('ed') || EN_PAST.test(verb)) return `who ${[verb, rest].join(' ').trim()}`;
    return null;
}

function caseWhoEn(summary) {
    let first = summary.split(/(?<=[.!?])\s/)[0].replace(/[.!?]$/, '').replace(/\."$/, '"');
    if (first.includes(';')) return null;
    let words = first.split(' ');
    let phrase = null;
    if (/^(He|She|They)$/.test(words[0])) {
        words = words.slice(1);
        if (/^(was|were)$/.test(words[0])) words = words.slice(1); // "He was caught" -> "caught"
        phrase = enVerbClause(words);
    } else if (EN_ADVERBIAL.test(first)) {
        // "While drunk at a wedding, shoved a guest" -> "who, while drunk at a wedding, shoved a guest"
        const cut = first.indexOf(', ');
        if (cut < 0) return null;
        const adverbial = first.slice(0, cut);
        if (/\b(he|she|they)\b/.test(adverbial)) return null;
        let rest = first.slice(cut + 2).split(' ');
        if (/^(he|she|they)$/.test(rest[0])) rest = rest.slice(1);
        if (/^(was|were)$/.test(rest[0]) && rest[1] && EN_PASSIVE.test(rest[1])) phrase = `who, ${adverbial.charAt(0).toLowerCase()}${adverbial.slice(1)}, ${rest.join(' ')}`;
        else {
            const clause = enVerbClause(rest);
            if (clause && clause.startsWith('who ')) phrase = `who, ${adverbial.charAt(0).toLowerCase()}${adverbial.slice(1)}, ${clause.slice(4)}`;
        }
    } else {
        phrase = enVerbClause(words);
    }
    return phrase && phrase.length <= EN_MAX ? phrase : null;
}

// Headlines for a case, built around the phrase from caseWho. Several wordings per
// kind of story, so the paper does not read the same every day.
const WHO_HEADLINES_TR = {
    appeal: [
        (w, n) => `Yargıtay bozdu: ${w} ${n} hakkında verilen karar kanuna aykırı bulundu`,
        (w, n) => `${w} ${n} hakkındaki karar Yargıtay'dan döndü`,
        (w, n) => `Yargıtay'dan hakime ders: ${w} ${n} hakkındaki karar bozuldu`,
    ],
    scandal: [
        (w, n) => `SKANDAL: ${w} ${n} davasında hakimin rüşvet aldığı ortaya çıktı!`,
        (w, n) => `Adliyede rüşvet skandalı: ${w} ${n} davasında para el değiştirdi`,
        (w, n) => `${w} ${n} davasında hakime zarf iddiası doğrulandı`,
    ],
    deathFair: [
        (w, n) => `${w} ${n} hakkında idam kararı: Adalet yerini buldu`,
        (w, n) => `${w} ${n} idama mahkûm edildi`,
        (w, n) => `Mahkeme son sözü söyledi: ${w} ${n} için idam`,
    ],
    deathWrong: [
        (w, n) => `Masum kana mı girildi? ${w} ${n} hakkında verilen idam kararı tartışılıyor`,
        (w, n) => `${w} ${n} için verilen idam kararına hukukçulardan sert tepki`,
        (w, n) => `${w} ${n} idam edilecek; karar ülkeyi ikiye böldü`,
    ],
    light: [
        (w, n) => `${w} ${n} hakkında verilen hafif ceza şaşırttı: Halk güvende mi?`,
        (w, n) => `${w} ${n} ucuz kurtuldu`,
        (w, n) => `"Bu ceza mı?" ${w} ${n} için verilen karar tepki topladı`,
        (w, n) => `${w} ${n} için verilen hafif ceza mahallede öfke yarattı`,
    ],
    heavyOutcry: [
        (w, n) => `${w} ${n} hakkında verilen ağır ceza tepki çekti`,
        (w, n) => `${w} ${n} için verilen cezaya "insafsızlık" yorumu`,
        (w, n) => `Vicdanlar sızladı: ${w} ${n} ağır ceza aldı`,
        (w, n) => `${w} ${n} için ailesi adliye önünde: "Bu ceza çok ağır"`,
    ],
    harsh: [
        (w, n) => `${w} ${n} hakkında beklenmedik sert karar`,
        (w, n) => `${w} ${n} için mahkemeden sert çıkış`,
        (w, n) => `Hukukçular şaşkın: ${w} ${n} beklenenden ağır ceza aldı`,
    ],
};

const WHO_HEADLINES_EN = {
    appeal: [
        (w, n) => `High court overturns ruling on ${n}, ${w}`,
        (w, n) => `Ruling on ${n}, ${w}, sent back by the high court`,
        (w, n) => `High court rebukes judge over ${n}, ${w}`,
    ],
    scandal: [
        (w, n) => `SCANDAL: Judge took a bribe in the case of ${n}, ${w}`,
        (w, n) => `Bribery scandal at the courthouse over ${n}, ${w}`,
        (w, n) => `Money changed hands in the case of ${n}, ${w}`,
    ],
    deathFair: [
        (w, n) => `Death sentence for ${n}, ${w}: justice is served`,
        (w, n) => `${n}, ${w}, sentenced to death`,
        (w, n) => `The court has spoken: death for ${n}, ${w}`,
    ],
    deathWrong: [
        (w, n) => `Innocent blood? Death sentence for ${n}, ${w}, sparks debate`,
        (w, n) => `Lawyers condemn death sentence for ${n}, ${w}`,
        (w, n) => `${n}, ${w}, to be executed; the country is divided`,
    ],
    light: [
        (w, n) => `Surprisingly light sentence for ${n}, ${w}: is the public safe?`,
        (w, n) => `${n}, ${w}, gets off lightly`,
        (w, n) => `"Is that a sentence?" Anger over ruling on ${n}, ${w}`,
        (w, n) => `Light sentence for ${n}, ${w}, angers neighbours`,
    ],
    heavyOutcry: [
        (w, n) => `Heavy sentence for ${n}, ${w}, draws criticism`,
        (w, n) => `"Merciless": outcry over sentence for ${n}, ${w}`,
        (w, n) => `Hearts ache as ${n}, ${w}, gets a heavy sentence`,
        (w, n) => `Family of ${n}, ${w}, outside the courthouse: "Too harsh"`,
    ],
    harsh: [
        (w, n) => `Unexpectedly harsh ruling for ${n}, ${w}`,
        (w, n) => `Court comes down hard on ${n}, ${w}`,
        (w, n) => `Lawyers stunned: ${n}, ${w}, gets a heavier sentence than expected`,
    ],
};
const WHO_HEADLINES = LANG === 'en' ? WHO_HEADLINES_EN : WHO_HEADLINES_TR;

// A news item about a case: one sentence that says what the case was when it can,
// otherwise the usual headline with the case summary under it. `used` keeps the
// wordings already in today's paper, so the same one does not appear twice.
function caseNews(kind, p, e, fallback, used) {
    const who = caseWho(e.summary);
    if (!who) return { p, text: fallback, note: e.summary };
    const options = WHO_HEADLINES[kind].filter(make => !used.has(make));
    const make = (options.length ? options : WHO_HEADLINES[kind])[Math.floor(Math.random() * (options.length || WHO_HEADLINES[kind].length))];
    used.add(make);
    return { p, text: make(who, e.name), note: '' };
}

export function buildNewspaper(dayLog, appeals = []) {
    const items = [];
    const used = new Set(); // headline wordings already in this paper

    for (const a of appeals) {
        items.push({ who: a.name, ...(a.name
            ? caseNews('appeal', 75, a, L('Yargıtay bozdu: {0} hakkındaki "{1}" davası kararı kanuna aykırı bulundu', a.name, a.detail), used)
            : { p: 75, note: '', text: L('Yargıtay bozdu: "{0}" davasındaki karar kanuna aykırı bulundu', a.detail) }) });
    }

    // One story per case: a case can be news for several reasons (a returning
    // defendant who is also sentenced to death...); only the biggest one is printed.
    for (const e of dayLog) {
        const options = [];
        if (e.exposed) {
            options.push({ p: 100, make: () => caseNews('scandal', 100, e, L('SKANDAL: Hakimin {1} hakkındaki "{0}" davasında rüşvet aldığı ortaya çıktı!', e.detail, e.name), used) });
        }
        if (e.returning) {
            options.push({ p: 80, make: () => ({ p: 80, note: e.summary, text: L('Daha önce serbest bırakılan {0} yeniden hakim karşısında', e.name) }) });
        }
        if (e.verdict === 'death') {
            options.push(e.diff === 0
                ? { p: 70, make: () => caseNews('deathFair', 70, e, L('{1} hakkındaki "{0}" davasında idam kararı: Adalet yerini buldu', e.detail, e.name), used) }
                : { p: 90, make: () => caseNews('deathWrong', 90, e, L('Masum kana mı girildi? {1} hakkındaki "{0}" davasında verilen idam kararı tartışılıyor', e.detail, e.name), used) });
        } else if (e.diff <= -2) {
            options.push({ p: 60, make: () => caseNews('light', 60, e, L('{1} hakkındaki "{0}" davasında şaşırtan hafif ceza: Halk güvende mi?', e.detail, e.name), used) });
        } else if (e.diff >= 2 && e.sympathy) {
            options.push({ p: 60, make: () => caseNews('heavyOutcry', 60, e, L('{1} hakkındaki "{0}" davasında verilen ağır ceza tepki çekti', e.detail, e.name), used) });
        } else if (e.diff >= 2) {
            options.push({ p: 40, make: () => caseNews('harsh', 40, e, L('{1} hakkındaki "{0}" davasında beklenmedik sert karar', e.detail, e.name), used) });
        }
        if (options.length) items.push({ who: e.name, ...options.reduce((best, o) => (o.p > best.p ? o : best)).make() });
    }

    if (dayLog.length > 0 && dayLog.every(e => e.correct)) {
        items.push({ p: 50, text: L('Mahkemede adil bir gün: Bütün kararlar kanuna uygun') });
    }

    items.sort((a, b) => b.p - a.p);
    // one story per person: someone back in court on the day the high court overturns
    // their earlier verdict is in the paper once, with the bigger story
    const seen = new Set();
    const news = items.filter(i => !i.who || (!seen.has(i.who) && seen.add(i.who)))
        .map(i => ({ text: i.text, note: i.note || '' }));

    const fillers = [...FILLER_NEWS].sort(() => Math.random() - 0.5);
    while (news.length < 3) {
        news.push({ text: fillers.pop(), note: '' });
    }

    // each story: a headline and, for a court case, a line on what the case was about
    return { main: news[0], side: news.slice(1, 3) };
}
