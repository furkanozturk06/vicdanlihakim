/**
 * Case & Law Data (TURKISH)
 *
 * Every statement points at one law of its crime (`law`). The correct verdict is
 * taken from that law, then shifted by any active amendments whose tag the
 * statement carries. The rulebook is rendered from the same data, so the book
 * and the answers can never drift apart. Run `npm run check` after editing.
 *
 * Statement fields:
 *   text      what the defendant says
 *   emotion   remorseful | panicked | defiant | proud
 *   sympathy  does the public side with them
 *   law       key in the crime's `laws`
 *   detail    crime subtitle shown in the bubble
 *   summary   case summary in the file
 *   evidence  [visible evidence, evidence revealed by interrogation]
 *   question  what the judge can ask
 *   answer    defendant's reply
 *   tags      optional: alcohol | minor | restitution (see AMENDMENTS)
 *   age       optional fixed age
 */

// Verdicts from lightest to harshest
export const LADDER = [
    'release',
    'fine-minor',
    'fine-moderate',
    'fine-major',
    'house-arrest',
    'jail-short',
    'jail-medium',
    'jail-long',
    'death',
];

export const VERDICT_LABELS = {
    'release': 'Beraat',
    'fine-minor': 'Hafif para cezası',
    'fine-moderate': 'Orta para cezası',
    'fine-major': 'Ağır para cezası',
    'house-arrest': 'Ev hapsi',
    'jail-short': 'Kısa hapis',
    'jail-medium': 'Orta hapis',
    'jail-long': 'Uzun hapis',
    'death': 'İdam',
};

export const GENERAL_NOTES = [
    'Önce özel hallere bakın; hiçbiri uymuyorsa olağan ceza uygulanır.',
    'Meşru müdafaa ispatlanmışsa diğer bütün hallerden önce gelir.',
];

// Amendments come into force on the given day. They shift the verdict one step
// up or down the LADDER for statements carrying the tag. Shifts never create
// or remove a death sentence.
export const AMENDMENTS = [
    {
        day: 3,
        tag: 'alcohol',
        shift: 1,
        title: 'Ek Madde 1',
        text: 'Alkol veya uyuşturucu etkisindeyken işlenen suçlarda ceza bir derece ağırlaştırılır.',
    },
    {
        day: 5,
        tag: 'minor',
        shift: -1,
        title: 'Ek Madde 2',
        text: '18 yaşından küçük sanıkların cezası bir derece hafifletilir.',
    },
    {
        day: 7,
        tag: 'restitution',
        shift: -1,
        title: 'Ek Madde 3',
        text: 'Verdiği zararı tamamen karşılamış sanıkların cezası bir derece hafifletilir.',
    },
];

