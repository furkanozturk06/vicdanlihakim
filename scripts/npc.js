/**
 * NPC Generator Module
 * Handles case generation, NPC creation, and verdict validation
 */

// Case database (TURKISH)
// Each statement carries its own detail (crime subtitle), case summary and evidence,
// so the case file always matches what the defendant says.
const CASE_DATABASE = {
    pettyTheft: {
        crime: "Hırsızlık",
        severity: 1,
        statements: [
            {
                text: "Sadece bir ekmek aldım... çocuklarım açlıktan ölüyordu.", emotion: "remorseful", correctVerdict: "release", sympathy: true,
                detail: "Gıda",
                summary: "Mahalle fırınından iki ekmek alıp parasını ödemeden kaçarken yakalandı. Fırıncı şikayetini geri çekmek istiyor.",
                evidence: ["Çalınan mal: 2 ekmek (₺30).", "Sabıka kaydı yok; üç çocuğuyla tek başına yaşıyor."]
            },
            {
                text: "Ne olmuş biraz takı aldıysam? Zenginlerin çok parası var.", emotion: "defiant", correctVerdict: "fine-minor", sympathy: false,
                detail: "Mücevher",
                summary: "Bir kuyumcu vitrininden altın kolye alıp ceketine saklarken güvenlik görevlisine yakalandı. Kolye sahibine iade edildi.",
                evidence: ["Kolyenin değeri: ₺4.000; zarar oluşmadı.", "Güvenlik kamerası olayı açıkça gösteriyor."]
            },
            {
                text: "Ben... istemeden yaptım. Bir anlık dürtüydü. Çok özür dilerim.", emotion: "panicked", correctVerdict: "fine-minor", sympathy: true,
                detail: "Market",
                summary: "Süpermarketten çikolata ve parfüm alıp kasadan geçmeden çıkmaya çalıştı. Kapıdaki alarm çaldı.",
                evidence: ["Ürünlerin değeri: ₺650.", "İlk suçu; olay yerinde ağlayarak suçunu kabul etti."]
            },
            {
                text: "Cüzdanlarını masada bıraktılar. Kendi hataları.", emotion: "defiant", correctVerdict: "fine-moderate", sympathy: false,
                detail: "Cüzdan",
                summary: "Bir kafede masada unutulan iki cüzdanı alıp içindeki parayı harcadı. Kartlarla alışveriş yapmaya çalışırken yakalandı.",
                evidence: ["Harcanan para: ₺3.500; geri ödenmedi.", "Daha önce benzer bir olaydan uyarı almış."]
            },
        ]
    },
    assault: {
        crime: "Darp",
        severity: 3,
        statements: [
            {
                text: "Önce o kız kardeşime saldırdı. Onu koruyordum!", emotion: "defiant", correctVerdict: "release", sympathy: true,
                detail: "Meşru müdafaa iddiası",
                summary: "Bir barın önünde kız kardeşini taciz eden adama yumruk attı. Adamın burnu kırıldı.",
                evidence: ["Tanıklar, mağdurun önce kız kardeşe saldırdığını doğruluyor.", "Kız kardeşin kolunda yeni morluklar var."]
            },
            {
                text: "Sinirlerime hakim olamadım. Yanlış yaptığımı biliyorum, Sayın Hakim.", emotion: "remorseful", correctVerdict: "house-arrest", sympathy: true,
                detail: "Trafik kavgası",
                summary: "Trafikte yol verme tartışmasında arabasından inip diğer sürücüyü tekmeledi. Mağdur iki gün hastanede kaldı.",
                evidence: ["Doktor raporu: hafif yaralanma, kırık yok.", "Sabıkası yok; olaydan sonra mağduru hastanede ziyaret etmiş."]
            },
            {
                text: "O adam ailemin onuruna hakaret etti. Hak etti.", emotion: "proud", correctVerdict: "jail-short", sympathy: false,
                detail: "Kahvehane kavgası",
                summary: "Kahvehanede tartıştığı adamı sandalyeyle dövdü. Mağdurun kaşı patladı, masalar devrildi.",
                evidence: ["Mağdura 6 dikiş atıldı.", "Sanığın 2 yıl önce de darp kaydı var."]
            },
            {
                text: "Hiçbir şey hatırlamıyorum... sarhoştum.", emotion: "panicked", correctVerdict: "house-arrest", sympathy: false,
                detail: "Alkollü kavga",
                summary: "Bir düğünde alkollüyken bir misafiri itip yere düşürdü. Misafirin bileği burkuldu.",
                evidence: ["Olay anında kandaki alkol: 1,8 promil.", "Mağdur şikayetçi; sanığın sabıkası yok."]
            },
        ]
    },
    fraud: {
        crime: "Dolandırıcılık",
        severity: 4,
        statements: [
            {
                text: "Yatırımcılar riskleri biliyordu! Benim suçum değil.", emotion: "defiant", correctVerdict: "jail-medium", sympathy: false,
                detail: "Sahte yatırım",
                summary: "Yüksek kâr vaadiyle 40 kişiden para topladı, sonra şirketini kapatıp parayla ortadan kayboldu.",
                evidence: ["Toplanan para: ₺2.000.000; geri ödeme yok.", "Yatırımcılara gösterilen kâr raporları sahte."]
            },
            {
                text: "Çaresizdim... işlerim batıyordu. Özür dilerim.", emotion: "remorseful", correctVerdict: "fine-major", sympathy: true,
                detail: "Sigorta hilesi",
                summary: "Batmak üzere olan dükkanını kurtarmak için sigorta şirketine sahte hasar faturaları sundu.",
                evidence: ["Haksız alınan ödeme: ₺80.000.", "Parayı geri ödemeyi teklif etti; sabıkası yok."]
            },
            {
                text: "Sistem zaten hileli. Ben sadece kurallarına göre oynadım.", emotion: "proud", correctVerdict: "jail-short", sympathy: false,
                detail: "Vergi hilesi",
                summary: "Paravan şirketler kurarak üç yıl boyunca vergi ödemekten kaçındı.",
                evidence: ["Ödenmeyen vergi: ₺450.000.", "Muhasebe kayıtlarında bilerek yapılmış tahrifat var."]
            },
            {
                text: "Kimse fark etmeden geri ödeyebileceğimi düşündüm...", emotion: "panicked", correctVerdict: "house-arrest", sympathy: true,
                detail: "Zimmet",
                summary: "Annesinin ameliyat masrafı için çalıştığı şirketin kasasından aylarca küçük miktarlar aldı.",
                evidence: ["Eksik para: ₺60.000; ₺25.000'i geri ödendi.", "İşvereni hapis yerine geri ödeme istiyor."]
            },
        ]
    },
    burglary: {
        crime: "Soygun",
        severity: 3,
        statements: [
            {
                text: "Hasta annem için ilaca ihtiyacım vardı. Başka şansım yoktu.", emotion: "remorseful", correctVerdict: "house-arrest", sympathy: true,
                detail: "Eczane",
                summary: "Gece kapalı bir eczanenin camını kırıp içeri girdi, yalnızca kalp ilacı aldı.",
                evidence: ["Alınan: 3 kutu kalp ilacı; kasaya dokunulmamış.", "Üzerinde annesinin reçetesi bulundu."]
            },
            {
                text: "Boş evler serbest avdır. Kimseye zarar geldi mi?", emotion: "defiant", correctVerdict: "jail-short", sympathy: false,
                detail: "Yazlık ev",
                summary: "Sahipleri tatildeyken bir evin kilidini kırıp televizyon ve dizüstü bilgisayar çaldı.",
                evidence: ["Çalınan eşyaların değeri: ₺35.000.", "Eşyaların bir kısmı ikinci el pazarında satılmış."]
            },
            {
                text: "Evsizim... sadece sıcak bir yer istiyordum.", emotion: "panicked", correctVerdict: "release", sympathy: true,
                detail: "Boş bina",
                summary: "Bir kış gecesi terk edilmiş bir binanın kapısını zorladı, içeride uyurken bulundu. Hiçbir şey alınmamış.",
                evidence: ["O gece hava sıcaklığı -8°C.", "Bina 5 yıldır boş; sahibi şikayetçi değil."]
            },
            {
                text: "Zenginler neyin eksik olduğunu fark bile etmezler.", emotion: "proud", correctVerdict: "jail-medium", sympathy: false,
                detail: "Villa",
                summary: "Bir villanın alarmını devre dışı bırakıp kasasını açtı, mücevher ve nakit çaldı.",
                evidence: ["Çalınan değer: ₺400.000.", "Alarmı kesmek için özel alet kullanılmış; önceden keşif yapılmış."]
            },
        ]
    },
    vandalism: {
        crime: "Mala Zarar Verme",
        severity: 2,
        statements: [
            {
                text: "Bu sanat! Duvar zaten sıkıcıydı.", emotion: "proud", correctVerdict: "fine-moderate", sympathy: false,
                detail: "Grafiti",
                summary: "Belediye binasının yeni restore edilmiş taş cephesine sprey boyayla büyük bir grafiti çizdi.",
                evidence: ["Temizlik maliyeti: ₺15.000.", "Aynı imzayla şehirde 6 grafiti daha var."]
            },
            {
                text: "Sinirlendim... düşünmedim. Zararı ödeyeceğim.", emotion: "remorseful", correctVerdict: "fine-minor", sympathy: true,
                detail: "Araç hasarı",
                summary: "Komşusuyla park yeri kavgasından sonra komşusunun arabasının aynasını kırdı.",
                evidence: ["Hasar: ₺2.500.", "Ertesi gün kendisi karakola gidip teslim oldu."]
            },
            {
                text: "O bina babamı işten atan şirketin!", emotion: "defiant", correctVerdict: "fine-minor", sympathy: true,
                detail: "Fabrika camları",
                summary: "Babasını işten çıkaran fabrikanın giriş kapısındaki camlara taş attı.",
                evidence: ["3 cam kırıldı; hasar ₺4.000.", "Fabrika 200 işçiyi tazminat ödemeden çıkarmış."]
            },
            {
                text: "Arkadaşlarım meydan okudu... ne kadar aptalım.", emotion: "panicked", correctVerdict: "fine-minor", sympathy: true,
                detail: "Park",
                summary: "Arkadaşlarıyla gece parktaki bankları ve çöp kutularını devirdi, bir lambayı kırdı.",
                evidence: ["Hasar: ₺3.000.", "Sanık 18 yaşında; arkadaşları olay yerinden kaçmış."]
            },
        ]
    },
    murder: {
        crime: "Cinayet",
        severity: 5,
        statements: [
            {
                text: "Kızımı öldürecekti. Başka seçeneğim yoktu!", emotion: "panicked", correctVerdict: "release", sympathy: true,
                detail: "Meşru müdafaa iddiası",
                summary: "Evine silahla giren ve kızını rehin alan bir adamı mutfak bıçağıyla öldürdü.",
                evidence: ["Maktulün elinde dolu bir silah bulundu.", "Kızı, adamın kendisini tehdit ettiğini doğruluyor."]
            },
            {
                text: "Pişman değilim. O canavar ölmeyi hak ediyordu.", emotion: "defiant", correctVerdict: "jail-long", sympathy: false,
                detail: "İntikam",
                summary: "Yıllar önce kardeşini öldüren ve cezasını çekip çıkan adamı evinin önünde bekleyip vurdu.",
                evidence: ["Silahı olaydan bir hafta önce satın almış.", "Kamera kayıtlarında maktulü günlerce takip ettiği görülüyor."]
            },
            {
                text: "Kaza oldu... silah patladı. Yemin ederim!", emotion: "panicked", correctVerdict: "jail-medium", sympathy: true,
                detail: "Kaza iddiası",
                summary: "Ruhsatsız tabancasını arkadaşına gösterirken silah ateş aldı, arkadaşı hayatını kaybetti.",
                evidence: ["Silah ruhsatsız ve emniyeti açık bırakılmış.", "Tanıklar ikisi arasında husumet olmadığını söylüyor."]
            },
            {
                text: "Bunu yapmam için para aldım. Sadece bir araçtım.", emotion: "remorseful", correctVerdict: "death", sympathy: false,
                detail: "Kiralık katil",
                summary: "Para karşılığında tanımadığı bir iş insanını otoparkta pusu kurarak öldürdü.",
                evidence: ["Hesabına olaydan bir gün önce ₺500.000 yatırılmış.", "Daha önce iki benzer cinayetle bağlantılı."]
            },
            {
                text: "Sesler... bana yapmamı söylediler.", emotion: "panicked", correctVerdict: "house-arrest", sympathy: true,
                detail: "Akıl sağlığı",
                summary: "Ağır bir psikoz atağı sırasında komşusunu öldürdü. Olaydan sonra polisi kendisi aradı.",
                evidence: ["Adli tıp raporu: olay anında ağır şizofreni atağı.", "3 yıldır tedavi görüyor; ilaçları kesilmişti."]
            },
        ]
    },
    corruption: {
        crime: "Yolsuzluk",
        severity: 4,
        statements: [
            {
                text: "Herkes rüşvet alıyor. Ben sadece yakalanan oldum.", emotion: "defiant", correctVerdict: "jail-medium", sympathy: false,
                detail: "Rüşvet",
                summary: "Belediye imar müdürüyken kaçak binalara izin vermek için müteahhitlerden düzenli rüşvet aldı.",
                evidence: ["Hesabında açıklanamayan ₺3.000.000 var.", "İzin verdiği 14 binanın denetim raporu sahte."]
            },
            {
                text: "Bunu bölgem için yaptım... okullar ve yollar inşa etmek için.", emotion: "proud", correctVerdict: "fine-major", sympathy: true,
                detail: "Usulsüz ihale",
                summary: "Belediye başkanıyken ihaleleri akrabalarının firmalarına verdi. İşler bitti ama fiyatlar şişirildi.",
                evidence: ["Kamu zararı: ₺900.000.", "Yapılan okullar ve yollar tamamlanmış ve kullanılıyor."]
            },
            {
                text: "Tehdit edildim... aileme zarar vereceklerdi.", emotion: "panicked", correctVerdict: "house-arrest", sympathy: true,
                detail: "Baskı altında",
                summary: "Gümrük memuruyken bir çetenin kamyonlarını kontrol etmeden geçirdi.",
                evidence: ["Telefonunda ailesine yönelik tehdit mesajları var.", "Banka kayıtlarında para aldığına dair iz yok."]
            },
            {
                text: "Güç yozlaştırır, Sayın Hakim. Nefret ettiğim şey oldum.", emotion: "remorseful", correctVerdict: "jail-short", sympathy: true,
                detail: "Görevi kötüye kullanma",
                summary: "Bakanlıkta yöneticiyken kamu araçlarını ve bütçesini özel tatilleri için kullandı.",
                evidence: ["Kamu zararı: ₺250.000.", "Soruşturma başlayınca istifa etti, parayı iade etmeye başladı."]
            },
        ]
    },
    smuggling: {
        crime: "Kaçakçılık",
        severity: 3,
        statements: [
            {
                text: "Ben sadece şoförüydüm! Kamyonda ne olduğunu bilmiyordum.", emotion: "panicked", correctVerdict: "fine-moderate", sympathy: true,
                detail: "Sigara",
                summary: "Kullandığı kamyonun dorsesindeki gizli bölmede 5.000 karton kaçak sigara bulundu.",
                evidence: ["Gizli bölme, sanık işe başlamadan önce yapılmış.", "Kamyonun sahibi yurt dışına kaçtı."]
            },
            {
                text: "İnsanların bu mallara ihtiyacı var. Sınırlar adaletsiz.", emotion: "defiant", correctVerdict: "jail-short", sympathy: false,
                detail: "Elektronik",
                summary: "Gümrükte beyan etmeden 300 cep telefonu sokmaya çalışırken yakalandı.",
                evidence: ["Kaçak mal değeri: ₺1.500.000.", "Son bir yılda 11 kez sınırdan geçmiş."]
            },
            {
                text: "Ailem bu para olmadan açlıktan ölürdü.", emotion: "remorseful", correctVerdict: "house-arrest", sympathy: true,
                detail: "Akaryakıt",
                summary: "Sınır köyünde kaçak akaryakıt taşıyıp satarken yakalandı.",
                evidence: ["Araçta 2.000 litre kaçak akaryakıt bulundu.", "Köyde başka geçim kaynağı yok; 5 çocuğu var."]
            },
            {
                text: "Fakirler için ilaç bu. Bu nasıl suç olabilir?", emotion: "proud", correctVerdict: "fine-minor", sympathy: true,
                detail: "İlaç",
                summary: "Ülkede bulunmayan kanser ilaçlarını beyan etmeden getirip hastalara maliyetine sattı.",
                evidence: ["Satış kayıtları kâr etmediğini doğruluyor.", "İlaçların tamamı orijinal ve ruhsatlı."]
            },
        ]
    }
};

