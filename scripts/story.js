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
    text: 'Sayın Hakim,\n\nŞehrin Ağır Ceza Mahkemesine atandınız. Önümüzdeki on beş gün boyunca kararlarınız bakanlıkça değerlendirilecektir.\n\nHer sabah bakanlığın talimatını alacaksınız. Kanun kitabı masanızda. Sanıkları sorgulamak için günlük hakkınız sınırlıdır; dosyaları dikkatle okuyun.\n\nUnutmayın: Kanun ile vicdan her zaman aynı şeyi söylemez.',
    button: 'Göreve Başla',
};

// First-game tutorial, shown on the very first case
export const TUTORIAL = [
    {
        target: '.case-file',
        title: 'Dava Dosyası',
        text: 'Sanığın kim olduğu, ne yaptığı ve deliller burada. Uzun dosyaları parmağınla kaydırabilirsin.',
    },
    {
        target: '.case-interrogation',
        title: 'Sorgu',
        text: 'Günde 3 sorgu hakkın var. Sorgu, dosyadaki gizli delili açar. Bazı davalarda doğru karar için bu delil şart.',
    },
    {
        target: '#rulebook-btn',
        title: 'Kanun Kitabı',
        text: 'Her suçun olağan cezası ve özel halleri burada yazar. Zamanla kanuna yeni ek maddeler gelecek; takipte kal.',
    },
    {
        target: '#sentencing-panel',
        title: 'Karar',
        text: 'Kanuna uygun karar hazineye ve itibarına yarar. Fazla sert kararlar vicdanını, fazla hafif kararlar itibarını yer.',
    },
    {
        target: '#stats-bar',
        title: 'Görevin',
        text: 'Hazine ya da itibar sıfırlanırsa görevden alınırsın. On beş gün dayan; ardından hikâyen başka bir yerde sürecek. Rüşvet ve tehditlere dikkat et.',
    },
];

// "Nasıl Oynanır" from the main menu
export const HOW_TO_PLAY = {
    icon: '📖',
    title: 'Nasıl Oynanır',
    text: 'Her gün sanıklar karşına gelir. Dava dosyasını oku, gerekirse sanığı sorgula (günlük sorgu hakkın sınırlı) ve KANUN kitabındaki maddelere göre kararını ver.\n\nKanuna uygun karar hazineye ve itibarına yarar. Fazla sert kararlar vicdanını, fazla hafif kararlar itibarını yer. Hazine ya da itibar sıfırlanırsa görevden alınırsın.\n\nRüşvet ve tehditler gelecek; kabul etmek kolaydır ama bedeli vardır. Akşamları ailenle geçen anlar da hikâyeyi değiştirir.\n\nHikâye 30 gün sürer. Bitirince Sonsuz Mod açılır.',
    choices: [
        { label: 'Anladım', value: 'ok' },
        { label: 'Öğreticiyi sonraki oyunda göster', value: 'replay' },
    ],
};

// Endless mode, unlocked by finishing the 30-day story
export const ENDLESS_INTRO = {
    title: 'Sonsuz Mod',
    text: 'Hikâye bitti, ama mahkemenin kapısı hiç kapanmıyor.\n\nBu modda her gün yeni sanıklar gelir. Kanun, sorgu, temyiz ve teklifler aynen sürer; ama her on günde bir sorgu hakkın azalır ve rüşvet teklifleri sıklaşır.\n\nHazinen ya da itibarın sıfırlanana kadar ne kadar dayanabilirsin?',
    button: 'Kürsüye Çık',
};

