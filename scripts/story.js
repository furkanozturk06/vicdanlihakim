/**
 * Story Data (TURKISH)
 * Directives, defendant names, bribe/threat offers and newspaper generation.
 */

// Daily directives from the ministry
export const DIRECTIVES = [
    {
        text: 'Bakanlık bugün artan para cezaları talep ediyor.',
        crimeFilter: ['pettyTheft', 'vandalism', 'fraud', 'blackmail'],
        bonus: 'fine',
        bonusAmount: 1.5,
    },
    {
        text: 'Kamu güvenliği endişesi: Hapis cezalarına öncelik verin.',
        crimeFilter: ['assault', 'burglary', 'murder', 'arson'],
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
        crimeFilter: ['fraud', 'corruption', 'smuggling', 'blackmail'],
        bonus: 'jail',
        bonusAmount: 1.4,
    },
    {
        text: 'Sakin bir gün. Vicdanınızın sesini dinleyin.',
        crimeFilter: null,
        bonus: null,
        bonusAmount: 1,
    },
    {
        text: 'Trafik haftası: Yollarda düzeni sağlayın.',
        crimeFilter: ['traffic'],
        bonus: 'jail',
        bonusAmount: 1.3,
    },
    {
        text: 'Uyuşturucuyla mücadele: Satıcılara göz açtırmayın.',
        crimeFilter: ['drugs'],
        bonus: 'jail',
        bonusAmount: 1.3,
    },
    {
        text: 'Olağanüstü güvenlik toplantısı: Devlete ve halka karşı suçlarda taviz yok.',
        crimeFilter: ['terrorism', 'treason', 'armsTrafficking', 'humanTrafficking'],
        bonus: 'jail',
        bonusAmount: 1.3,
    },
];

export const FINAL_DIRECTIVE = {
    text: 'Bakanlık: Bugünkü son davada "hassasiyet" bekleniyor.',
    crimeFilter: null,
    bonus: null,
    bonusAmount: 1,
};

export const INTRO = {
    title: 'Adalet Bakanlığı',
    text: 'Sayın Hakim,\n\nŞehrin Ağır Ceza Mahkemesine atandınız. Önümüzdeki on gün boyunca kararlarınız bakanlıkça değerlendirilecektir.\n\nHer sabah bakanlığın talimatını alacaksınız. Kanun kitabı masanızda. Sanıkları sorgulamak için günlük hakkınız sınırlıdır; dosyaları dikkatle okuyun.\n\nUnutmayın: Kanun ile vicdan her zaman aynı şeyi söylemez.',
    button: 'Göreve Başla',
};

// Minister's son: the fixed last case of the last day
export const FINALE = {
    crimeType: 'traffic',
    name: 'Kerem B.',
    age: 24,
    statement: {
        text: 'Babamın kim olduğunu biliyor musunuz? Bu dava burada kapanır.', emotion: 'proud', sympathy: false, law: 'flee', tags: ['alcohol'],
        detail: 'Bakanın oğlu',
        summary: 'Gece alkollü araç kullanırken yaya geçidinde bir öğretmene çarpıp kaçtı. Öğretmen hayatını kaybetti.',
        evidence: [
            'Kandaki alkol: 1,9 promil; araç olay yerinden 3 km ötede terk edilmiş bulundu.',
            'Araç Adalet Bakanı adına kayıtlı; sürücünün bakanın oğlu olduğu kamera kaydıyla doğrulandı.',
        ],
        question: 'Neden durmadın?', answer: 'Durmama gerek yoktu. Babam halleder, siz de bilirsiniz.',
    },
    offer: {
        icon: '📞',
        title: 'Bakanlıktan bir telefon',
        text: 'Müsteşar arıyor: "Hakim Bey, bakanımızın oğlunun geleceği bir kaza yüzünden kararmamalı. Beraat verirseniz terfiniz ve ₺2000 ikramiye hazır."',
        accept: 'Beraat ver',
        decline: 'Kanunu uygula',
        amount: 2000,
    },
};

// Recurring characters
export function inspectorReport(accuracy) {
    const pct = Math.round(accuracy * 100);
    if (accuracy >= 0.75) {
        return { title: "Müfettiş Kaya'nın Raporu", text: `Kararlarınızın %${pct}'i kanuna uygun. Bakanlık memnun: ₺150 ikramiye.`, money: 150, reputation: 5 };
    }
    if (accuracy >= 0.5) {
        return { title: "Müfettiş Kaya'nın Raporu", text: `Kararlarınızın %${pct}'i kanuna uygun. "Fena değil, ama kanun kitabını daha sık açın."`, money: 0, reputation: 0 };
    }
    return { title: "Müfettiş Kaya'nın Raporu", text: `Kararlarınızın yalnızca %${pct}'i kanuna uygun. "Bu gidişle koltuğunuz tehlikede." İtibar -10.`, money: 0, reputation: -10 };
}

export function journalistVisit(reputation) {
    if (reputation >= 75) {
        return { title: 'Selin Aydın ile Röportaj', text: 'Gazeteci Selin Aydın sizi manşete taşıdı: "Şehrin en adil hakimi." İtibar +5.', reputation: 5 };
    }
    if (reputation <= 40) {
        return { title: "Selin Aydın'ın Dosyası", text: 'Gazeteci Selin Aydın mahkemenizi araştırıyor: "Ağır Ceza\'da neler oluyor?" İtibar -5.', reputation: -5 };
    }
    return null;
}

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