// NPC appearance options
const NPC_APPEARANCES = {
    skinTones: ['#f5d0c5', '#e8beac', '#d4a574', '#c68642', '#8d5524', '#5c3811'],
    hairColors: ['#1a1a1a', '#4a3728', '#8b6914', '#d4a574', '#c9c9c9', '#2c1810'],
    clothingColors: ['#2d3748', '#4a5568', '#553c2e', '#1a365d', '#2f4858', '#4a3728', '#5c4033'],
};

// Generate random NPC appearance
function generateNPCAppearance() {
    const skin = NPC_APPEARANCES.skinTones[Math.floor(Math.random() * NPC_APPEARANCES.skinTones.length)];
    const hair = NPC_APPEARANCES.hairColors[Math.floor(Math.random() * NPC_APPEARANCES.hairColors.length)];
    const clothing = NPC_APPEARANCES.clothingColors[Math.floor(Math.random() * NPC_APPEARANCES.clothingColors.length)];

    return { skin, hair, clothing };
}

// Generate a random case
export function generateCase(day = 1, directive = null) {
    const crimeTypes = Object.keys(CASE_DATABASE);

    // Weight crime types based on day progression
    let availableCrimes = crimeTypes;
    if (day < 3) {
        // Early days: lighter crimes
        availableCrimes = crimeTypes.filter(c => CASE_DATABASE[c].severity <= 3);
    } else if (day < 5) {
        // Mid game: all crimes
        availableCrimes = crimeTypes;
    } else {
        // Late game: heavier crimes more common
        availableCrimes = crimeTypes.filter(c => CASE_DATABASE[c].severity >= 3);
    }

    // Apply directive filtering if present
    if (directive && directive.crimeFilter) {
        const filtered = availableCrimes.filter(c => directive.crimeFilter.includes(c));
        if (filtered.length > 0) {
            availableCrimes = filtered;
        }
    }

    const crimeType = availableCrimes[Math.floor(Math.random() * availableCrimes.length)];
    const crimeData = CASE_DATABASE[crimeType];
    const statement = crimeData.statements[Math.floor(Math.random() * crimeData.statements.length)];

    return {
        id: Date.now(),
        crimeType,
        crime: `${crimeData.crime} – ${statement.detail}`,
        severity: crimeData.severity,
        statement: statement.text,
        emotion: statement.emotion,
        correctVerdict: statement.correctVerdict,
        sympathy: statement.sympathy,
        summary: statement.summary,
        evidence: statement.evidence,
        appearance: generateNPCAppearance(),
    };
}

