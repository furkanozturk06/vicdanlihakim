/**
 * Story Data (TURKISH)
 * Directives, defendant names, bribe/threat offers and newspaper generation.
 */

import { L } from './i18n.js';

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
        text: L('Kanuna uygun karar hazineye ve itibarına yarar. Fazla sert kararlar vicdanını, fazla hafif kararlar itibarını yer.'),
    },
    {
        target: '#stats-bar',
        title: L('Görevin'),
        text: L('Hazine ya da itibar sıfırlanırsa görevden alınırsın. On beş gün dayan; ardından hikâyen başka bir yerde sürecek. Rüşvet ve tehditlere dikkat et.'),
    },
];

// "Nasıl Oynanır" from the main menu
export const HOW_TO_PLAY = {
    icon: '📖',
    title: L('Nasıl Oynanır'),
    text: L('Her gün sanıklar karşına gelir. Dava dosyasını oku, gerekirse sanığı sorgula (günlük sorgu hakkın sınırlı) ve KANUN kitabındaki maddelere göre kararını ver.\n\nKanuna uygun karar hazineye ve itibarına yarar. Fazla sert kararlar vicdanını, fazla hafif kararlar itibarını yer. Hazine ya da itibar sıfırlanırsa görevden alınırsın.\n\nRüşvet ve tehditler gelecek; kabul etmek kolaydır ama bedeli vardır. Akşamları ailenle geçen anlar da hikâyeyi değiştirir.\n\nHikâye 30 gün sürer. Bitirince Sonsuz Mod açılır.'),
    choices: [
        { label: L('Anladım'), value: 'ok' },
        { label: L('Öğreticiyi sonraki oyunda göster'), value: 'replay' },
    ],
};

// Endless mode, unlocked by finishing the 30-day story
export const ENDLESS_INTRO = {
    title: L('Sonsuz Mod'),
    text: L('Hikâye bitti, ama mahkemenin kapısı hiç kapanmıyor.\n\nBu modda her gün yeni sanıklar gelir. Kanun, sorgu, temyiz ve teklifler aynen sürer; ama her on günde bir sorgu hakkın azalır ve rüşvet teklifleri sıklaşır.\n\nHazinen ya da itibarın sıfırlanana kadar ne kadar dayanabilirsin?'),
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
        text: L('Müsteşar arıyor: "Hakim Bey, bakanımızın oğlunun geleceği bir kaza yüzünden kararmamalı. Beraat verirseniz terfiniz ve ₺2000 ikramiye hazır."'),
        accept: L('Beraat ver'),
        decline: L('Kanunu uygula'),
        amount: 2000,
    },
};

// Recurring characters
export function inspectorReport(accuracy) {
    const pct = Math.round(accuracy * 100);
    if (accuracy >= 0.75) {
        return { title: L('Müfettiş Kaya\'nın Raporu'), text: L('Kararlarınızın %{0}\'i kanuna uygun. Bakanlık memnun: ₺150 ikramiye.', pct), money: 150, reputation: 5 };
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
        text: L('Müsteşar arıyor: "Bu kadın devletin sırlarını sattı. İdam kararı verin. ₺1500 ikramiye ve terfi sizi bekliyor."'),
        accept: L('İdam ver'),
        decline: L('Kanunu uygula'),
        amount: 1500,
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
    return L('"{0}" davasında verdiğiniz "{1}" kararı bozuldu. Kanuna göre doğrusu: {2}. {3}', a.detail, a.verdictLabel, a.correctLabel, fix);
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
export function buildNewspaper(dayLog, appeals = []) {
    const items = [];

    for (const a of appeals) {
        items.push({ p: 75, text: L('Yargıtay bozdu: "{0}" davasındaki karar kanuna aykırı bulundu', a.detail) });
    }

    for (const e of dayLog) {
        if (e.exposed) {
            items.push({ p: 100, text: L('SKANDAL: Hakimin "{0}" davasında rüşvet aldığı ortaya çıktı!', e.detail) });
        }
        if (e.returning) {
            items.push({ p: 80, text: L('Daha önce serbest bırakılan {0} yeniden hakim karşısında', e.name) });
        }
        if (e.verdict === 'death') {
            items.push(e.diff === 0
                ? { p: 70, text: L('"{0}" davasında idam kararı: Adalet yerini buldu', e.detail) }
                : { p: 90, text: L('Masum kana mı girildi? "{0}" davasındaki idam kararı tartışılıyor', e.detail) });
        } else if (e.diff <= -2) {
            items.push({ p: 60, text: L('"{0}" davasında şaşırtan hafif ceza: Halk güvende mi?', e.detail) });
        } else if (e.diff >= 2 && e.sympathy) {
            items.push({ p: 60, text: L('"{0}" davasına verilen ağır ceza tepki çekti', e.detail) });
        } else if (e.diff >= 2) {
            items.push({ p: 40, text: L('"{0}" davasında beklenmedik sert karar', e.detail) });
        }
    }

    if (dayLog.length > 0 && dayLog.every(e => e.correct)) {
        items.push({ p: 50, text: L('Mahkemede adil bir gün: Bütün kararlar kanuna uygun') });
    }

    items.sort((a, b) => b.p - a.p);
    const headlines = items.map(i => i.text);

    const fillers = [...FILLER_NEWS].sort(() => Math.random() - 0.5);
    while (headlines.length < 3) {
        headlines.push(fillers.pop());
    }

    return { main: headlines[0], side: headlines.slice(1, 3) };
}