export const CRIMES = {
    pettyTheft: {
        name: 'Hırsızlık',
        severity: 1,
        laws: {
            base: { verdict: 'fine-minor' },
            unreturned: { verdict: 'fine-moderate', text: 'Mal geri verilmediyse ve sanık daha önce uyarı aldıysa' },
            necessity: { verdict: 'release', text: 'Açlık gibi hayati bir ihtiyaç için, çok küçük değerde ve mağdur şikayetçi değilse' },
        },
        statements: [
            {
                text: 'Sadece bir ekmek aldım... çocuklarım açlıktan ölüyordu.', emotion: 'remorseful', sympathy: true, law: 'necessity',
                detail: 'Gıda',
                summary: 'Mahalle fırınından iki ekmek alıp parasını ödemeden kaçarken yakalandı. Fırıncı şikayetini geri çekmek istiyor.',
                evidence: ['Çalınan mal: 2 ekmek (₺30).', 'Sabıka kaydı yok; üç çocuğuyla tek başına yaşıyor.'],
                question: 'Çocuklarına kim bakıyor?', answer: 'Kimse... Eşim geçen yıl öldü. Fabrikadan da çıkarıldım.',
            },
            {
                text: 'Ne olmuş biraz takı aldıysam? Zenginlerin çok parası var.', emotion: 'defiant', sympathy: false, law: 'base', tags: ['restitution'],
                detail: 'Mücevher',
                summary: 'Bir kuyumcu vitrininden altın kolye alıp ceketine saklarken güvenlik görevlisine yakalandı.',
                evidence: ['Kolye sahibine eksiksiz iade edildi; zarar kalmadı.', 'Güvenlik kamerası olayı açıkça gösteriyor.'],
                question: 'Kolyeyi ne yapacaktın?', answer: 'Satacaktım tabii. Kuyumcu bir tane eksilse fark etmez.',
            },
            {
                text: 'Ben... istemeden yaptım. Bir anlık dürtüydü. Çok özür dilerim.', emotion: 'panicked', sympathy: true, law: 'base',
                detail: 'Market',
                summary: 'Süpermarketten çikolata ve parfüm alıp kasadan geçmeden çıkmaya çalıştı. Kapıdaki alarm çaldı.',
                evidence: ['Ürünlerin değeri: ₺650.', 'İlk suçu; olay yerinde ağlayarak suçunu kabul etti.'],
                question: 'Daha önce böyle bir şey yaptın mı?', answer: 'Hayır, yemin ederim. Ne olduğunu ben de anlamadım.',
            },
            {
                text: 'Cüzdanlarını masada bıraktılar. Kendi hataları.', emotion: 'defiant', sympathy: false, law: 'unreturned',
                detail: 'Cüzdan',
                summary: 'Bir kafede masada unutulan iki cüzdanı alıp içindeki parayı harcadı. Kartlarla alışveriş yapmaya çalışırken yakalandı.',
                evidence: ['Harcanan para: ₺3.500; geri ödenmedi.', 'Daha önce benzer bir olaydan uyarı almış.'],
                question: 'Parayı geri ödeyecek misin?', answer: 'Neden ödeyeyim? Bulan alır, herkes bilir.',
            },
        ],
    },

    assault: {
        name: 'Darp',
        severity: 3,
        laws: {
            base: { verdict: 'house-arrest', text: 'hafif yaralanma, sabıka yok' },
            serious: { verdict: 'jail-short', text: 'Dikiş veya kırık gerektiren yaralanma ya da önceki darp kaydı' },
            defense: { verdict: 'release', text: 'Bir yakınını korurken, tanıklarla doğrulanmışsa (meşru müdafaa)' },
        },
        notes: ['Alkollü olmak cezayı hafifletmez.'],
        statements: [
            {
                text: 'Önce o kız kardeşime saldırdı. Onu koruyordum!', emotion: 'defiant', sympathy: true, law: 'defense',
                detail: 'Meşru müdafaa iddiası',
                summary: 'Bir barın önünde kız kardeşini taciz eden adama yumruk attı. Adamın burnu kırıldı.',
                evidence: ['Kız kardeşin kolunda yeni morluklar var.', 'Tanıklar, mağdurun önce kız kardeşe saldırdığını doğruluyor.'],
                question: 'Olayı gören oldu mu?', answer: 'Kapıdaki güvenlik ve iki garson. Hepsi her şeyi gördü.',
            },
            {
                text: 'Sinirlerime hakim olamadım. Yanlış yaptığımı biliyorum, Sayın Hakim.', emotion: 'remorseful', sympathy: true, law: 'base',
                detail: 'Trafik kavgası',
                summary: 'Trafikte yol verme tartışmasında arabasından inip diğer sürücüyü tekmeledi. Mağdur iki gün hastanede kaldı.',
                evidence: ['Doktor raporu: hafif yaralanma, kırık yok.', 'Sabıkası yok; olaydan sonra mağduru hastanede ziyaret etmiş.'],
                question: 'Mağdurla konuştun mu?', answer: 'Hastaneye çiçekle gittim, özür diledim. Utanıyorum.',
            },
            {
                text: 'O adam ailemin onuruna hakaret etti. Hak etti.', emotion: 'proud', sympathy: false, law: 'serious',
                detail: 'Kahvehane kavgası',
                summary: 'Kahvehanede tartıştığı adamı sandalyeyle dövdü. Masalar devrildi, mağdurun kaşı patladı.',
                evidence: ['Mağdura 6 dikiş atıldı.', 'Sanığın 2 yıl önce de darp kaydı var.'],
                question: 'Daha önce kavgaya karıştın mı?', answer: 'Bir kere. O da hak etmişti.',
            },
            {
                text: 'Hiçbir şey hatırlamıyorum... sarhoştum.', emotion: 'panicked', sympathy: false, law: 'base', tags: ['alcohol'],
                detail: 'Alkollü kavga',
                summary: 'Bir düğünde alkollüyken bir misafiri itip yere düşürdü. Misafirin bileği burkuldu.',
                evidence: ['Olay anında kandaki alkol: 1,8 promil.', 'Mağdur şikayetçi; sanığın sabıkası yok.'],
                question: 'Ne kadar içmiştin?', answer: 'Bilmiyorum... Kadeh kadeh üstüne. Kendimde değildim.',
            },
        ],
    },

    fraud: {
        name: 'Dolandırıcılık',
        severity: 4,
        laws: {
            base: { verdict: 'jail-short', text: 'bilerek sahtecilik, vergi hilesi' },
            massive: { verdict: 'jail-medium', text: 'Çok sayıda mağdur ve geri ödenmemiş büyük zarar' },
            repay: { verdict: 'fine-major', text: 'Sabıkası yok ve zararı ödemeyi teklif ediyorsa' },
            embezzle: { verdict: 'house-arrest', text: 'Çalıştığı yerden zimmet, kısmen geri ödenmiş ve mağdur geri ödeme istiyorsa' },
        },
        statements: [
            {
                text: 'Yatırımcılar riskleri biliyordu! Benim suçum değil.', emotion: 'defiant', sympathy: false, law: 'massive',
                detail: 'Sahte yatırım',
                summary: 'Yüksek kâr vaadiyle 40 kişiden para topladı, sonra şirketini kapatıp parayla ortadan kayboldu.',
                evidence: ['Toplanan para: ₺2.000.000; geri ödeme yok.', 'Yatırımcılara gösterilen kâr raporları sahte.'],
                question: 'Para nerede?', answer: 'Piyasada eridi. Raporlar mı? Herkes biraz süsler.',
            },
            {
                text: 'Çaresizdim... işlerim batıyordu. Özür dilerim.', emotion: 'remorseful', sympathy: true, law: 'repay',
                detail: 'Sigorta hilesi',
                summary: 'Batmak üzere olan dükkanını kurtarmak için sigorta şirketine sahte hasar faturaları sundu.',
                evidence: ['Haksız alınan ödeme: ₺80.000.', 'Parayı geri ödemeyi teklif etti; sabıkası yok.'],
                question: 'Parayı geri verebilir misin?', answer: 'Dükkanı satıp hepsini öderim. Yeter ki çocuklarım aç kalmasın.',
            },
            {
                text: 'Sistem zaten hileli. Ben sadece kurallarına göre oynadım.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Vergi hilesi',
                summary: 'Paravan şirketler kurarak üç yıl boyunca vergi ödemekten kaçındı.',
                evidence: ['Ödenmeyen vergi: ₺450.000.', 'Muhasebe kayıtlarında bilerek yapılmış tahrifat var.'],
                question: 'Kayıtları kim düzenledi?', answer: 'Ben düzenledim. Kanunda açık vardı, ben de kullandım.',
            },
            {
                text: 'Kimse fark etmeden geri ödeyebileceğimi düşündüm...', emotion: 'panicked', sympathy: true, law: 'embezzle',
                detail: 'Zimmet',
                summary: 'Annesinin ameliyat masrafı için çalıştığı şirketin kasasından aylarca küçük miktarlar aldı.',
                evidence: ['Eksik para: ₺60.000; ₺25.000\'i geri ödendi.', 'İşvereni hapis yerine geri ödeme istiyor.'],
                question: 'İşverenin ne diyor?', answer: 'Patronum kızgın ama "parayı ödesin yeter" dedi.',
            },
        ],
    },

    burglary: {
        name: 'Soygun',
        severity: 3,
        laws: {
            base: { verdict: 'jail-short' },
            planned: { verdict: 'jail-medium', text: 'Önceden keşif yapılmış, özel alet kullanılmış ve büyük değer çalınmışsa' },
            necessity: { verdict: 'house-arrest', text: 'İlaç gibi hayati bir ihtiyaç için, yalnızca gereken alınmışsa' },
            shelter: { verdict: 'release', text: 'Yalnızca barınmak için girilmiş, hiçbir şey alınmamış ve şikayet yoksa' },
        },
        statements: [
            {
                text: 'Hasta annem için ilaca ihtiyacım vardı. Başka şansım yoktu.', emotion: 'remorseful', sympathy: true, law: 'necessity',
                detail: 'Eczane',
                summary: 'Gece kapalı bir eczanenin camını kırıp içeri girdi, yalnızca kalp ilacı aldı.',
                evidence: ['Alınan: 3 kutu kalp ilacı; kasaya dokunulmamış.', 'Üzerinde annesinin reçetesi bulundu.'],
                question: 'Neden kasaya dokunmadın?', answer: 'Para istemiyordum. Annem o gece nefes alamıyordu.',
            },
            {
                text: 'Boş evler serbest avdır. Kimseye zarar geldi mi?', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Yazlık ev',
                summary: 'Sahipleri tatildeyken bir evin kilidini kırıp televizyon ve dizüstü bilgisayar çaldı.',
                evidence: ['Çalınan eşyaların değeri: ₺35.000.', 'Eşyaların bir kısmı ikinci el pazarında satılmış.'],
                question: 'Eşyaları ne yaptın?', answer: 'Pazarda sattım. Sigorta öder nasılsa.',
            },
            {
                text: 'Evsizim... sadece sıcak bir yer istiyordum.', emotion: 'panicked', sympathy: true, law: 'shelter',
                detail: 'Boş bina',
                summary: 'Bir kış gecesi terk edilmiş bir binanın kapısını zorladı, içeride uyurken bulundu. Hiçbir şey alınmamış.',
                evidence: ['O gece hava sıcaklığı -8°C.', 'Bina 5 yıldır boş; sahibi şikayetçi değil.'],
                question: 'Binanın sahibi şikayetçi mi?', answer: 'Bilmiyorum... Polis "adam gelmeyecek bile" dedi.',
            },
            {
                text: 'Zenginler neyin eksik olduğunu fark bile etmezler.', emotion: 'proud', sympathy: false, law: 'planned',
                detail: 'Villa',
                summary: 'Bir villanın alarmını devre dışı bırakıp kasasını açtı, mücevher ve nakit çaldı.',
                evidence: ['Çalınan değer: ₺400.000.', 'Alarmı kesmek için özel alet kullanılmış; önceden keşif yapılmış.'],
                question: 'Alarmı nasıl kestin?', answer: 'İki hafta evi izledim. Gerisi meslek sırrı.',
            },
        ],
    },

    vandalism: {
        name: 'Mala Zarar Verme',
        severity: 2,
        laws: {
            base: { verdict: 'fine-minor' },
            public: { verdict: 'fine-moderate', text: 'Kamu binasına zarar veya tekrarlanan eylem' },
        },
        statements: [
            {
                text: 'Bu sanat! Duvar zaten sıkıcıydı.', emotion: 'proud', sympathy: false, law: 'public',
                detail: 'Grafiti',
                summary: 'Belediye binasının yeni restore edilmiş taş cephesine sprey boyayla büyük bir grafiti çizdi.',
                evidence: ['Temizlik maliyeti: ₺15.000.', 'Aynı imzayla şehirde 6 grafiti daha var.'],
                question: 'Başka duvarlara da çizdin mi?', answer: 'Şehrin yarısı benim galerim. İmzamı tanımadınız mı?',
            },
            {
                text: 'Sinirlendim... düşünmedim. Zararı ödeyeceğim.', emotion: 'remorseful', sympathy: true, law: 'base',
                detail: 'Araç hasarı',
                summary: 'Komşusuyla park yeri kavgasından sonra komşusunun arabasının aynasını kırdı.',
                evidence: ['Hasar: ₺2.500.', 'Ertesi gün kendisi karakola gidip teslim oldu.'],
                question: 'Neden teslim oldun?', answer: 'Yaptığım yanlıştı. Kaçmak bana yakışmaz.',
            },
            {
                text: 'O bina babamı işten atan şirketin!', emotion: 'defiant', sympathy: true, law: 'base',
                detail: 'Fabrika camları',
                summary: 'Babasını işten çıkaran fabrikanın giriş kapısındaki camlara taş attı.',
                evidence: ['3 cam kırıldı; hasar ₺4.000.', 'Fabrika 200 işçiyi tazminat ödemeden çıkarmış.'],
                question: 'Baban ne kadar çalışmıştı orada?', answer: '22 yıl. Bir sabah kapıya kilit vurdular, tek kuruş vermediler.',
            },
            {
                text: 'Arkadaşlarım meydan okudu... ne kadar aptalım.', emotion: 'panicked', sympathy: true, law: 'base', tags: ['minor'], age: 17,
                detail: 'Park',
                summary: 'Arkadaşlarıyla gece parktaki bankları ve çöp kutularını devirdi, bir lambayı kırdı.',
                evidence: ['Hasar: ₺3.000.', 'Arkadaşları olay yerinden kaçmış; sanık kaçmamış.'],
                question: 'Arkadaşların nerede?', answer: 'Hepsi kaçtı. Ben kalıp polisi bekledim.',
            },
        ],
    },

    murder: {
        name: 'Cinayet',
        severity: 5,
        laws: {
            base: { verdict: 'jail-long', text: 'tasarlayarak öldürme' },
            hired: { verdict: 'death', text: 'Para karşılığı öldürme veya birden fazla cinayet' },
            negligent: { verdict: 'jail-medium', text: 'Dikkatsizlik veya kaza sonucu öldürme (taksir)' },
            insanity: { verdict: 'house-arrest', text: 'Akıl hastalığı adli tıp raporuyla doğrulanmışsa (tedavi altında)' },
            defense: { verdict: 'release', text: 'Bir yakınını korurken, kanıtlarla doğrulanmışsa (meşru müdafaa)' },
        },
        statements: [
            {
                text: 'Kızımı öldürecekti. Başka seçeneğim yoktu!', emotion: 'panicked', sympathy: true, law: 'defense',
                detail: 'Meşru müdafaa iddiası',
                summary: 'Evine silahla giren ve kızını rehin alan bir adamı mutfak bıçağıyla öldürdü.',
                evidence: ['Maktulün elinde dolu bir silah bulundu.', 'Kızı, adamın kendisini tehdit ettiğini doğruluyor.'],
                question: 'Kızın ne anlatıyor?', answer: 'Adam silahı başına dayamıştı. Kızım her şeyi polise anlattı.',
            },
            {
                text: 'Pişman değilim. O canavar ölmeyi hak ediyordu.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'İntikam',
                summary: 'Yıllar önce kardeşini öldüren ve cezasını çekip çıkan adamı evinin önünde bekleyip vurdu.',
                evidence: ['Silahı olaydan bir hafta önce satın almış.', 'Kamera kayıtlarında maktulü günlerce takip ettiği görülüyor.'],
                question: 'Bunu ne zamandır planlıyordun?', answer: 'Hapisten çıktığı günden beri. Her gün.',
            },
            {
                text: 'Kaza oldu... silah patladı. Yemin ederim!', emotion: 'panicked', sympathy: true, law: 'negligent',
                detail: 'Kaza iddiası',
                summary: 'Ruhsatsız tabancasını arkadaşına gösterirken silah ateş aldı, arkadaşı hayatını kaybetti.',
                evidence: ['Silah ruhsatsız ve emniyeti açık bırakılmış.', 'Tanıklar ikisi arasında husumet olmadığını söylüyor.'],
                question: 'Arkadaşınla aran nasıldı?', answer: 'Çocukluk arkadaşımdı. Kardeşim gibiydi...',
            },
            {
                text: 'Bunu yapmam için para aldım. Sadece bir araçtım.', emotion: 'remorseful', sympathy: false, law: 'hired',
                detail: 'Kiralık katil',
                summary: 'Para karşılığında tanımadığı bir iş insanını otoparkta pusu kurarak öldürdü.',
                evidence: ['Hesabına olaydan bir gün önce ₺500.000 yatırılmış.', 'Daha önce iki benzer cinayetle bağlantılı.'],
                question: 'Bu ilk işin miydi?', answer: '...Üçüncüsü. Ama hiçbirini tanımıyordum.',
            },
            {
                text: 'Sesler... bana yapmamı söylediler.', emotion: 'panicked', sympathy: true, law: 'insanity',
                detail: 'Akıl sağlığı',
                summary: 'Ağır bir psikoz atağı sırasında komşusunu öldürdü. Olaydan sonra polisi kendisi aradı.',
                evidence: ['3 yıldır tedavi görüyor; ilaçları kesilmişti.', 'Adli tıp raporu: olay anında ağır şizofreni atağı.'],
                question: 'İlaçlarını neden bıraktın?', answer: 'Eczane vermedi... reçete bitmişti. Sesler o hafta geri geldi.',
            },
        ],
    },

    corruption: {
        name: 'Yolsuzluk',
        severity: 4,
        laws: {
            base: { verdict: 'jail-short', text: 'görevi kötüye kullanma' },
            bribery: { verdict: 'jail-medium', text: 'Büyük miktarda rüşvet' },
            publicBenefit: { verdict: 'fine-major', text: 'Usulsüzlük var ama kamuya gerçek fayda sağlanmışsa' },
            coerced: { verdict: 'house-arrest', text: 'Tehdit altında yapılmış ve hiçbir çıkar sağlanmamışsa' },
        },
        statements: [
            {
                text: 'Herkes rüşvet alıyor. Ben sadece yakalanan oldum.', emotion: 'defiant', sympathy: false, law: 'bribery',
                detail: 'Rüşvet',
                summary: 'Belediye imar müdürüyken kaçak binalara izin vermek için müteahhitlerden düzenli rüşvet aldı.',
                evidence: ['Hesabında açıklanamayan ₺3.000.000 var.', 'İzin verdiği 14 binanın denetim raporu sahte.'],
                question: 'Bu para nereden geldi?', answer: 'Hediyeler. Bizim orada adettir.',
            },
            {
                text: 'Bunu bölgem için yaptım... okullar ve yollar inşa etmek için.', emotion: 'proud', sympathy: true, law: 'publicBenefit',
                detail: 'Usulsüz ihale',
                summary: 'Belediye başkanıyken ihaleleri akrabalarının firmalarına verdi. İşler bitti ama fiyatlar şişirildi.',
                evidence: ['Kamu zararı: ₺900.000.', 'Yapılan okullar ve yollar tamamlanmış ve kullanılıyor.'],
                question: 'Projeler tamamlandı mı?', answer: 'Hepsi! Gidin bakın, çocuklar o okullarda okuyor.',
            },
            {
                text: 'Tehdit edildim... aileme zarar vereceklerdi.', emotion: 'panicked', sympathy: true, law: 'coerced',
                detail: 'Baskı altında',
                summary: 'Gümrük memuruyken bir çetenin kamyonlarını kontrol etmeden geçirdi.',
                evidence: ['Telefonunda ailesine yönelik tehdit mesajları var.', 'Banka kayıtlarında para aldığına dair iz yok.'],
                question: 'Karşılığında para aldın mı?', answer: 'Tek kuruş almadım! Sadece çocuklarımı korumak istedim.',
            },
            {
                text: 'Güç yozlaştırır, Sayın Hakim. Nefret ettiğim şey oldum.', emotion: 'remorseful', sympathy: true, law: 'base',
                detail: 'Görevi kötüye kullanma',
                summary: 'Bakanlıkta yöneticiyken kamu araçlarını ve bütçesini özel tatilleri için kullandı.',
                evidence: ['Kamu zararı: ₺250.000.', 'Soruşturma başlayınca istifa etti, parayı iade etmeye başladı.'],
                question: 'Zararı ödüyor musun?', answer: 'Her ay maaşımın yarısını yatırıyorum. Bitene kadar da yatıracağım.',
            },
        ],
    },

    smuggling: {
        name: 'Kaçakçılık',
        severity: 3,
        laws: {
            base: { verdict: 'jail-short' },
            unaware: { verdict: 'fine-moderate', text: 'Taşıdığı maldan habersiz şoför veya taşıyıcı' },
            livelihood: { verdict: 'house-arrest', text: 'Başka geçim kaynağı olmadığı için yapılmışsa' },
            medicine: { verdict: 'fine-minor', text: 'Kâr amacı gütmeden ilaç getirilmişse' },
        },
        statements: [
            {
                text: 'Ben sadece şoförüydüm! Kamyonda ne olduğunu bilmiyordum.', emotion: 'panicked', sympathy: true, law: 'unaware',
                detail: 'Sigara',
                summary: 'Kullandığı kamyonun dorsesindeki gizli bölmede 5.000 karton kaçak sigara bulundu.',
                evidence: ['Kamyonun sahibi yurt dışına kaçtı.', 'Gizli bölme, sanık işe başlamadan önce yapılmış.'],
                question: 'Bu işe ne zaman başladın?', answer: 'İki hafta önce. Kamyonu bana öyle teslim ettiler.',
            },
            {
                text: 'İnsanların bu mallara ihtiyacı var. Sınırlar adaletsiz.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Elektronik',
                summary: 'Gümrükte beyan etmeden 300 cep telefonu sokmaya çalışırken yakalandı.',
                evidence: ['Kaçak mal değeri: ₺1.500.000.', 'Son bir yılda 11 kez sınırdan geçmiş.'],
                question: 'Sınırı kaç kez geçtin?', answer: 'Saymadım. İş bu, gidip geliyorum.',
            },
            {
                text: 'Ailem bu para olmadan açlıktan ölürdü.', emotion: 'remorseful', sympathy: true, law: 'livelihood',
                detail: 'Akaryakıt',
                summary: 'Sınır köyünde kaçak akaryakıt taşıyıp satarken yakalandı.',
                evidence: ['Araçta 2.000 litre kaçak akaryakıt bulundu.', 'Köyde başka geçim kaynağı yok; 5 çocuğu var.'],
                question: 'Köyde başka iş yok mu?', answer: 'Tarla kurudu, fabrika yok. Ya bu ya göç.',
            },
            {
                text: 'Fakirler için ilaç bu. Bu nasıl suç olabilir?', emotion: 'proud', sympathy: true, law: 'medicine',
                detail: 'İlaç',
                summary: 'Ülkede bulunmayan kanser ilaçlarını beyan etmeden getirip hastalara maliyetine sattı.',
                evidence: ['İlaçların tamamı orijinal ve ruhsatlı.', 'Satış kayıtları kâr etmediğini doğruluyor.'],
                question: 'İlaçlardan kâr ettin mi?', answer: 'Bir kuruş bile! Faturaları sakladım, bakın.',
            },
        ],
    },
};