// Create NPC HTML element
export function createNPCElement(caseData) {
    const { appearance, emotion } = caseData;

    const npc = document.createElement('div');
    npc.className = `npc ${emotion}`;
    npc.innerHTML = `
        <div class="npc-head" style="background: ${appearance.skin}">
            <div class="npc-hair" style="background: ${appearance.hair}"></div>
            <div class="npc-face">
                <div class="npc-eyes">
                    <div class="npc-eye"></div>
                    <div class="npc-eye"></div>
                </div>
                <div class="npc-mouth"></div>
            </div>
        </div>
        <div class="npc-body" style="background: ${appearance.clothing}"></div>
    `;

    return npc;
}

// Validate verdict against correct answer
export function validateVerdict(caseData, verdict, subOption = null) {
    const correct = caseData.correctVerdict;

    // Build the player's full verdict string
    let playerVerdict = verdict;
    if (subOption) {
        playerVerdict = `${verdict}-${subOption}`;
    }

    // Exact match
    if (playerVerdict === correct) {
        return { correct: true, severity: 0 };
    }

    // Partial match logic (e.g., jail-short when jail-medium is correct)
    const [correctBase, correctLevel] = correct.split('-');
    const [playerBase, playerLevel] = playerVerdict.split('-');

    if (correctBase === playerBase) {
        // Same type but different severity - partial credit
        const levels = ['minor', 'short', 'moderate', 'medium', 'major', 'long'];
        const correctIdx = levels.indexOf(correctLevel) || 0;
        const playerIdx = levels.indexOf(playerLevel) || 0;
        const diff = Math.abs(correctIdx - playerIdx);

        if (diff <= 1) {
            return { correct: true, severity: 1, partial: true };
        }
    }

    // Calculate how wrong the verdict is
    const verdictSeverity = getVerdictSeverity(playerVerdict);
    const correctSeverity = getVerdictSeverity(correct);
    const severityDiff = Math.abs(verdictSeverity - correctSeverity);

    return {
        correct: false,
        severity: severityDiff,
        tooHarsh: verdictSeverity > correctSeverity,
        tooLenient: verdictSeverity < correctSeverity
    };
}