// Minister's son: the fixed last case of the last day
export const FINALE = {
    crimeType: 'traffic',
    name: 'Kerem B.',
    age: 24,
    gender: 'm',
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

// ---------- Selin Aydın (journalist) and Müfettiş Kaya (inspector) ----------

// Day 3 morning: Selin leaves a note
export const SELIN_NOTE = {
    icon: '✉️',
    title: "Gazeteci Selin Aydın'dan Not",
    text: 'Masanıza bırakılmış bir zarf: "Bakanlığın silah ihalesindeki rüşveti araştırıyorum. Belgeleri yayımlarsam beni susturmaya çalışacaklar. Bir gün dosyam önünüze gelebilir. Kanuna sadık kalacağınıza inanıyorum. — S.A."',
    choices: [
        { label: 'Notu sakla', value: 'keep' },
        { label: 'Notu yak', value: 'burn' },
    ],
};

// Day 5: Selin on trial; the ministry wants her dead
export const SELIN_DIRECTIVE = {
    text: 'Bakanlık: Bugünkü "vatana ihanet" davasında en ağır ceza bekleniyor.',
    crimeFilter: null,
    bonus: null,
    bonusAmount: 1,
};

export const SELIN_CASE = {
    crimeType: 'treason',
    name: 'Selin Aydın',
    age: 34,
    gender: 'f',
    statement: {
        text: 'Halk, vergilerinin rüşvete gittiğini bilmeliydi. Pişman değilim.', emotion: 'defiant', sympathy: true, law: 'whistleblower',
        detail: 'Gazeteci Selin Aydın',
        summary: 'Bakanlığın silah ihalesindeki rüşvet yazışmalarını gazetesinde yayımladı. Savcılık "vatana ihanet" diyor.',
        evidence: [
            'Belgeler yalnızca gazetede yayımlanmış; yabancı bir devlete verildiğine dair hiçbir kanıt yok.',
            'Yayından sonra iki bakan yardımcısı rüşvetten tutuklandı.',
        ],
        question: 'Belgeleri kime verdin?', answer: 'Sadece okurlarıma. Bir de size Hakim Bey: gerçeği.',
    },
    offer: {
        icon: '📞',
        title: 'Bakanlıktan bir telefon',
        text: 'Müsteşar arıyor: "Bu kadın devletin sırlarını sattı. İdam kararı verin. ₺1500 ikramiye ve terfi sizi bekliyor."',
        accept: 'İdam ver',
        decline: 'Kanunu uygula',
        amount: 1500,
    },
};

// Day 6 morning: what became of Selin
export function selinAftermath(selin) {
    if (selin === 'death') {
        return { icon: '🕯️', title: 'Sessiz Bir Sabah', text: "Gazete Selin Aydın'ın idamını küçük bir köşede verdi. Ertesi gün iki muhabir daha istifa etti. Şehirde kimse yüksek sesle konuşmuyor.", reputation: -10, conscience: -10 };
    }
    if (selin === 'release') {
        return { icon: '📰', title: 'Selin Aydın Serbest', text: 'Manşet: "Basın özgürlüğü kazandı." Bakanlık ise kararınızı "skandal" olarak nitelendirdi.', reputation: 5, conscience: 0 };
    }
    if (selin === 'correct') {
        return { icon: '📰', title: 'Cezaevinden Bir Mektup', text: 'Selin Aydın cezaevinden yazdı: "Hakim bana kanunun öngördüğü cezayı verdi; bakanlığa boyun eğmedi. Bu ülkede hâlâ hakimler var."', reputation: 8, conscience: 3 };
    }
    return { icon: '⚖️', title: 'Temyiz Başvurusu', text: "Selin Aydın'ın avukatları \"ağır ceza\" kararına karşı temyize gitti. Basın sizi bakanlığın sözcüsü olarak anıyor.", reputation: -8, conscience: -5 };
}

// Day 7 morning: Kaya, depending on how lawful you have been
export function kayaVisit(accuracy) {
    if (accuracy >= 0.7) {
        return { ally: true, icon: '🕵️', title: "Müfettiş Kaya'nın Uyarısı", text: 'Kaya odanızın kapısını kapattı: "Son gün size bakanın oğlunun dosyası gelecek. Sarhoş araba kullanıp bir öğretmeni öldürdü. Bakanlık sizi deneyecek. Bilin ki ben kanunun yanındayım."' };
    }
    return { ally: false, icon: '🕵️', title: "Müfettiş Kaya'nın Tavsiyesi", text: 'Kaya gülümsedi ama gözleri soğuktu: "Bakanlıkla iyi geçinin Hakim Bey. Son gün önemli bir dosya gelecek. Herkes için en iyisini yaparsınız, değil mi?"' };
}

// Day 9 morning: the press before the finale
export function finaleRumor(selin) {
    if (selin === 'correct' || selin === 'release') {
        return { icon: '📰', title: "Selin Aydın'ın Yeni Haberi", text: 'Selin Aydın, bakanın oğlunun karıştığı ölümlü kazanın örtbas edilmeye çalışıldığını yazdı. Bütün şehir yarınki davayı bekliyor.', reputation: 5 };
    }
    return { icon: '🤐', title: 'Gazeteler Susuyor', text: 'Bakanın oğlunun karıştığı kazadan hiçbir gazete söz etmiyor. Yarınki dava sessiz sedasız görülecek.', reputation: 0 };
}

// ---------- Appeals ----------
export function appealText(a) {
    const fix = a.tooHarsh
        ? 'Sanık tahliye edildi; haksız yere yattığı günler için devlet tazminat ödeyecek.'
        : 'Dava yeniden görülecek; sanık şimdilik serbest.';
    return `"${a.detail}" davasında verdiğiniz "${a.verdictLabel}" kararı bozuldu. Kanuna göre doğrusu: ${a.correctLabel}. ${fix}`;
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
export function buildNewspaper(dayLog, appeals = []) {
    const items = [];

    for (const a of appeals) {
        items.push({ p: 75, text: `Yargıtay bozdu: "${a.detail}" davasındaki karar kanuna aykırı bulundu` });
    }

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
