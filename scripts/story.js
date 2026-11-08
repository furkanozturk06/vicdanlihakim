/**
 * Story Data (TURKISH)
 * Directives, defendant names, bribe/threat offers and newspaper generation.
 */

// Daily directives from the ministry
export const DIRECTIVES = [
    {
        text: 'Bakanlık bugün artan para cezaları talep ediyor.',
        crimeFilter: ['pettyTheft', 'vandalism', 'fraud'],
        bonus: 'fine',
        bonusAmount: 1.5,
    },
    {
        text: 'Kamu güvenliği endişesi: Hapis cezalarına öncelik verin.',
        crimeFilter: ['assault', 'burglary', 'murder'],
        bonus: 'jail',
        bonusAmount: 1.3,
    },
    {
        text: 'Merhamet gösterin - cezaevleri doldu.',
        crimeFilter: null,
        bonus: 'release',
        bonusAmount: 1.5,
    },
    {
        text: 'Yolsuzlukla mücadele: Beyaz yakalı suçlara sert olun.',
        crimeFilter: ['fraud', 'corruption', 'smuggling'],
        bonus: 'jail',
        bonusAmount: 1.4,
    },
    {
        text: 'Sakin bir gün. Vicdanınızın sesini dinleyin.',
        crimeFilter: null,
        bonus: null,
        bonusAmount: 1,
    },
];

const FIRST_NAMES = [
    'Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Mustafa', 'Zeynep', 'Emine', 'Hüseyin', 'Elif', 'Hasan',
    'Hatice', 'İbrahim', 'Merve', 'Osman', 'Esra', 'Murat', 'Derya', 'Kemal', 'Sevgi', 'Burak',
    'Gül', 'Serkan', 'Nur', 'Cem', 'Deniz', 'Tolga', 'Yasemin', 'Erkan', 'Selma', 'Barış',
];
const SURNAME_INITIALS = 'ABÇDEGHKMÖSŞTUYZ';

export function randomName() {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const initial = SURNAME_INITIALS[Math.floor(Math.random() * SURNAME_INITIALS.length)];
    return `${first} ${initial}.`;
}

// Offers made to the judge during a case
export const OFFERS = {
    bribe: {
        icon: '✉️',
        title: 'Masada bir zarf',
        text: (amount) => `Sanığın avukatı masanıza kalın bir zarf bırakıyor: "Beraat kararı verirseniz ₺${amount} sizin. Kimse bilmeyecek."`,
        accept: 'Zarfı al',
        decline: 'Geri çevir',
        forcedVerdict: 'release',
    },
    threat: {
        icon: '🗡️',
        title: 'Kapıda bir fısıltı',
        text: () => 'Mahkeme kapısında kimliği belirsiz biri yaklaşıyor: "Bu sanığa ceza verirsen ailene geçmiş olsun, Hakim Bey."',
        accept: 'Boyun eğ',
        decline: 'Aldırma',
        forcedVerdict: 'fine-minor',
    },
};

// Filler stories for the newspaper
const FILLER_NEWS = [
    'Belediye yeni otobüs hattını hizmete açtı.',
    'Meteoroloji uyardı: Hafta sonu kar bekleniyor.',
    'Şehir stadyumunda yenileme çalışmaları başladı.',
    'Ekmek fiyatlarına yeni zam kapıda.',
    'Liman işçileri ücret artışı için toplandı.',
    'Hastanelerde grip yoğunluğu sürüyor.',
    'Tarihi çarşıda restorasyon tamamlandı.',
    'Okullarda yarıyıl tatili yaklaşıyor.',
];

/**
 * Build the end-of-day newspaper from the day's verdict log.
 * Each log entry: { crime, detail, name, verdict, correct, diff, sympathy, offer, exposed, returning }
 */
export function buildNewspaper(dayLog) {
    const items = [];

    for (const e of dayLog) {
        if (e.exposed) {
            items.push({ p: 100, text: `SKANDAL: Hakimin "${e.detail}" davasında rüşvet aldığı ortaya çıktı!` });
        }
        if (e.returning) {
            items.push({ p: 80, text: `Daha önce serbest bırakılan ${e.name} yeniden hakim karşısında` });
        }
        if (e.verdict === 'death') {
            items.push(e.diff === 0
                ? { p: 70, text: `"${e.detail}" davasında idam kararı: Adalet yerini buldu` }
                : { p: 90, text: `Masum kana mı girildi? "${e.detail}" davasındaki idam kararı tartışılıyor` });
        } else if (e.diff <= -2) {
            items.push({ p: 60, text: `"${e.detail}" davasında şaşırtan hafif ceza: Halk güvende mi?` });
        } else if (e.diff >= 2 && e.sympathy) {
            items.push({ p: 60, text: `"${e.detail}" davasına verilen ağır ceza tepki çekti` });
        } else if (e.diff >= 2) {
            items.push({ p: 40, text: `"${e.detail}" davasında beklenmedik sert karar` });
        }
    }

    if (dayLog.length > 0 && dayLog.every(e => e.correct)) {
        items.push({ p: 50, text: 'Mahkemede adil bir gün: Bütün kararlar kanuna uygun' });
    }

    items.sort((a, b) => b.p - a.p);
    const headlines = items.map(i => i.text);

    const fillers = [...FILLER_NEWS].sort(() => Math.random() - 0.5);
    while (headlines.length < 3) {
        headlines.push(fillers.pop());
    }

    return { main: headlines[0], side: headlines.slice(1, 3) };
}