// Get numeric severity for a verdict
function getVerdictSeverity(verdict) {
    const severityMap = {
        'release': 0,
        'fine-minor': 1,
        'fine-moderate': 2,
        'fine-major': 3,
        'house-arrest': 4,
        'jail-short': 5,
        'jail-medium': 6,
        'jail-long': 7,
        'death': 10
    };
    return severityMap[verdict] ?? 3;
}

// Daily directives (TURKISH)
const DIRECTIVES = [
    {
        text: "Bakanlık bugün artan para cezaları talep ediyor.",
        crimeFilter: ['pettyTheft', 'vandalism', 'fraud'],
        bonus: 'fine',
        bonusAmount: 1.5
    },
    {
        text: "Kamu güvenliği endişesi: Hapis cezalarına öncelik verin.",
        crimeFilter: ['assault', 'burglary', 'murder'],
        bonus: 'jail',
        bonusAmount: 1.3
    },
    {
        text: "Merhamet gösterin - cezaevleri doldu.",
        crimeFilter: null,
        bonus: 'release',
        bonusAmount: 1.5
    },
    {
        text: "Yolsuzlukla mücadele: Beyaz yakalı suçlara sert olun.",
        crimeFilter: ['fraud', 'corruption', 'smuggling'],
        bonus: 'jail',
        bonusAmount: 1.4
    },
    {
        text: "Sakin bir gün. Vicdanınızın sesini dinleyin.",
        crimeFilter: null,
        bonus: null,
        bonusAmount: 1
    }
];

export function getRandomDirective() {
    return DIRECTIVES[Math.floor(Math.random() * DIRECTIVES.length)];
}

// Get emotion-based feedback messages (TURKISH)
export function getEmotionFeedback(emotion, verdict, isCorrect) {
    if (isCorrect) {
        const reactions = {
            'remorseful': "Sanık kaderini kabullenip başını eğdi.",
            'panicked': "Sanığın yüzünde rahatlama belirdi.",
            'defiant': "Sanık homurdandı ama kararı kabul etti.",
            'proud': "Sanığın gururu bir anlığına sarsıldı.",
        };
        return reactions[emotion] || "Sanık kararı kabul etti.";
    } else {
        const reactions = {
            'remorseful': "Sanığın gözlerinden yaşlar süzüldü...",
            'panicked': "Sanık umutsuzluk içinde yığıldı.",
            'defiant': "Sanık öfkeyle bağırdı!",
            'proud': "Sanığın gözleri öfkeyle parladı.",
        };
        return reactions[emotion] || "Sanık karara tepki verdi.";
    }
}
