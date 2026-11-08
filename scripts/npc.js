/**
 * NPC Generator Module
 * Handles case generation, NPC creation, and verdict validation
 */

// Case database with crimes, statements, correct verdicts, and evidence (TURKISH)
const CASE_DATABASE = {
    pettyTheft: {
        crime: "Hırsızlık",
        severity: 1,
        statements: [
            { text: "Sadece bir ekmek aldım... çocuklarım açlıktan ölüyordu.", emotion: "remorseful", correctVerdict: "release", sympathy: true },
            { text: "Ne olmuş biraz takı aldıysam? Zenginlerin çok parası var.", emotion: "defiant", correctVerdict: "fine-minor", sympathy: false },
            { text: "Ben... istemeden yaptım. Bir anlık dürtüydü. Çok özür dilerim.", emotion: "panicked", correctVerdict: "fine-minor", sympathy: true },
            { text: "Cüzdanlarını masada bıraktılar. Kendi hataları.", emotion: "defiant", correctVerdict: "fine-moderate", sympathy: false },
        ],
        evidence: [
            "Çalınan eşyalar bulundu. Değeri: ₺500",
            "İlk suç kaydı.",
            "Daha önce birçok uyarı almış.",
        ]
    },
    assault: {
        crime: "Darp",
        severity: 3,
        statements: [
            { text: "Önce o kız kardeşime saldırdı. Onu koruyordum!", emotion: "defiant", correctVerdict: "release", sympathy: true },
            { text: "Sinirlerime hakim olamadım. Yanlış yaptığımı biliyorum, Sayın Hakim.", emotion: "remorseful", correctVerdict: "house-arrest", sympathy: true },
            { text: "O adam ailemin onuruna hakaret etti. Hak etti.", emotion: "proud", correctVerdict: "jail-short", sympathy: false },
            { text: "Hiçbir şey hatırlamıyorum... sarhoştum.", emotion: "panicked", correctVerdict: "house-arrest", sympathy: false },
        ],
        evidence: [
            "Mağdur hafif yaralanmış.",
            "Tanıklar provokasyonu doğruluyor.",
            "Sanığın daha önce darp suçu var.",
        ]
    },
    fraud: {
        crime: "Dolandırıcılık",
        severity: 4,
        statements: [
            { text: "Yatırımcılar riskleri biliyordu! Benim suçum değil.", emotion: "defiant", correctVerdict: "jail-medium", sympathy: false },
            { text: "Çaresizdim... işlerim batıyordu. Özür dilerim.", emotion: "remorseful", correctVerdict: "fine-major", sympathy: true },
            { text: "Sistem zaten hileli. Ben sadece kurallarına göre oynadım.", emotion: "proud", correctVerdict: "jail-short", sympathy: false },
            { text: "Kimse fark etmeden geri ödeyebileceğimi düşündüm...", emotion: "panicked", correctVerdict: "house-arrest", sympathy: true },
        ],
        evidence: [
            "Zimmete geçirilen para: ₺500,000",
            "12 mağdur var.",
            "Sahte belgeler bulundu.",
        ]
    },
    burglary: {
        crime: "Ev Soygunu",
        severity: 3,
        statements: [
            { text: "Hasta annem için ilaca ihtiyacım vardı. Başka şansım yoktu.", emotion: "remorseful", correctVerdict: "house-arrest", sympathy: true },
            { text: "Boş evler serbest avdır. Kimseye zarar geldi mi?", emotion: "defiant", correctVerdict: "jail-short", sympathy: false },
            { text: "Evsizim... sadece sıcak bir yer istiyordum.", emotion: "panicked", correctVerdict: "release", sympathy: true },
            { text: "Zenginler neyin eksik olduğunu fark bile etmezler.", emotion: "proud", correctVerdict: "jail-medium", sympathy: false },
        ],
        evidence: [
            "Cam kırılarak girilmiş.",
            "₺20,000 değerinde eşya çalınmış.",
            "Sanık olay yerinde yakalandı.",
        ]
    },
    vandalism: {
        crime: "Mala Zarar Verme",
        severity: 2,
        statements: [
            { text: "Bu sanat! Duvar zaten sıkıcıydı.", emotion: "proud", correctVerdict: "fine-moderate", sympathy: false },
            { text: "Sinirlendim... düşünmedim. Zararı ödeyeceğim.", emotion: "remorseful", correctVerdict: "fine-minor", sympathy: true },
            { text: "O bina babamı işten atan şirketin!", emotion: "defiant", correctVerdict: "fine-minor", sympathy: true },
            { text: "Arkadaşlarım meydan okudu... ne kadar aptalım.", emotion: "panicked", correctVerdict: "fine-minor", sympathy: true },
        ],
        evidence: [
            "Tahmini hasar: ₺5,000",
            "Güvenlik kamerası kaydı alındı.",
            "Sanık suçunu kabul ediyor.",
        ]
    },
    murder: {
        crime: "Cinayet",
        severity: 5,
        statements: [
            { text: "Kızımı öldürecekti. Başka seçeneğim yoktu!", emotion: "panicked", correctVerdict: "release", sympathy: true },
            { text: "Pişman değilim. O canavar ölmeyi hak ediyordu.", emotion: "defiant", correctVerdict: "jail-long", sympathy: false },
            { text: "Kaza oldu... silah patladı. Yemin ederim!", emotion: "panicked", correctVerdict: "jail-medium", sympathy: true },
            { text: "Bunu yapmam için para aldım. Sadece bir araçtım.", emotion: "remorseful", correctVerdict: "death", sympathy: false },
            { text: "Sesler... bana yapmamı söylediler.", emotion: "panicked", correctVerdict: "house-arrest", sympathy: true },
        ],
        evidence: [
            "Silah olay yerinde bulundu.",
            "Maktul: bilinen suçlu.",
            "Tasarlama kanıtları var.",
            "Meşru müdafaa iddiası inceleniyor.",
        ]
    },
    corruption: {
        crime: "Yolsuzluk",
        severity: 4,
        statements: [
            { text: "Herkes rüşvet alıyor. Ben sadece yakalanan oldum.", emotion: "defiant", correctVerdict: "jail-medium", sympathy: false },
            { text: "Bunu bölgem için yaptım... okullar ve yollar inşa etmek için.", emotion: "proud", correctVerdict: "fine-major", sympathy: true },
            { text: "Tehdit edildim... aileme zarar vereceklerdi.", emotion: "panicked", correctVerdict: "house-arrest", sympathy: true },
            { text: "Güç yozlaştırır, Sayın Hakim. Nefret ettiğim şey oldum.", emotion: "remorseful", correctVerdict: "jail-short", sympathy: true },
        ],
        evidence: [
            "Banka kayıtları şüpheli transferler gösteriyor.",
            "Birden fazla tanık ifadesi var.",
            "Ses kayıtları elde edildi.",
        ]
    },
    smuggling: {
        crime: "Kaçakçılık",
        severity: 3,
        statements: [
            { text: "Ben sadece şoförüydüm! Kamyonda ne olduğunu bilmiyordum.", emotion: "panicked", correctVerdict: "fine-moderate", sympathy: true },
            { text: "İnsanların bu mallara ihtiyacı var. Sınırlar adaletsiz.", emotion: "defiant", correctVerdict: "jail-short", sympathy: false },
            { text: "Ailem bu para olmadan açlıktan ölürdü.", emotion: "remorseful", correctVerdict: "house-arrest", sympathy: true },
            { text: "Fakirler için ilaç bu. Bu nasıl suç olabilir?", emotion: "proud", correctVerdict: "fine-minor", sympathy: true },
        ],
        evidence: [
            "Kaçak mal değeri: ₺100,000",
            "Araçta rota haritaları bulundu.",
            "İlk suç.",
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
    const evidence = crimeData.evidence[Math.floor(Math.random() * crimeData.evidence.length)];

    return {
        id: Date.now(),
        crimeType,
        crime: crimeData.crime,
        severity: crimeData.severity,
        statement: statement.text,
        emotion: statement.emotion,
        correctVerdict: statement.correctVerdict,
        sympathy: statement.sympathy,
        evidence,
        showEvidence: day >= 2 && Math.random() > 0.5, // Evidence appears after day 1
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
