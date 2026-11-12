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
 *
 * Texts are written in Turkish; the calls at the end of the file swap in the
 * English texts from i18n/en.js when the game runs in English.
 */

import { translateTree } from './i18n.js';

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
    'Sanığın suçu işlemediği kanıtlanırsa, suç ne olursa olsun beraat verilir.',
    'Dosyada bekleyen bir rapor varsa davayı erteleyebilirsiniz; dosya yarın yeni delille gelir.',
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
        day: 6,
        tag: 'minor',
        shift: -1,
        title: 'Ek Madde 2',
        text: '18 yaşından küçük sanıkların cezası bir derece hafifletilir.',
    },
    {
        day: 10,
        tag: 'restitution',
        shift: -1,
        title: 'Ek Madde 3',
        text: 'Verdiği zararı tamamen karşılamış sanıkların cezası bir derece hafifletilir.',
    },
];

// Chapters of the law book; every crime is in exactly one (checked by npm run check)
export const LAW_CHAPTERS = [
    { title: 'Hayata Karşı Suçlar', crimes: ['murder', 'bloodFeud', 'traffic', 'malpractice', 'workSafety'] },
    { title: 'Şiddet ve Hürriyete Karşı Suçlar', crimes: ['assault', 'domesticViolence', 'kidnapping', 'stalking', 'threat', 'trespass'] },
    { title: 'Cinsel Suçlar ve İnsan Ticareti', crimes: ['childAbuse', 'humanTrafficking', 'organTrafficking', 'sexualAssault', 'sexualHarassment', 'childMarriage'] },
    { title: 'Mala Karşı Suçlar', crimes: ['pettyTheft', 'burglary', 'robbery', 'vandalism', 'arson', 'landDispute'] },
    { title: 'Mali Suçlar', crimes: ['fraud', 'cyberFraud', 'forgery', 'loanShark', 'gambling', 'moneyLaundering', 'hacking'] },
    { title: 'Devlete ve Kamu Düzenine Karşı Suçlar', crimes: ['treason', 'terrorism', 'corruption', 'bidRigging', 'election', 'perjury', 'examLeak', 'organizedCrime', 'embezzlement', 'bribery'] },
    { title: 'Kaçakçılık ve Uyuşturucu', crimes: ['drugs', 'smuggling', 'armsTrafficking', 'migrantSmuggling'] },
    { title: 'Sağlık, Çevre ve Hayvanlar', crimes: ['fakeMedicine', 'foodFraud', 'environment', 'illegalBuilding', 'poaching', 'animalCruelty', 'forestArson'] },
    { title: 'Şeref, Basın ve Özel Hayat', crimes: ['defamation', 'pressCrime', 'blackmail', 'privacy'] },
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
            {
                text: 'Telefonu geri verdim! Annem duymasın lütfen...', emotion: 'panicked', sympathy: true, law: 'base', tags: ['minor', 'restitution'], age: 15,
                detail: 'Okulda telefon',
                summary: 'Sınıf arkadaşının çantasından cep telefonu aldı. Öğretmen fark edince telefonu hemen geri verdi.',
                evidence: ['Telefon sahibine eksiksiz iade edildi.', 'Okul müdürü bunun ilk disiplin olayı olduğunu söylüyor.'],
                question: 'Telefonu neden aldın?', answer: 'Herkeste var, bende yok... Sadece bir günlüğüne istedim.',
            },
            {
                text: 'Bisiklet orada öylece duruyordu. Biraz içmiştim, o kadar.', emotion: 'defiant', sympathy: false, law: 'base', tags: ['alcohol'],
                detail: 'Bisiklet',
                summary: 'Gece alkollüyken bir apartman önünde kilitli duran bisikletin kilidini kırıp götürdü.',
                evidence: ['Yakalandığında kandaki alkol: 1,4 promil.', 'Bisiklet hasarlı bulundu; sahibine geri verildi ama tamir gerekiyor.'],
                question: 'Bisikleti ne yapacaktın?', answer: 'Eve kadar binecektim. Sonra... bilmem, atardım bir yere.',
            },
        ],
    },

    assault: {
        name: 'Darp',
        severity: 3,
        laws: {
            base: { verdict: 'house-arrest', text: 'hafif yaralanma, sabıka yok' },
            serious: { verdict: 'jail-short', text: 'Dikiş veya kırık gerektiren yaralanma ya da önceki darp kaydı' },
            defense: { verdict: 'release', text: 'Kendini veya bir yakınını korurken, tanıklarla doğrulanmışsa (meşru müdafaa)' },
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
            {
                text: 'Kuralları ben koyarım. Kapıda olay çıkaran dayağı yer.', emotion: 'proud', sympathy: false, law: 'serious',
                detail: 'Kapı görevlisi',
                summary: 'Gece kulübünde kapı görevlisiyken içeri alınmayan bir müşteriyi sokakta dövdü.',
                evidence: ['Mağdurun iki kaburgası kırıldı.', 'Aynı kulüpten daha önce iki şikayet var.'],
                question: 'Müşteri sana saldırdı mı?', answer: 'Bağırdı. Bağırmak da saldırıdır benim için.',
            },
            {
                text: 'Bana her gün sataşıyordu... Bir kere karşılık verdim.', emotion: 'panicked', sympathy: true, law: 'serious', tags: ['minor'], age: 16,
                detail: 'Okul kavgası',
                summary: 'Okul bahçesinde kendisine aylardır zorbalık yapan sınıf arkadaşına yumruk attı. Çocuğun burnu kırıldı.',
                evidence: ['Mağdurun burnu kırıldı.', 'Öğretmenler sanığın aylardır zorbalığa uğradığını doğruluyor.'],
                question: 'Okula şikayet ettin mi?', answer: 'Üç kere. Kimse bir şey yapmadı.',
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
            {
                text: 'Bağışçılar iyilik yaptıklarını hissetti. Ben de iyi kazandım. Herkes mutlu.', emotion: 'defiant', sympathy: false, law: 'massive',
                detail: 'Sahte yardım kampanyası',
                summary: 'Depremzedeler için internette sahte bir yardım kampanyası açıp toplanan parayı kendi hesabına aktardı.',
                evidence: ['500\'den fazla bağışçı; toplanan ₺750.000 depremzedelere ulaşmadı.', 'Paranın lüks araba ve tatil için harcandığı banka kayıtlarında görülüyor.'],
                question: 'Paradan depremzedelere ne ulaştı?', answer: 'Hiçbir şey. Ama bağışçılar mutlu oldu, değil mi?',
            },
            {
                text: 'Birkaç faturayı iki kez kestim. Hepsini ödeyeceğim, söz.', emotion: 'remorseful', sympathy: true, law: 'repay',
                detail: 'Çift fatura',
                summary: 'Serbest muhasebeci olarak bazı müşterilerine aynı hizmet için iki kez fatura kesti.',
                evidence: ['Fazladan alınan para: ₺42.000.', 'Sabıkası yok; müşterilerine geri ödeme planı sundu.'],
                question: 'Müşterilerin ne diyor?', answer: 'Çoğu ödeme planını kabul etti. Hepsine tek tek özür diledim.',
            },
            {
                text: 'Birkaç üyenin parasını batırdım, hepsini öderim.', emotion: 'remorseful', sympathy: false, law: 'massive',
                detail: 'Kooperatif',
                summary: 'Konut kooperatifi başkanıyken 8 üyenin aidatını kendi hesabına aktardı. Sabıkası yok, geri ödeme teklif ediyor.',
                evidence: ['8 üyenin zararı: ₺400.000; bir yıllık geri ödeme planı sundu.', 'Kooperatifin defterleri son iki yıldır tutulmamış.'],
                question: 'Başka mağdur var mı?', answer: 'Hayır, sadece o sekiz kişi. Yemin ederim.',
                delayed: {
                    note: 'Mali müfettiş raporu bekleniyor',
                    evidence: 'Rapor: kooperatifin 300 üyesinin ₺12.000.000 birikimi yurt dışına aktarılmış; ödeme planı zaman kazanmak için sunulmuş.',
                },
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
            {
                text: 'Arkadaşlarım "korkak" dedi... Sadece abur cubur aldık.', emotion: 'panicked', sympathy: true, law: 'base', tags: ['minor'], age: 17,
                detail: 'Okul kantini',
                summary: 'Arkadaşlarıyla gece okulun kantin kapısını kırıp içeri girdi, cips ve gazoz aldı.',
                evidence: ['Kapı hasarı ve çalınan ürünler: ₺6.000.', 'Arkadaşları kaçtı; sanık kantinde yakalandı.'],
                question: 'Fikir kimindi?', answer: 'Benim değildi... Ama ben de gittim. Suçluyum.',
            },
            {
                text: 'İçki bitmişti, dükkan da kapalıydı. Ne yapsaydım?', emotion: 'defiant', sympathy: false, law: 'base', tags: ['alcohol'],
                detail: 'Tekel bayii',
                summary: 'Gece alkollüyken mahalledeki tekel bayiinin camını kırıp içeri girdi ve içki şişeleri aldı.',
                evidence: ['Yakalandığında kandaki alkol: 2,1 promil.', 'Cam ve çalınan ürünler: ₺9.000.'],
                question: 'Ne kadar içmiştin?', answer: 'Yeterince değil. Yoksa dükkana gider miydim?',
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
            {
                text: 'Hakem bizi soydu! Koltuklar da gitti, ne olacak?', emotion: 'proud', sympathy: false, law: 'public', tags: ['alcohol'],
                detail: 'Stadyum',
                summary: 'Maç sonunda alkollüyken belediyeye ait stadyumda 20 koltuğu söküp sahaya fırlattı.',
                evidence: ['Kamera kayıtlarında kendisi açıkça görülüyor; alkollü olduğu tespit edildi.', 'Hasar: ₺18.000.'],
                question: 'O gün alkol almış mıydın?', answer: 'Maç günü içilmez mi? Herkes içiyordu.',
            },
            {
                text: 'Köyün suyunu kestiler! Çiti söktüm, parasını da ödedim.', emotion: 'defiant', sympathy: true, law: 'base', tags: ['restitution'],
                detail: 'Çit',
                summary: 'Köyün tek su kaynağının önüne şirketin çektiği çiti söktü.',
                evidence: ['Çitin bedeli olan ₺7.000\'i şirkete kendisi ödedi.', 'Su kaynağının köyün ortak malı olduğu tapu kayıtlarında yazıyor.'],
                question: 'Çiti neden söktün?', answer: 'Hayvanlar susuz kaldı. Çiti ödedim ama suyu bırakmam.',
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
            defense: { verdict: 'release', text: 'Kendini veya bir yakınını korurken, kanıtlarla doğrulanmışsa (meşru müdafaa)' },
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
            {
                text: 'On iki yıl dayak yedim... O gece "yarın seni öldüreceğim" dedi.', emotion: 'remorseful', sympathy: true, law: 'base',
                detail: 'Aile içi şiddet',
                summary: 'Yıllardır şiddet gördüğü eşini, eşi uyurken öldürdü. Olaydan sonra polisi kendisi aradı.',
                evidence: ['Hastane kayıtlarında 12 yılda 9 darp raporu var.', 'Olay anında eşi uyuyordu; o an doğrudan bir saldırı yoktu.'],
                question: 'Neden polise gitmedin?', answer: 'Gittim. Dört kez. Her seferinde eve geri gönderdiler.',
            },
            {
                text: 'Onları ben seçtim. Yolda kimse aramaz otostopçuları.', emotion: 'proud', sympathy: false, law: 'hired',
                detail: 'Seri cinayet',
                summary: 'İki yıl boyunca arabasına aldığı üç otostopçuyu öldürüp ormana gömdü.',
                evidence: ['Üç cesedin yerini kendisi gösterdi.', 'Arabasında üç kurbanın da eşyaları bulundu.'],
                question: 'Başka kurban var mı?', answer: 'Bulduklarınızla yetinin, Hakim Bey.',
            },
            {
                text: 'Ne olduğunu hatırlamıyorum... Bir an her şey karardı.', emotion: 'panicked', sympathy: true, law: 'defense',
                detail: 'Gece yarısı',
                summary: 'Evinde bir adamı mutfak bıçağıyla öldürdü. Polis geldiğinde maktulün yanında oturuyordu.',
                evidence: ['Maktul sanığın eski iş ortağı; aralarında borç kavgası vardı.', 'Komşular gece yüksek sesle bağrışma duymuş.'],
                question: 'Adam evine neden geldi?', answer: 'Borcunu istemeye... Sonra elinde bir şey gördüm.',
                delayed: {
                    note: 'Balistik ve olay yeri raporu bekleniyor',
                    evidence: 'Rapor: maktulün elindeki tabancadan iki el ateş edilmiş; sanık kendini korurken bıçağı kullanmış.',
                },
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
            {
                text: 'Ceza yazsam ne olacak? Herkes biraz verir, ben de alırım.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Trafik polisi',
                summary: 'Trafik polisiyken ceza yazmamak için sürücülerden küçük miktarlarda para aldı.',
                evidence: ['Bir yılda toplam ₺35.000 aldığı tespit edildi.', 'Sürücülerin gizli kamerayla çektiği görüntüler var.'],
                question: 'Kaç sürücüden para aldın?', answer: 'Saymadım. Günde bir iki tane, o kadar.',
            },
            {
                text: 'Hastanemiz şimdi bölgenin en iyisi. Usul mü? Hastalar usule bakmaz.', emotion: 'proud', sympathy: true, law: 'publicBenefit',
                detail: 'Hastane ihalesi',
                summary: 'Hastane başhekimiyken tıbbi cihazları ihalesiz, akrabasının firmasından aldı.',
                evidence: ['İhale kanununa aykırı alım: ₺1.200.000.', 'Cihazlar piyasadan ucuz ve sorunsuz çalışıyor; bekleme süreleri yarıya indi.'],
                question: 'Cihazlar düzgün çalışıyor mu?', answer: 'Hepsi! Ameliyat sırası 6 aydan 3 aya indi.',
            },
            {
                text: 'Beni tehdit ettiler! Aileme zarar vereceklerdi!', emotion: 'panicked', sympathy: false, law: 'bribery',
                detail: 'Liman gümrüğü',
                summary: 'Liman gümrüğünde memurken bir şirketin konteynerlerini kontrol etmeden geçirdi. Tehdit edildiğini söylüyor.',
                evidence: ['Telefonunda tehdit içerikli iki mesaj var.', 'Geçirdiği konteynerlerden kaçak mal çıktı.'],
                question: 'Tehditleri neden bildirmedin?', answer: 'Korktum... Kimseye güvenemezdim.',
                delayed: {
                    note: 'Banka hesapları incelemesi bekleniyor',
                    evidence: 'İnceleme: annesi adına açılmış hesaba şirketten ₺2.500.000 yatırılmış; "tehdit" mesajları kendi ikinci telefonundan gönderilmiş.',
                },
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
            {
                text: 'Bunlar müzede çürüyecekti. Ben onlara değer veren alıcı buldum.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Tarihi eser',
                summary: 'Kaçak kazılardan çıkan 40 tarihi sikkeyi yurt dışına çıkarmaya çalışırken havalimanında yakalandı.',
                evidence: ['Sikkeler 2.000 yıllık ve devlete ait.', 'Telefonunda yabancı alıcılarla yazışmalar var.'],
                question: 'Sikkeleri kime satacaktın?', answer: 'Koleksiyonculara. İsim vermem.',
            },
            {
                text: 'Pazardan hatıra diye aldım! Eski olduğunu bilmiyordum.', emotion: 'panicked', sympathy: true, law: 'unaware',
                detail: 'Hatıra sikke',
                summary: 'Tatil dönüşü bavulunda tarihi bir sikke çıktı.',
                evidence: ['Sikke bir sokak pazarından ₺200\'e alınmış.', 'Satıcının turistlere sahte "hatıra" diye tarihi eser sattığı biliniyor.'],
                question: 'Sikkeyi nereden aldın?', answer: 'Çarşıdaki bir tezgahtan. Adam "replika" dedi, fiş bile verdi.',
            },
        ],
    },

    drugs: {
        name: 'Uyuşturucu',
        severity: 3,
        laws: {
            base: { verdict: 'jail-short', text: 'satış amaçlı bulundurma' },
            user: { verdict: 'fine-moderate', text: 'Yalnızca kişisel kullanım için az miktar' },
            treatment: { verdict: 'fine-minor', text: 'Kişisel kullanım; bağımlı ve tedaviye başlamışsa' },
            large: { verdict: 'jail-medium', text: 'Büyük miktar veya örgütlü satış' },
            children: { verdict: 'jail-long', text: 'Çocuklara veya okul çevresinde satış' },
        },
        statements: [
            {
                text: 'Bir partide arkadaşım verdi... Sadece denemek istedim.', emotion: 'panicked', sympathy: true, law: 'user', age: 19,
                detail: 'Parti',
                summary: 'Bir öğrenci partisinde yapılan baskında cebinde az miktarda uyuşturucu bulundu.',
                evidence: ['Bulunan miktar: 2 gram.', 'Satışa dair hiçbir iz yok; sabıkası yok.'],
                question: 'Bunu satıyor muydun?', answer: 'Hayır! Tek bir kere denemek için almıştım.',
            },
            {
                text: 'Talep varsa arz da olur. Ben sadece esnafım.', emotion: 'defiant', sympathy: false, law: 'children',
                detail: 'Okul önü',
                summary: 'Bir ortaokulun önünde öğrencilere uyuşturucu satarken yakalandı.',
                evidence: ['Üzerinde 40 paket ve okul çantasında saklanmış para bulundu.', 'Üç öğrenci kendisinden düzenli aldığını söylüyor.'],
                question: 'Müşterilerin kaç yaşında?', answer: 'Kimlik sormuyorum. Parası olan alır.',
            },
            {
                text: 'Yıllardır bağımlıyım. Tedaviye başladım, bırakmak istiyorum.', emotion: 'remorseful', sympathy: true, law: 'treatment',
                detail: 'Bağımlılık',
                summary: 'Parkta uyuşturucu kullanırken yakalandı. Üzerinde kişisel kullanım miktarı vardı.',
                evidence: ['Bulunan miktar: 1 gram.', 'İki aydır bir bağımlılık merkezinde tedavi görüyor; doktoru raporla doğruluyor.'],
                question: 'Tedavin nasıl gidiyor?', answer: 'Zor... Ama iki aydır her seansa gittim. Doktorum yazdı.',
            },
            {
                text: 'Garaj benim ama mallar emanetti. Ben sadece depoydum.', emotion: 'proud', sympathy: false, law: 'large',
                detail: 'Garaj deposu',
                summary: 'Garajında yapılan aramada 30 kilo uyuşturucu ve paketleme makinesi bulundu.',
                evidence: ['Ele geçen miktar: 30 kilo.', 'Telefonunda bir şebekeyle düzenli yazışmalar var.'],
                question: 'Malları kim getiriyordu?', answer: 'İsim vermem. Benim işim saklamaktı.',
            },
            {
                text: 'Arkadaşlara biraz satıyordum, büyütecek bir şey yok.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Gece kulübü',
                summary: 'Gece kulüplerinde arkadaş çevresine küçük paketler halinde uyuşturucu sattı.',
                evidence: ['Üzerinde 15 küçük paket ve hassas terazi bulundu.', 'İki alıcı kendisinden aldığını ifade etti.'],
                question: 'Ne zamandır satıyorsun?', answer: 'Birkaç ay. Cep harçlığı işte.',
            },
            {
                text: 'Abiler zorladı... Paketi götürmezsem dövüleceğimi söylediler.', emotion: 'panicked', sympathy: true, law: 'base', tags: ['minor'], age: 16,
                detail: 'Çocuk kurye',
                summary: 'Bir çetenin satış için verdiği paketleri mahallede dağıtırken yakalandı.',
                evidence: ['Üzerinde satış için hazırlanmış 10 paket bulundu.', 'Çete üyelerinin kendisini tehdit ettiği mesajlar telefonunda kayıtlı.'],
                question: 'Seni kim gönderdi?', answer: 'Mahalledeki abiler... Annemi de tanıyorlar. Korkuyorum.',
            },
        ],
    },

    traffic: {
        name: 'Trafik Suçu',
        severity: 4,
        laws: {
            base: { verdict: 'fine-major', text: 'tehlikeli araç kullanma, yaralanma yok' },
            injury: { verdict: 'house-arrest', text: 'Yaralanmalı kaza' },
            fatal: { verdict: 'jail-short', text: 'Ölümlü kaza' },
            flee: { verdict: 'jail-medium', text: 'Ölümlü kazadan sonra olay yerinden kaçma' },
            emergency: { verdict: 'release', text: 'Hayati bir acil durumda hız sınırını aşmış ve kimse zarar görmemişse' },
        },
        statements: [
            {
                text: 'Sadece iki bira içmiştim. Adam yola birden çıktı!', emotion: 'defiant', sympathy: false, law: 'injury', tags: ['alcohol'],
                detail: 'Alkollü kaza',
                summary: 'Alkollü araç kullanırken yaya geçidinde bir yayaya çarptı. Yayanın bacağı kırıldı.',
                evidence: ['Kaza anında kandaki alkol: 1,2 promil.', 'Kamera kaydında yayanın yeşil ışıkta geçtiği görülüyor.'],
                question: 'Kaç kadeh içmiştin?', answer: 'İki... belki dört. Ama kendimdeydim!',
            },
            {
                text: 'Kimseye bir şey olmadı ki! Sadece yarışıyorduk.', emotion: 'proud', sympathy: false, law: 'base', tags: ['minor'], age: 17,
                detail: 'Sokak yarışı',
                summary: 'Gece ehliyetsiz olarak babasının arabasıyla şehir içinde yarışırken yakalandı. Kimse yaralanmadı.',
                evidence: ['Radar ölçümü: saatte 160 km.', 'Yarış videoları sosyal medyada paylaşılmış.'],
                question: 'Ehliyetin var mı?', answer: 'Daha yaşım tutmuyor. Ama babamdan iyi kullanırım.',
            },
            {
                text: 'Korktum... Durursam linç edileceğimi düşündüm.', emotion: 'panicked', sympathy: false, law: 'flee',
                detail: 'Çarp-kaç',
                summary: 'Gece bir bisikletliye çarpıp durmadan kaçtı. Bisikletli olay yerinde hayatını kaybetti.',
                evidence: ['Araç ertesi gün boyası değiştirilirken bulundu.', 'Kamera kaydında çarptıktan sonra hızlanarak uzaklaştığı görülüyor.'],
                question: 'Neden durmadın?', answer: 'Panikledim... Sonra da boyacıya götürdüm. Biliyorum, affedilmez.',
            },
            {
                text: 'Eşimin suyu gelmişti! Hastaneye yetişmem gerekiyordu.', emotion: 'panicked', sympathy: true, law: 'emergency',
                detail: 'Doğum sancısı', gender: 'm',
                summary: 'Doğum sancısı çeken eşini hastaneye yetiştirirken hız sınırını iki katı aştı. Kimse zarar görmedi.',
                evidence: ['Radar ölçümü: saatte 140 km.', 'Hastane kaydı: bebek, varıştan 20 dakika sonra doğdu.'],
                question: 'Ambulans çağırdın mı?', answer: 'Aradım, 40 dakika dediler. Bekleyemezdik.',
            },
            {
                text: 'Üç gündür uyumamıştım... Direksiyonda gözüm kapandı.', emotion: 'remorseful', sympathy: true, law: 'fatal',
                detail: 'Otobüs kazası',
                summary: 'Şehirlerarası otobüs şoförüyken yolda uyuyakaldı. Otobüs devrildi, bir yolcu hayatını kaybetti.',
                evidence: ['Bir yolcu öldü, 12 yolcu yaralandı.', 'Şirket şoförleri günde 18 saat çalıştırıyor; kayıtlar bunu doğruluyor.'],
                question: 'Şirket seni dinlendiriyor muydu?', answer: 'Hayır. "Ya sür ya git" diyorlardı. Ailem bu maaşa muhtaç.',
            },
            {
                text: 'Kaza oldu, durdum, ambulansı ben aradım!', emotion: 'panicked', sympathy: false, law: 'flee',
                detail: 'Gece kazası',
                summary: 'Gece bir yayaya çarptı; yaya hastanede hayatını kaybetti. Sanık ambulansı kendisinin aradığını söylüyor.',
                evidence: ['Yaya hastanede hayatını kaybetti.', 'Alkol testi temiz çıktı.'],
                question: 'Ambulansı ne zaman aradın?', answer: 'Hemen! Başında bekledim.',
                delayed: {
                    note: 'Telefon ve kamera kayıtları bekleniyor',
                    evidence: 'Kayıtlar: ambulansı yoldan geçen biri aramış; sanık olay yerinden kaçmış ve 3 saat sonra karakola gelmiş.',
                },
            },
        ],
    },

    arson: {
        name: 'Kundaklama',
        severity: 4,
        laws: {
            base: { verdict: 'jail-medium', text: 'bilerek bina veya depo yakma' },
            insurance: { verdict: 'jail-short', text: 'Sigorta parası için kendi mülkünü yakma, kimse zarar görmemişse' },
            occupied: { verdict: 'jail-long', text: 'İçinde insan bulunan binayı yakma' },
            accident: { verdict: 'fine-major', text: 'Dikkatsizlik sonucu çıkan yangın (taksir)' },
        },
        statements: [
            {
                text: 'Dükkan batıyordu. Sigortadan başka kurtuluş yoktu.', emotion: 'remorseful', sympathy: false, law: 'insurance',
                detail: 'Sigorta için',
                summary: 'Kapanmak üzere olan kendi dükkanını gece benzin dökerek yaktı ve sigortaya başvurdu.',
                evidence: ['Yangın gece çıktı; binada kimse yoktu.', 'Yangından bir hafta önce sigorta tutarını iki katına çıkarmış.'],
                question: 'Sigortayı ne zaman artırdın?', answer: 'Bir hafta önce... Evet, planladım. Utanıyorum.',
            },
            {
                text: 'Beni terk etti. İçeride olduğunu bilsem de yakardım.', emotion: 'defiant', sympathy: false, law: 'occupied',
                detail: 'İntikam yangını',
                summary: 'Kendisinden ayrılan eski eşinin evini, eski eşi ve çocukları içerideyken ateşe verdi. Aile son anda kurtuldu.',
                evidence: ['İtfaiye aileyi pencereden çıkardı; iki çocuk dumandan zehirlendi.', 'Eve girmeden önce benzin aldığı market kaydı var.'],
                question: 'İçeride kimin olduğunu biliyor muydun?', answer: 'Biliyordum. Işıklar açıktı.',
            },
            {
                text: 'Sigarayı söndürdüm sanmıştım... Rüzgar çıktı.', emotion: 'panicked', sympathy: true, law: 'accident',
                detail: 'Orman yangını',
                summary: 'Piknikte attığı sigaradan çıkan yangın 5 dönüm ormanı yaktı.',
                evidence: ['Yangın sigara izmaritinden başlamış.', 'İtfaiyeyi ilk arayan kişi kendisi; söndürmeye de yardım etmiş.'],
                question: 'İtfaiyeyi kim aradı?', answer: 'Ben aradım. Sonra kova kova su taşıdım, yetmedi.',
            },
            {
                text: 'O fabrika köyümüzü zehirledi! Bir depo yandı, çocuklarımız yaşıyor.', emotion: 'proud', sympathy: true, law: 'base',
                detail: 'Fabrika deposu',
                summary: 'Köyün suyunu kirlettiği tespit edilen fabrikanın boş deposunu gece ateşe verdi.',
                evidence: ['Depo tamamen yandı; zarar ₺2.000.000.', 'Yangın gece çıktı ve bilerek başlatıldı; depoda kimse yoktu.'],
                question: 'Depoda kimse var mıydı?', answer: 'Kontrol ettim, kimse yoktu. Kimseyi öldürmek istemedim.',
            },
            {
                text: 'Sadece çöp kutusunu yakacaktık... Spor salonuna sıçradı.', emotion: 'panicked', sympathy: true, law: 'base', tags: ['minor'], age: 16,
                detail: 'Okul yangını',
                summary: 'Gece arkadaşlarıyla okulun çöp konteynerini yaktı. Ateş spor salonuna sıçradı ve salon kullanılamaz hale geldi.',
                evidence: ['Spor salonunda ₺800.000 hasar var.', 'Yangını bilerek başlattıklarını telefon videosu gösteriyor; okulda kimse yoktu.'],
                question: 'Neden ateş yaktınız?', answer: 'Sıkılmıştık... Videosunu çekip paylaşacaktık. Çok aptalca.',
            },
            {
                text: 'Mangal devrildi, ben ne yapabilirdim?', emotion: 'panicked', sympathy: false, law: 'occupied',
                detail: 'Apartman yangını',
                summary: 'Balkonundaki mangaldan çıktığı söylenen yangın alt kattaki daireye sıçradı. Alttaki yaşlı komşusu dumandan zehirlendi.',
                evidence: ['İtfaiye ilk raporunda yangının mangal çevresinde başladığını yazdı.', 'Alt kattaki komşusuyla aylardır otopark kavgası yaşıyordu.'],
                question: 'Komşunla aran nasıldı?', answer: 'Kötüydü... Ama bunun yangınla ne ilgisi var?',
                delayed: {
                    note: 'Kimyasal analiz sonucu bekleniyor',
                    evidence: 'Analiz: alt kattaki kapının önüne tiner dökülmüş; yangın bilerek başlatılmış ve içeride insan vardı.',
                },
            },
        ],
    },

    blackmail: {
        name: 'Şantaj',
        severity: 3,
        laws: {
            base: { verdict: 'fine-major', text: 'para için şantaj' },
            debt: { verdict: 'fine-moderate', text: 'Gerçek bir alacağı tahsil etmek için tehdit' },
            small: { verdict: 'fine-minor', text: 'Küçük miktar, ilk suç ve para iade edilmişse' },
            intimate: { verdict: 'jail-short', text: 'Özel fotoğraf veya görüntülerle şantaj' },
            cyber: { verdict: 'jail-medium', text: 'Bilgisayar sistemlerini kilitleyip fidye isteme' },
        },
        statements: [
            {
                text: 'O fotoğrafları bana kendisi gönderdi. İstediğimi yaparım.', emotion: 'defiant', sympathy: false, law: 'intimate',
                detail: 'Özel fotoğraflar',
                summary: 'Ayrıldığı sevgilisinin özel fotoğraflarını internete koymakla tehdit edip para istedi.',
                evidence: ['Mesajlarda "₺20.000 göndermezsen herkes görecek" yazıyor.', 'Fotoğraflardan ikisini sahte bir hesaptan paylaşmaya başlamış.'],
                question: 'Fotoğrafları paylaştın mı?', answer: 'Sadece ikisini. Ciddi olduğumu anlasın diye.',
            },
            {
                text: 'Kaçak kat çıkıyordu. Ben de susmanın bedelini istedim.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Kaçak kat',
                summary: 'Komşusunun kaçak kat çıktığını belediyeye bildirmemek için ondan para istedi.',
                evidence: ['Komşusundan iki seferde ₺30.000 almış.', 'Üçüncü ödemeyi isterken ses kaydına alınmış.'],
                question: 'Komşundan ne kadar aldın?', answer: 'Hak ettiğim kadar. Sessizlik ucuz değil.',
            },
            {
                text: 'Altı aydır maaşımı vermedi! Ben de vergi kaçırdığını söylerim dedim.', emotion: 'defiant', sympathy: true, law: 'debt',
                detail: 'Ödenmeyen maaş',
                summary: 'Altı aylık maaşını ödemeyen patronunu, ödemezse vergi kaçakçılığını ihbar etmekle tehdit etti.',
                evidence: ['İstediği para tam olarak altı aylık maaşı: ₺90.000.', 'Bordro kayıtları maaşların ödenmediğini doğruluyor.'],
                question: 'Senin alacağın ne kadar?', answer: 'Altı aylık maaşım, kuruşu kuruşuna. Fazlasını istemedim.',
            },
            {
                text: 'Parayı geri verdim... Sadece şaka gibi başlamıştı.', emotion: 'remorseful', sympathy: true, law: 'small', tags: ['minor', 'restitution'], age: 17,
                detail: 'Sınıf arkadaşı',
                summary: 'Sınıf arkadaşının sınavda kopya çektiğini öğretmene söylemekle tehdit edip ₺200 aldı.',
                evidence: ['₺200 sahibine geri verildi.', 'İlk disiplin olayı; okul aile ile görüşme yaptı.'],
                question: 'Parayı neden aldın?', answer: 'Bilmiyorum... Kendimi güçlü hissettim. Hemen geri verdim.',
            },
            {
                text: 'Güvenlik açıklarını ben bulmasam başkası bulurdu.', emotion: 'proud', sympathy: false, law: 'cyber',
                detail: 'Fidye yazılımı',
                summary: 'Bir hastanenin bilgisayar sistemini kilitleyip açmak için kripto para fidyesi istedi.',
                evidence: ['Hastanede ameliyatlar iki gün ertelendi.', 'Fidye mesajı sanığın bilgisayarından gönderilmiş.'],
                question: 'Hastane olduğunu biliyor muydun?', answer: 'Biliyordum. Hastaneler hep öder.',
            },
        ],
    },

    treason: {
        name: 'Vatana İhanet',
        severity: 5,
        laws: {
            base: { verdict: 'death', text: 'düşmana devlet sırrı satma' },
            coerced: { verdict: 'jail-medium', text: 'Ailesi rehin alınarak zorlanmışsa' },
            whistleblower: { verdict: 'jail-short', text: 'Kamuyu bilgilendirmek için gizli belge sızdırma' },
            negligence: { verdict: 'fine-major', text: 'Dikkatsizlikle gizli bilgi kaybetme' },
        },
        statements: [
            {
                text: 'Para iyiydi. Vatan dediğiniz de bir harita parçası.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Askeri planlar',
                summary: 'Genelkurmayda subayken sınır savunma planlarını yabancı bir ülkenin istihbaratına sattı.',
                evidence: ['Yurt dışı hesabına 18 ayda ₺6.000.000 yatırılmış.', 'Yabancı bir ajanla buluşmaları kamerayla kayıt altında.'],
                question: 'Belgeleri kime verdin?', answer: 'Hangi ülke olduğunun önemi var mı? En çok vereni seçtim.',
            },
            {
                text: 'Kızımı kaçırdılar! Şifreleri vermezsem öldüreceklerdi.', emotion: 'panicked', sympathy: true, law: 'coerced',
                detail: 'Şifreler',
                summary: 'Savunma sanayiinde mühendisken askeri haberleşme şifrelerini yabancı ajanlara verdi.',
                evidence: ['Kızı olaydan üç gün önce kaçırılmış ve şifreler verildikten sonra bırakılmış.', 'Kaçırılma emniyet kayıtlarında ve fidye mesajlarıyla doğrulanıyor.'],
                question: 'Neden polise gitmedin?', answer: '"Polise gidersen kızını parça parça yollarız" dediler.',
            },
            {
                text: 'Bakanlığın silah ihalesindeki rüşveti halk bilmeliydi.', emotion: 'defiant', sympathy: true, law: 'whistleblower',
                detail: 'Sızdırılan belgeler',
                summary: 'Bakanlıkta memurken bir silah ihalesindeki rüşvet yazışmalarını gazetelere sızdırdı.',
                evidence: ['Belgeler yalnızca yerli gazetelere verilmiş, yabancı bir ülkeye değil.', 'Sızdırdığı belgeler sonrasında üç bürokrat rüşvetten tutuklandı.'],
                question: 'Belgelerden para kazandın mı?', answer: 'Tek kuruş almadım. İşimi de kaybettim.',
            },
            {
                text: 'Çantamı trende unuttum... İçinde ne olduğunu biliyordum, utanıyorum.', emotion: 'remorseful', sympathy: true, law: 'negligence',
                detail: 'Kayıp dizüstü',
                summary: 'Gizli belgeler içeren görev bilgisayarını trende unuttu. Bilgisayar iki gün sonra bulundu.',
                evidence: ['Bilgisayar şifreliydi ve açılmamış.', 'Uzmanlar bilgilerin kimsenin eline geçmediğini doğruladı.'],
                question: 'Kaybı ne zaman bildirdin?', answer: 'Fark ettiğim anda, bir saat içinde. Hiçbir şey saklamadım.',
            },
        ],
    },

    childAbuse: {
        name: 'Çocuk İstismarı',
        severity: 5,
        laws: {
            base: { verdict: 'death', text: 'çocuğa cinsel istismar' },
            attempt: { verdict: 'jail-long', text: 'Teşebbüs aşamasında kalmış, çocuk zarar görmemişse' },
        },
        statements: [
            {
                text: 'Yalan söylüyorlar. Ben o çocuklara emek verdim.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Öğretmen',
                summary: 'İlkokul öğretmeniyken yıllar içinde birden fazla öğrencisini istismar ettiği ortaya çıktı.',
                evidence: ['Dört öğrencinin ifadesi birbiriyle örtüşüyor.', 'Adli tıp raporları ve okul kamerası kayıtları ifadeleri doğruluyor.'],
                question: 'Çocuklar neden yalan söylesin?', answer: 'Aileleri doldurmuştur. Ben bir şey hatırlamıyorum.',
            },
            {
                text: 'Sadece sohbet ediyorduk. Yaşını bilmiyordum.', emotion: 'panicked', sympathy: false, law: 'attempt',
                detail: 'İnternet tuzağı',
                summary: 'İnternette 13 yaşında olduğunu söyleyen bir çocukla buluşmaya gittiğinde polis operasyonuyla yakalandı.',
                evidence: ['"Çocuk" hesabı polisin tuzak hesabıydı; gerçek bir çocuk zarar görmedi.', 'Yazışmalarda karşısındakinin 13 yaşında olduğu defalarca yazıyor.'],
                question: 'Karşındakinin yaşını biliyor muydun?', answer: '...Yazmıştı. Ama ben ciddiye almadım.',
            },
            {
                text: 'Ailemizin içinde olan ailede kalır. Sizi ilgilendirmez.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Üvey baba', gender: 'm',
                summary: 'Üvey kızını yıllarca istismar ettiği, çocuğun okul rehber öğretmenine anlatmasıyla ortaya çıktı.',
                evidence: ['Rehber öğretmen ve okul psikoloğu çocuğun ifadesini kayda geçirdi.', 'Adli tıp raporu istismarı doğruluyor.'],
                question: 'Çocuğun ifadesine ne diyorsun?', answer: 'Çocuk bu, ne anlar? Annesi kışkırtıyor.',
            },
        ],
    },

    terrorism: {
        name: 'Terör',
        severity: 5,
        laws: {
            base: { verdict: 'death', text: 'can kaybına yol açan saldırı' },
            plot: { verdict: 'jail-long', text: 'Saldırı hazırlığında yakalanmış, can kaybı yok' },
            logistics: { verdict: 'jail-medium', text: 'Örgüte malzeme veya para taşıma' },
            propaganda: { verdict: 'jail-short', text: 'Yalnızca örgüt propagandası' },
        },
        statements: [
            {
                text: 'Davam için yaptım. Pişman değilim.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Bombalı saldırı',
                summary: 'Kalabalık bir otogara yerleştirdiği bombayla 7 kişinin ölümüne neden oldu.',
                evidence: ['Bombanın yapıldığı malzemeler evinde bulundu.', 'Kamera kaydında bombalı çantayı bırakırken görülüyor.'],
                question: 'Ölenleri tanıyor muydun?', answer: 'Hayır. Kim olduklarının önemi yoktu.',
            },
            {
                text: 'Henüz hiçbir şey yapmadım! Düşünmek suç mu?', emotion: 'defiant', sympathy: false, law: 'plot',
                detail: 'Saldırı hazırlığı',
                summary: 'Bir alışveriş merkezine saldırı planlarken evinde patlayıcı ve keşif notlarıyla yakalandı.',
                evidence: ['Evinde 5 kilo patlayıcı ve AVM\'nin kat planları bulundu.', 'Saldırı tarihi olarak ertesi haftanın yazıldığı notlar var.'],
                question: 'Patlayıcıyı ne için aldın?', answer: 'Ne için olduğunu biliyorsunuz. Erken geldiniz, o kadar.',
            },
            {
                text: 'Paketlerde ne olduğunu sormadım. Ailemin borcu vardı.', emotion: 'remorseful', sympathy: true, law: 'logistics', tags: ['minor'], age: 17,
                detail: 'Kurye',
                summary: 'Bir terör örgütü için şehirler arasında para ve malzeme taşırken yakalandı.',
                evidence: ['Üzerinde örgüte ait ₺150.000 nakit bulundu.', 'Ailesinin örgüt üyelerine borçlu olduğu ve tehdit edildiği tespit edildi.'],
                question: 'Seni bu işe kim soktu?', answer: 'Babamın borçlu olduğu adamlar. "Ya taşırsın ya baban gider" dediler.',
            },
            {
                text: 'Sadece paylaşım yaptım. Fikirlerim yüzünden mi yargılanıyorum?', emotion: 'defiant', sympathy: false, law: 'propaganda',
                detail: 'Propaganda',
                summary: 'Sosyal medyada bir terör örgütünün saldırılarını öven ve gençleri örgüte çağıran paylaşımlar yaptı.',
                evidence: ['200\'den fazla paylaşım tespit edildi.', 'Örgütle doğrudan bağlantısına veya eylemine dair kanıt yok.'],
                question: 'Örgütle görüştün mü?', answer: 'Hayır. Sadece yazdım. Yazmak da mı yasak?',
            },
        ],
    },

    kidnapping: {
        name: 'Adam Kaçırma',
        severity: 4,
        laws: {
            base: { verdict: 'jail-long', text: 'fidye için kaçırma' },
            released: { verdict: 'jail-medium', text: 'Rehine zarar görmeden kendiliğinden bırakılmışsa' },
            parental: { verdict: 'house-arrest', text: 'Velayeti olmayan ebeveynin kendi çocuğunu götürmesi' },
        },
        statements: [
            {
                text: 'İş adamının parası çoktu. Biraz paylaşsın istedik.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Fidye',
                summary: 'Bir iş insanının oğlunu okul çıkışında kaçırıp üç gün bodrumda tuttu ve fidye istedi.',
                evidence: ['Fidye olarak ₺5.000.000 istenmiş.', 'Çocuk polis operasyonuyla kurtarıldı; bodrumda zincir izleri var.'],
                question: 'Çocuğu bırakmayı düşündün mü?', answer: 'Para gelseydi bırakırdık. Gelmedi.',
            },
            {
                text: 'Korktum ve bıraktım. Kimseye dokunmadık, yemin ederim.', emotion: 'panicked', sympathy: false, law: 'released',
                detail: 'Bırakılan rehine',
                summary: 'Bir kuyumcuyu fidye için kaçırdı ama bir gün sonra kendiliğinden serbest bıraktı.',
                evidence: ['Kuyumcu yara almadan bir benzin istasyonunda bırakıldı.', 'Fidye istendiği telefon kayıtlarında görülüyor.'],
                question: 'Neden bıraktın?', answer: 'Adamın kalp ilacını görünce korktum. Ölür diye.',
            },
            {
                text: 'O benim de çocuğum! Altı aydır göremiyordum.', emotion: 'remorseful', sympathy: true, law: 'parental',
                detail: 'Velayet', gender: 'm',
                summary: 'Velayeti eski eşinde olan oğlunu okuldan izinsiz alıp başka şehre götürdü.',
                evidence: ['Çocuk iki gün sonra sağlıklı bulundu.', 'Mahkeme kararına rağmen eski eşi altı aydır görüşmeye izin vermiyormuş.'],
                question: 'Çocuk ne diyor?', answer: 'Babasını özlediğini söylüyor. Ben de onu...',
            },
            {
                text: 'Ona kötü bir şey yapmadım, sadece götürdüm!', emotion: 'defiant', sympathy: true, law: 'parental',
                detail: 'Kayıp çocuk', gender: 'm',
                summary: '6 yaşındaki bir çocuğu okul çıkışında arabasına bindirip götürdü. Çocuk iki gün sonra başka bir şehirde bulundu.',
                evidence: ['Çocuğun annesi kaçırıldığını ihbar etti; çocuk sağlıklı bulundu.', 'Sanık fidye istememiş.'],
                question: 'Çocukla ne ilişkin var?', answer: 'Söylesem kimse inanmaz zaten...',
                delayed: {
                    note: 'DNA ve nüfus kaydı incelemesi bekleniyor',
                    evidence: 'İnceleme: sanık çocuğun biyolojik babası; velayet annede ve babaya görüş izni verilmiyormuş.',
                },
            },
        ],
    },

    humanTrafficking: {
        name: 'İnsan Kaçakçılığı',
        severity: 5,
        laws: {
            base: { verdict: 'jail-long', text: 'insanları zorla çalıştırmak için kaçırma veya satma' },
            fatal: { verdict: 'death', text: 'Taşınan insanların ölümüne yol açmışsa' },
            smuggling: { verdict: 'jail-medium', text: 'Göçmenleri para karşılığı sınırdan geçirme, kimse zarar görmemişse' },
        },
        statements: [
            {
                text: 'Onlar gitmek istedi. Yolda olanlar benim suçum değil.', emotion: 'defiant', sympathy: false, law: 'fatal',
                detail: 'Kamyon',
                summary: 'Kapalı bir kamyon kasasında taşıdığı göçmenlerden 12\'si havasızlıktan hayatını kaybetti.',
                evidence: ['Kasada havalandırma yoktu; yolculuk 20 saat sürdü.', 'Göçmenlerden kişi başı ₺40.000 almış.'],
                question: 'Kasaya kaç kişi koydun?', answer: 'Kırk... Belki elli. Sığdıkları kadar.',
            },
            {
                text: 'İş bulduk onlara. Burada açlıktan ölmekten iyidir.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Zorla çalıştırma',
                summary: 'Yurt dışında iş vaadiyle getirdiği kadınların pasaportlarına el koyup ücretsiz çalıştırdı.',
                evidence: ['On bir kadının pasaportu kasasında bulundu.', 'Kadınlar aylardır maaş almadan ve kilitli bir yurtta tutulmuş.'],
                question: 'Pasaportlar neden sende?', answer: 'Kaçmasınlar diye. Yol paralarını ödemediler.',
            },
            {
                text: 'Savaştan kaçan insanlardı. Para aldım ama hepsi sağ salim geçti.', emotion: 'remorseful', sympathy: true, law: 'smuggling',
                detail: 'Sınır geçişi',
                summary: 'Teknesiyle 15 göçmeni para karşılığı sınırın öbür yakasına geçirdi. Kimse zarar görmedi.',
                evidence: ['Kişi başı ₺5.000 almış.', 'Teknede can yeleği vardı; yolculuk güvenli tamamlandı.'],
                question: 'Bu işi daha önce yaptın mı?', answer: 'İkinci kez. Balık tutarak çocuk okutamıyorum.',
            },
        ],
    },

    robbery: {
        name: 'Silahlı Gasp',
        severity: 4,
        laws: {
            base: { verdict: 'jail-medium', text: 'silahla tehdit ederek gasp' },
            fake: { verdict: 'jail-short', text: 'Oyuncak veya boş silah kullanılmış, kimse yaralanmamışsa' },
            injury: { verdict: 'jail-long', text: 'Mağdur yaralanmışsa' },
        },
        statements: [
            {
                text: 'Kasadaki para benim değil, bankanın. Kimin umurunda?', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Banka',
                summary: 'Tabancayla bir banka şubesine girip veznedarları tehdit ederek kasayı boşalttı.',
                evidence: ['Alınan para: ₺900.000.', 'Silah doluydu ama ateş edilmedi; kimse yaralanmadı.'],
                question: 'Silah dolu muydu?', answer: 'Doluydu tabii. Boş silahla kim korkar?',
            },
            {
                text: 'Silah plastikti! Kimseye zarar vermek istemedim.', emotion: 'panicked', sympathy: true, law: 'fake',
                detail: 'Oyuncak tabanca',
                summary: 'Oyuncak tabancayla bir markete girip kasadaki parayı aldı. Dışarıda yakalandı.',
                evidence: ['Alınan para: ₺3.200; geri alındı.', 'Silahın plastik oyuncak olduğu bilirkişi raporuyla kesin.'],
                question: 'Parayı ne için istiyordun?', answer: 'Kira... Ev sahibi yarın kapıya koyacaktı.',
            },
            {
                text: 'Adam direnmeseydi ateş etmezdim.', emotion: 'defiant', sympathy: false, law: 'injury',
                detail: 'Döviz bürosu',
                summary: 'Döviz bürosunu soyarken direnen çalışanı bacağından vurdu.',
                evidence: ['Çalışan ameliyat oldu; kalıcı aksama riski var.', 'Alınan para: ₺250.000.'],
                question: 'Neden ateş ettin?', answer: 'Alarm düğmesine uzandı. Ben de uzandım.',
            },
            {
                text: 'Sarhoştum, telefonunu istedim sadece... Bıçağı göstermek yetti.', emotion: 'remorseful', sympathy: false, law: 'base', tags: ['alcohol'],
                detail: 'Bıçaklı gasp',
                summary: 'Gece sokakta bir yayayı bıçakla tehdit edip telefonunu ve cüzdanını aldı.',
                evidence: ['Yakalandığında kandaki alkol: 1,6 promil.', 'Mağdur yaralanmadı; eşyalar geri alındı.'],
                question: 'O gece ne kadar içmiştin?', answer: 'Bir şişe rakı. Ayılınca ne yaptığımı anladım.',
            },
            {
                text: 'Ben yapmadım! O saatte işteydim!', emotion: 'panicked', sympathy: true, law: 'innocent',
                detail: 'Kuyumcu soygunu',
                summary: 'Silahlı bir kuyumcu soygununun faili olarak dükkan çalışanı tarafından teşhis edildi.',
                evidence: ['Kuyumcu çalışanı sanığı fotoğraftan teşhis etti.', 'Sanığın sabıkası yok; evinde silah veya altın bulunmadı.'],
                question: 'Soygun saatinde neredeydin?', answer: 'Fırında gece vardiyasındaydım! Patronuma sorun!',
                delayed: {
                    note: 'Kamera kayıtlarının incelenmesi bekleniyor',
                    evidence: 'Kamera kaydı: sanık soygun saatinde fırında çalışıyor; fail ona benzeyen başka biri.',
                },
            },
        ],
    },

    forgery: {
        name: 'Sahtecilik',
        severity: 2,
        laws: {
            base: { verdict: 'jail-short', text: 'resmi belgede sahtecilik' },
            money: { verdict: 'jail-medium', text: 'Sahte para basma veya dağıtma' },
            personal: { verdict: 'fine-moderate', text: 'Kendi kullanımı için sahte belge, kimseye zarar yok' },
        },
        statements: [
            {
                text: 'Matbaam vardı, bilgim vardı. Gerisi matematik.', emotion: 'proud', sympathy: false, law: 'money',
                detail: 'Sahte para',
                summary: 'İşlettiği matbaanın arka odasında sahte 200 liralık banknotlar bastı.',
                evidence: ['Toplam ₺2.000.000 değerinde sahte para ele geçirildi.', 'Paraların bir kısmı pazarlarda harcanmış.'],
                question: 'Paraları kim dağıtıyordu?', answer: 'Benim işim basmaktı. Dağıtanları siz bulun.',
            },
            {
                text: 'Diplomam yoktu ama işimi iyi yapıyordum!', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Sahte diploma',
                summary: 'Sahte üniversite diplomasıyla belediyede mühendis olarak işe girdi ve 4 yıl çalıştı.',
                evidence: ['Diploma, var olmayan bir fakülte adına düzenlenmiş.', 'İmzaladığı 30 projenin yeniden denetlenmesi gerekiyor.'],
                question: 'Diplomayı nereden aldın?', answer: 'Biri ayarladı. Herkes bir şekilde ayarlıyor.',
            },
            {
                text: 'Yaşımı büyük gösterdim, sadece konsere girmek için...', emotion: 'panicked', sympathy: true, law: 'personal', tags: ['minor'], age: 16,
                detail: 'Sahte kimlik',
                summary: 'Bir konsere girmek için kimlik kartının fotokopisinde doğum yılını değiştirdi.',
                evidence: ['Belge yalnızca konser girişinde kullanılmış.', 'Başka bir yerde kullanıldığına dair kayıt yok.'],
                question: 'Belgeyi başka yerde kullandın mı?', answer: 'Hayır! Sadece o akşam. Konser bile güzel değildi.',
            },
        ],
    },

    animalCruelty: {
        name: 'Hayvana Eziyet',
        severity: 2,
        laws: {
            base: { verdict: 'fine-moderate', text: 'hayvana kasten eziyet' },
            killing: { verdict: 'house-arrest', text: 'Hayvanı öldürme veya kalıcı sakat bırakma' },
            neglect: { verdict: 'fine-minor', text: 'İhmal sonucu, durum düzeltilmişse' },
        },
        statements: [
            {
                text: 'Sokak köpekleri mahalleyi bastı. Biri bir şey yapmalıydı.', emotion: 'proud', sympathy: false, law: 'killing',
                detail: 'Zehirlenen köpekler',
                summary: 'Mahalledeki sokak köpeklerine zehirli et vererek 8 köpeğin ölümüne neden oldu.',
                evidence: ['Evinde aynı zehirden bir şişe bulundu.', 'Komşular et parçalarını dağıtırken kendisini görmüş.'],
                question: 'Belediyeye başvurdun mu?', answer: 'Başvurmadım. Kendi çözümümü buldum.',
            },
            {
                text: 'Atı biraz fazla çalıştırdım. Ekmek parası...', emotion: 'remorseful', sympathy: true, law: 'neglect',
                detail: 'Fayton atı',
                summary: 'Fayton atını yaz sıcağında susuz bıraktı; at yorgunluktan yere yığıldı.',
                evidence: ['At veteriner tedavisiyle iyileşti.', 'Sanık ata gölgelik ve su deposu yaptırdı; veteriner kontrolleri düzenli.'],
                question: 'At şimdi nasıl?', answer: 'İyileşti. Artık öğlen sıcağında çalıştırmıyorum, söz.',
            },
            {
                text: 'Benim kedim, istediğimi yaparım. Videoyu da eğlence için çektim.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Video',
                summary: 'Kedisine eziyet ettiği videoları sosyal medyada paylaştı.',
                evidence: ['Videolar 50.000 kez izlenmiş.', 'Kedi veterinerde tedavi altına alındı; kalıcı hasar yok.'],
                question: 'Neden paylaştın?', answer: 'Beğeni geliyordu. İnsanlar seviyor böyle şeyleri.',
            },
        ],
    },

    environment: {
        name: 'Çevre Suçu',
        severity: 3,
        laws: {
            base: { verdict: 'fine-major', text: 'doğaya zehirli atık dökme' },
            health: { verdict: 'jail-short', text: 'İnsan sağlığına zarar vermişse' },
            small: { verdict: 'fine-minor', text: 'Küçük çaplı, ilk kez ve temizlenmişse' },
        },
        statements: [
            {
                text: 'Arıtma tesisi çok pahalı. Dere zaten kirliydi.', emotion: 'defiant', sympathy: false, law: 'health',
                detail: 'Fabrika atığı',
                summary: 'Fabrikasının kimyasal atıklarını geceleri dereye boşalttı. Köyde onlarca kişi zehirlendi.',
                evidence: ['Köyde 40 kişi zehirlenme şikayetiyle hastaneye kaldırıldı.', 'Derede fabrikanın kullandığı kimyasallar tespit edildi.'],
                question: 'Atığı neden dereye döktün?', answer: 'Arıtma tesisi milyonlarca lira. Kâr nasıl edeceğim?',
            },
            {
                text: 'İnşaat molozunu ormana döktük. Kimseye bir şey olmadı.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Moloz',
                summary: 'İnşaat firmasının moloz ve boya atıklarını koruma altındaki ormana döktürdü.',
                evidence: ['20 kamyon atık döküldüğü tespit edildi.', 'Bölgede insan sağlığına zarar tespit edilmedi.'],
                question: 'Kaç kamyon döktürdünüz?', answer: 'Saymadım. Döküm sahası uzak, mazot pahalı.',
            },
            {
                text: 'Piknik çöplerimi bıraktım. Ertesi gün gidip topladım.', emotion: 'remorseful', sympathy: true, law: 'small', tags: ['restitution'],
                detail: 'Piknik çöpü',
                summary: 'Milli parkta piknik yaptıktan sonra çöplerini doğada bıraktı.',
                evidence: ['Ertesi gün geri dönüp bütün çöpleri kendisi topladı.', 'İlk kez ceza alıyor.'],
                question: 'Çöpleri neden geri topladın?', answer: 'Gece uyuyamadım. Çocuklarım orada oynayacak.',
            },
        ],
    },

    perjury: {
        name: 'Yalancı Tanıklık',
        severity: 2,
        laws: {
            base: { verdict: 'house-arrest', text: 'mahkemede bilerek yalan söyleme' },
            framedInnocent: { verdict: 'jail-medium', text: 'Masum birinin mahkum olmasına yol açmışsa' },
            corrected: { verdict: 'fine-moderate', text: 'Bir yakınını korumak için yapıp sonradan kendisi düzeltmişse' },
        },
        statements: [
            {
                text: 'Para verdiler, ben de söylediklerini söyledim.', emotion: 'defiant', sympathy: false, law: 'framedInnocent',
                detail: 'Para karşılığı tanıklık',
                summary: 'Para karşılığı verdiği yalan ifadeyle masum bir adam 3 yıl hapis yattı.',
                evidence: ['Gerçek fail sonradan itiraf etti.', 'Sanığın hesabına duruşmadan önce ₺50.000 yatırılmış.'],
                question: 'Parayı kim verdi?', answer: 'Gerçek failin ailesi. Adam yattı mı umurumda değildi.',
            },
            {
                text: 'Oğlumu korumak istedim... Ertesi gün gelip gerçeği anlattım.', emotion: 'remorseful', sympathy: true, law: 'corrected',
                detail: 'Anne', gender: 'f',
                summary: 'Oğlunun karıştığı bir kavgada mahkemede oğlunun orada olmadığını söyledi.',
                evidence: ['Ertesi gün mahkemeye gelip ifadesini kendisi düzeltti.', 'Yalan ifade nedeniyle kimse ceza almadı.'],
                question: 'Neden fikrini değiştirdin?', answer: 'Aynaya bakamadım. Oğlum da hatasını üstlenmeli.',
            },
            {
                text: 'Patronum ne derse onu söyledim. İşimi kaybedemezdim.', emotion: 'panicked', sympathy: false, law: 'base',
                detail: 'İş kazası',
                summary: 'Bir iş kazası davasında patronunu korumak için güvenlik önlemlerinin alındığını söyledi.',
                evidence: ['Şantiye kayıtları güvenlik önlemlerinin alınmadığını gösteriyor.', 'Yalanı başka tanıkların ifadesiyle ortaya çıktı; dava hâlâ sürüyor.'],
                question: 'Patronun seni tehdit etti mi?', answer: 'Açıkça değil. Ama ne demek istediğini anladım.',
            },
        ],
    },

    domesticViolence: {
        name: 'Aile İçi Şiddet',
        severity: 3,
        laws: {
            base: { verdict: 'jail-short', text: 'eşe veya aile bireyine şiddet' },
            repeat: { verdict: 'jail-medium', text: 'Tekrarlayan şiddet veya çocuğa şiddet' },
        },
        notes: ['Mağdurun şikayetini geri çekmesi cezayı düşürmez.'],
        statements: [
            {
                text: 'Bir tokat attım, o kadar. Her evde olur.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Tokat',
                summary: 'Akşam yemeğinde çıkan tartışmada eşini tokatladı. Komşular polisi aradı.',
                evidence: ['Doktor raporu: yüzde morluk.', 'Eşi şikayetini geri çekmek istiyor; daha önce kayıt yok.'],
                question: 'Eşin neden şikayeti geri çekiyor?', answer: 'Çünkü aile meselesi bu. Bir daha olmaz.',
            },
            {
                text: 'Çocuk terbiyesi bu! Babam da beni böyle büyüttü.', emotion: 'proud', sympathy: false, law: 'repeat',
                detail: 'Çocuğa şiddet',
                summary: '10 yaşındaki oğlunu kemerle dövdü. Öğretmeni çocuğun vücudundaki izleri fark etti.',
                evidence: ['Çocuğun vücudunda eski ve yeni darp izleri var.', 'Okul son bir yılda üç kez rapor tutmuş.'],
                question: 'Bunu ilk kez mi yaptın?', answer: 'Hak ettikçe. Ben de böyle büyüdüm, adam oldum.',
            },
            {
                text: 'Yine sarhoştum, hatırlamıyorum... Bir daha içmeyeceğim.', emotion: 'remorseful', sympathy: false, law: 'repeat', tags: ['alcohol'],
                detail: 'Alkollü şiddet',
                summary: 'Alkollüyken eşini darp etti. Eşi daha önce de iki kez şikayetçi olmuş.',
                evidence: ['Olay anında kandaki alkol: 2,0 promil.', 'Son iki yılda aynı eşe karşı iki şiddet kaydı daha var.'],
                question: 'Daha önce de oldu mu?', answer: '...İki kere. Ama hep içkiden.',
            },
        ],
    },

    stalking: {
        name: 'Israrlı Takip',
        severity: 2,
        laws: {
            base: { verdict: 'house-arrest', text: 'birini ısrarla takip edip rahatsız etme' },
            threat: { verdict: 'jail-short', text: 'Ölüm tehdidi eşlik ediyorsa' },
            first: { verdict: 'fine-moderate', text: 'İlk kez, kısa süreli ve takip sona ermişse' },
        },
        statements: [
            {
                text: 'Onu seviyorum! Sadece konuşmak istiyordum.', emotion: 'panicked', sympathy: false, law: 'base',
                detail: 'Eski sevgili',
                summary: 'Ayrıldığı sevgilisini aylarca evinin ve işinin önünde bekledi, her gün onlarca mesaj attı.',
                evidence: ['Dört ayda 2.000\'den fazla mesaj gönderilmiş.', 'Uzaklaştırma kararına rağmen iki kez evinin önünde görülmüş.'],
                question: 'Uzaklaştırma kararını biliyor muydun?', answer: 'Biliyordum. Ama kâğıt sevgiyi durduramaz.',
            },
            {
                text: '"Benim olmazsan kimsenin olamazsın" dedim, evet. Ciddiydim.', emotion: 'defiant', sympathy: false, law: 'threat',
                detail: 'Ölüm tehdidi',
                summary: 'Kendisini reddeden iş arkadaşını takip etti ve mesajlarla ölümle tehdit etti.',
                evidence: ['Mesajlarda açık ölüm tehditleri var.', 'Arabasında mağdurun ev adresinin yazılı olduğu not bulundu.'],
                question: 'Tehdidi gerçekleştirecek miydin?', answer: 'Yakalanmasaydım belki görürdünüz.',
            },
            {
                text: 'Ünlü biri, hayranıyım sadece. Üç gün otelinin önünde bekledim.', emotion: 'remorseful', sympathy: true, law: 'first',
                detail: 'Hayran',
                summary: 'Sevdiği şarkıcıyı üç gün boyunca otelinden konser salonuna kadar takip etti.',
                evidence: ['İlk kez şikayet alıyor.', 'Şarkıcının ekibinin uyarısından sonra takibi bıraktığı doğrulandı.'],
                question: 'Uyarıdan sonra ne yaptın?', answer: 'Eve döndüm. Utandım. Sadece imza istiyordum.',
            },
        ],
    },

    armsTrafficking: {
        name: 'Silah Kaçakçılığı',
        severity: 4,
        laws: {
            base: { verdict: 'jail-medium', text: 'satış amaçlı ruhsatsız silah' },
            terror: { verdict: 'death', text: 'Terör örgütüne silah satıp saldırıda kullanılmışsa' },
            personal: { verdict: 'fine-moderate', text: 'Tek bir ruhsatsız silah, kişisel kullanım' },
        },
        statements: [
            {
                text: 'Ben sadece satıcıyım. Kimin ne yaptığı beni ilgilendirmez.', emotion: 'proud', sympathy: false, law: 'terror',
                detail: 'Örgüte silah',
                summary: 'Bir terör örgütüne düzenli olarak silah sattı. Sattığı tüfekler bir saldırıda kullanıldı.',
                evidence: ['Saldırıda kullanılan tüfeklerin seri numaraları sanığın deposuna çıkıyor.', 'Örgüt üyeleriyle yazışmalarında saldırı tarihi konuşulmuş.'],
                question: 'Silahların nerede kullanılacağını biliyor muydun?', answer: 'Biliyordum. Fiyatı da ona göre koydum.',
            },
            {
                text: 'Bagajda birkaç tabanca... Büyütmeyin.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Bagaj',
                summary: 'Arabasının bagajında satış için hazırlanmış 25 ruhsatsız tabancayla yakalandı.',
                evidence: ['25 tabanca ve 3.000 mermi ele geçirildi.', 'Telefonunda alıcılarla fiyat pazarlığı mesajları var.'],
                question: 'Silahları kime satacaktın?', answer: 'Kim isterse. Mahallede talep çok.',
            },
            {
                text: 'Dedemden kalan av tüfeği. Ruhsatı yenilemeyi unuttum.', emotion: 'remorseful', sympathy: true, law: 'personal',
                detail: 'Av tüfeği',
                summary: 'Evinde yapılan aramada ruhsatı süresi dolmuş tek bir av tüfeği bulundu.',
                evidence: ['Tüfeğin 15 yıl önce ruhsatlı olduğu kayıtlarda var.', 'Başka silah ya da satış izi bulunmadı.'],
                question: 'Tüfeği kullanıyor musun?', answer: 'Yıllardır duvarda asılı. Dedemin hatırası.',
            },
        ],
    },

    malpractice: {
        name: 'Tıbbi İhmal',
        severity: 3,
        laws: {
            base: { verdict: 'jail-short', text: 'hastanın ölümüne yol açan ihmal' },
            fake: { verdict: 'jail-medium', text: 'Sahte diplomayla doktorluk yapma' },
            systemic: { verdict: 'fine-moderate', text: 'Aşırı çalışma kaynaklı hata, hasta kalıcı zarar görmemişse' },
        },
        statements: [
            {
                text: 'Ameliyat sırasında telefonla konuşmam neyi değiştirir?', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Ameliyat',
                summary: 'Rutin bir ameliyat sırasında uzun süre telefonla konuşan cerrah, hastanın kanamasını fark etmedi. Hasta öldü.',
                evidence: ['Ameliyathane kaydında 20 dakika telefonla konuştuğu görülüyor.', 'Bilirkişi: kanama zamanında fark edilseydi hasta kurtulurdu.'],
                question: 'Telefon görüşmesi neydi?', answer: 'Borsa. Önemli bir alım satım vardı.',
            },
            {
                text: 'Diplomam yok ama yüzlerce hastaya baktım. Kimse ölmedi!', emotion: 'proud', sympathy: false, law: 'fake',
                detail: 'Sahte doktor',
                summary: 'Sahte tıp diplomasıyla 6 yıl boyunca özel bir klinikte doktorluk yaptı.',
                evidence: ['Diploma sahte; tıp eğitimi almadığı kesin.', 'Yazdığı reçetelerin bir kısmı hastalarda yan etkiye yol açmış.'],
                question: 'Tıp eğitimin var mı?', answer: 'İnternetten çok şey öğrendim. Okul şart değil.',
            },
            {
                text: '36 saattir nöbetteydim... İlacın dozunu yanlış yazdım.', emotion: 'remorseful', sympathy: true, law: 'systemic',
                detail: 'Nöbet hatası',
                summary: '36 saatlik nöbetin sonunda bir hastaya yanlış dozda ilaç yazdı. Hemşire fark edip düzeltti.',
                evidence: ['Hasta kısa süreli yoğun bakıma alındı, tamamen iyileşti.', 'Hastane kayıtları doktorların 36 saat nöbet tuttuğunu gösteriyor.'],
                question: 'Kaç saattir uyumamıştın?', answer: 'İki gün. Kadro yok, nöbetçi yok. Ama hata benim.',
            },
            {
                text: 'Elimden geleni yaptım. Hasta zaten çok ağırdı.', emotion: 'remorseful', sympathy: true, law: 'innocent',
                detail: 'Acil servis',
                summary: 'Acil serviste baktığı hasta ameliyattan sonra hayatını kaybetti. Aile ihmal suçlaması yaptı.',
                evidence: ['Hasta ameliyattan iki saat sonra öldü.', 'Aile, doktorun geç müdahale ettiğini söylüyor.'],
                question: 'Neden geç müdahale ettin?', answer: 'Etmedim. Hasta geldiği an ameliyathaneye aldım.',
                delayed: {
                    note: 'Adli tıp otopsi raporu bekleniyor',
                    evidence: 'Otopsi: ölüm ameliyattan bağımsız, önceden var olan bir damar balonundan; müdahale zamanında ve doğru.',
                },
            },
        ],
    },

    // ---------- Act 2, "Sürgün" (Karaçam, a small town) ----------
    bloodFeud: {
        name: 'Kan Davası',
        branch: 'surgun',
        severity: 5,
        laws: {
            base: { verdict: 'jail-long', text: 'kan davası nedeniyle öldürme' },
            provoked: { verdict: 'jail-medium', text: 'Ağır tahrik altında, önceden plan yapılmadan' },
            pressured: { verdict: 'jail-short', text: 'Aile büyüklerinin baskısıyla, öldürmeye teşebbüs edip vazgeçmişse' },
        },
        statements: [
            {
                text: 'Dedemin kanını yerde bırakamazdım. Bu kasabada böyledir.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Otuz yıllık kan',
                summary: 'Otuz yıl önce dedesini öldüren ailenin en büyük oğlunu düğün çıkışında pusu kurup vurdu.',
                evidence: ['Silahı olaydan bir ay önce almış; maktulün yolunu günlerce gözlemiş.', 'Köy kahvesinde "Sıra onlarda" dediğini üç kişi duymuş.'],
                question: 'Pişman mısın?', answer: 'Pişman olursam dedeme ihanet etmiş olurum.',
            },
            {
                text: 'Kardeşimin mezarına tükürdü! O anı hatırlamıyorum bile.', emotion: 'panicked', sympathy: true, law: 'provoked',
                detail: 'Mezarlık',
                summary: 'Kardeşinin mezarını ziyaret ederken karşılaştığı düşman aileden bir adamı, mezara hakaret edince bıçakladı.',
                evidence: ['Tanıklar maktulün mezara tükürüp küfrettiğini doğruluyor.', 'Sanığın yanında silah yoktu; bıçak mezarlık bekçisinin kulübesinden alınmış.'],
                question: 'Bıçağı nereden aldın?', answer: 'Bekçinin kulübesinde duruyordu... Gözüm karardı.',
            },
            {
                text: 'Amcam silahı elime verdi. Tetiği çekemedim, kaçtım.', emotion: 'remorseful', sympathy: true, law: 'pressured', age: 19,
                detail: 'Çekemediği tetik',
                summary: 'Aile büyüklerinin baskısıyla düşman ailenin evine silahla gitti, kapıda vazgeçip silahı atarak kaçtı.',
                evidence: ['Kimse yaralanmadı; silah bahçede bulundu.', 'Amcasının "Gitmezsen bu evde yerin yok" dediğini annesi doğruluyor.'],
                question: 'Neden vazgeçtin?', answer: 'Kapıyı küçük bir kız açtı. Bana dedemin hikâyelerini anlatan biri yoktu onun gözlerinde.',
            },
            {
                text: 'Benim değil, töre kararı verdi. Ben sadece uyguladım.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Töre',
                summary: 'Aile meclisinin "kan bedeli" kararı üzerine komşu köyden bir genci öldürdü.',
                evidence: ['Aile meclisinin toplandığı ve kararı verdiği muhtar tarafından doğrulandı.', 'Cinayet silahı aile büyüğünün evinde saklanmış.'],
                question: 'Kararı kim verdi?', answer: 'Meclis. Ben itiraz etseydim sıra bana gelirdi.',
            },
        ],
    },

    landDispute: {
        name: 'Arazi Kavgası',
        branch: 'surgun',
        severity: 2,
        laws: {
            base: { verdict: 'fine-moderate', text: 'başkasının arazisini işgal veya sınır taşını oynatma' },
            violence: { verdict: 'jail-short', text: 'Arazi kavgasında birini yaralamışsa' },
            rightful: { verdict: 'release', text: 'Arazi tapuyla kendisine aitse' },
        },
        statements: [
            {
                text: 'O tarla dedemden kalma! Taşı ben koymadım, onlar oynattı.', emotion: 'defiant', sympathy: true, law: 'rightful',
                detail: 'Sınır taşı',
                summary: 'Komşusunun tarlasına çit çektiği ve sınır taşını oynattığı iddiasıyla yargılanıyor.',
                evidence: ['Kadastro ölçümünde çitin sanığın tapulu arazisinin içinde kaldığı görüldü.', 'Komşunun elindeki eski senet sahte çıktı.'],
                question: 'Tapun var mı?', answer: 'Var! Dedemin adına, 1962 tarihli. Getirdim de, bakın.',
            },
            {
                text: 'Sadece tarlamı sürdüm. Biraz taşmışım, ne olacak?', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Taşan saban',
                summary: 'Her yıl birkaç metre daha ilerleyerek komşusunun tarlasının bir dönümünü kendi tarlasına kattı.',
                evidence: ['Uydu fotoğrafları sınırın beş yılda 40 metre kaydığını gösteriyor.', 'Komşusu yaşlı ve tek başına; itiraz edememiş.'],
                question: 'Komşuna sordun mu?', answer: 'Kadıncağız zaten ekemiyor. Toprak boş kalmasın dedim.',
            },
            {
                text: 'Kürekle üstüme geldi, ben de vurdum!', emotion: 'panicked', sympathy: false, law: 'violence',
                detail: 'Kürek kavgası',
                summary: 'Su kanalı yüzünden çıkan kavgada komşusunun kafasına çapayla vurdu. Komşusu hastanede dikiş aldı.',
                evidence: ['Mağdurun kafasına 8 dikiş atıldı.', 'Tanıklara göre kavgayı sanık başlattı.'],
                question: 'Kavgayı kim başlattı?', answer: '...Ben. Ama suyumu kesmişti!',
            },
            {
                text: 'Vakıf "Bu arazi artık bizim" dedi. Ben de çiti söktüm.', emotion: 'defiant', sympathy: true, law: 'rightful',
                detail: 'Vakıf çiti',
                summary: 'Hikmet Vakfı\'nın tarlasına çektiği çiti söktüğü için vakıf tarafından şikayet edildi.',
                evidence: ['Tapu kayıtları arazinin sanığa ait olduğunu gösteriyor.', 'Vakfın elindeki devir belgesinde sanığın imzası taklit edilmiş.'],
                question: 'Araziyi vakfa sattın mı?', answer: 'Hayır! Bir gün gelip çit çektiler, o kadar.',
            },
        ],
    },

    election: {
        name: 'Seçim Suçu',
        branch: 'surgun',
        severity: 3,
        laws: {
            base: { verdict: 'jail-short', text: 'oy satın alma' },
            fraud: { verdict: 'jail-medium', text: 'Sandık veya sayım hilesi' },
            coerced: { verdict: 'fine-moderate', text: 'Oyunu baskıyla satmak zorunda kalan seçmen' },
        },
        statements: [
            {
                text: 'Herkese bir çuval un dağıttım, hayır işi bu!', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Un çuvalları',
                summary: 'Belediye seçiminden önce köylere "oy verirseniz" diyerek un ve yakacak dağıttı.',
                evidence: ['Dağıtım sırasında çekilmiş videoda "Sandıkta unutmayın" diyor.', 'Dağıtılan malların belediye deposundan çıktığı tespit edildi.'],
                question: 'Un parası nereden çıktı?', answer: 'Belediyenin deposu boştu zaten, biz doldurduk sayılır.',
            },
            {
                text: 'Sayım gecesi elektrik kesildi, ben ne yapayım?', emotion: 'defiant', sympathy: false, law: 'fraud',
                detail: 'Kesilen elektrik',
                summary: 'Sandık görevlisiyken sayım sırasında elektrik kesildiğinde 200 oy pusulasını değiştirdi.',
                evidence: ['Pusulaların aynı kalemle ve aynı el yazısıyla işaretlendiği tespit edildi.', 'Elektriğin trafodan bilerek kesildiği kamera kaydında görülüyor.'],
                question: 'Elektriği kim kesti?', answer: 'Bilmiyorum... Belediyeden biri "Rahat ol" demişti.',
            },
            {
                text: 'Oyumu sattım çünkü vermezsem işten atılacaktım.', emotion: 'remorseful', sympathy: true, law: 'coerced',
                detail: 'Fabrika işçisi',
                summary: 'Çalıştığı fabrikanın sahibine oy pusulasının fotoğrafını göndererek karşılığında ikramiye aldı.',
                evidence: ['Patronunun "Fotoğraf atmayan işini arasın" mesajı telefonunda kayıtlı.', 'Aldığı ikramiye: ₺500.'],
                question: 'Patronun ne dedi?', answer: '"Fotoğrafı atmayan pazartesi gelmesin." Üç çocuğum var.',
            },
            {
                text: 'Vakıf yurdundaki öğrencilere hangi oyu vereceklerini söyledim, o kadar.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Yurt sandığı',
                summary: 'Hikmet Vakfı yurdunun sorumlusuyken öğrencilere burs karşılığında belirli bir adaya oy vermelerini şart koştu.',
                evidence: ['Öğrencilere imzalatılan "taahhütname" ele geçirildi.', 'Oy vermeyen iki öğrencinin bursu kesilmiş.'],
                question: 'Bursları kim kesti?', answer: 'Vakıf yönetimi. Ben sadece listeyi verdim.',
            },
        ],
    },

    defamation: {
        name: 'Hakaret ve İftira',
        branch: 'surgun',
        severity: 2,
        laws: {
            base: { verdict: 'fine-moderate', text: 'asılsız iddialarla birini karalama' },
            truth: { verdict: 'release', text: 'İddialar belgelerle doğrulanmışsa (gerçeği söylemek suç değildir)' },
            falseCharge: { verdict: 'jail-short', text: 'Masum birini suçlu göstermek için sahte delil üretmek' },
        },
        statements: [
            {
                text: 'Kasaba meydanında herkes duydu, ama ben doğruyu söyledim!', emotion: 'defiant', sympathy: true, law: 'truth',
                detail: 'Meydan konuşması',
                summary: 'Pazar yerinde muhtarın yardım paralarını zimmetine geçirdiğini bağırarak anlattı; muhtar şikayetçi oldu.',
                evidence: ['Muhtarlık hesaplarında açıklanamayan ₺80.000 eksik var.', 'Muhtar hakkında ayrıca zimmet soruşturması başlatıldı.'],
                question: 'Bunu nereden biliyorsun?', answer: 'Yardım listesinde öldü diye gösterilen kişi benim annem. Hâlâ yaşıyor!',
            },
            {
                text: 'Komşum hırsız! Bunu herkes biliyor.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Hırsız damgası',
                summary: 'Kasabanın sosyal medya grubunda komşusunun hırsız olduğunu yazdı. Komşu işinden oldu.',
                evidence: ['Komşunun sabıkası yok; iddia edilen hırsızlıkla ilgili hiçbir kayıt bulunmadı.', 'Mesajlar 3.000 kişilik grupta paylaşılmış.'],
                question: 'Kanıtın var mı?', answer: 'Kanıta ne gerek var, yüzünden belli.',
            },
            {
                text: 'Evine o çantayı ben koydum, evet. Ama o adam beni mahvetti.', emotion: 'remorseful', sympathy: false, law: 'falseCharge',
                detail: 'Sahte delil',
                summary: 'Eski ortağını hırsızlıkla suçlamak için çalıntı bir çantayı onun deposuna sakladı ve polise ihbar etti.',
                evidence: ['Depo kamerasında çantayı bırakırken görülüyor.', 'Eski ortağı bu yüzden iki hafta tutuklu kaldı.'],
                question: 'Neden yaptın?', answer: 'Ortaklıktan ayrılırken beni dolandırdı. İntikam istedim.',
            },
        ],
    },

    organizedCrime: {
        name: 'Suç Örgütü',
        branch: 'surgun',
        severity: 4,
        laws: {
            base: { verdict: 'jail-medium', text: 'suç örgütüne üye olma' },
            leader: { verdict: 'jail-long', text: 'Örgütü kuran veya yöneten' },
            coerced: { verdict: 'house-arrest', text: 'Örgüte zorla sokulmuş ve suça katılmamışsa' },
        },
        statements: [
            {
                text: 'Vakfın işlerine karışmam. Bana verilen zarfları dağıttım, o kadar.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Zarf dağıtıcı',
                summary: 'Hikmet Vakfı adına esnaftan "bağış" adı altında haraç topladı.',
                evidence: ['Esnaftan 14 kişi düzenli para verdiğini ve vermeyenin dükkanının yakıldığını söylüyor.', 'Defterinde esnafın adları ve aylık "aidatları" yazılı.'],
                question: 'Parayı kime veriyordun?', answer: 'Vakfın muhasebesine. Ötesini bilmem.',
            },
            {
                text: 'Babamın borcu yüzünden beni yurda yazdılar. Kaçamadım.', emotion: 'panicked', sympathy: true, law: 'coerced', age: 22,
                detail: 'Yurttan kaçamayan',
                summary: 'Hikmet Vakfı yurdunda kalırken vakfın kayıt dışı işlerinde çalıştırıldı; baskında yakalandı.',
                evidence: ['Kimlik kartına yurt yöneticileri el koymuş.', 'Hiçbir suç eylemine katıldığına dair kanıt yok; sadece mutfakta çalışmış.'],
                question: 'Neden kaçmadın?', answer: 'Kimliğim onlardaydı. Kaçanı köy yolunda bulup geri getiriyorlardı.',
            },
            {
                text: 'Ben sadece güvenliği sağlıyordum. Kimseye silah çekmedim.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Vakfın korumaları',
                summary: 'Hikmet Vakfı\'nın silahlı koruma ekibinde görev aldı; vakfa borcunu ödemeyenleri tehdit ettiler.',
                evidence: ['Evinde ruhsatsız tabanca ve vakfın borçlu listesi bulundu.', 'İki borçlu tehdit edildiklerini ifade etti.'],
                question: 'Borçlulara ne yaptınız?', answer: 'Konuştuk. İkna ettik. Kimse ölmedi.',
            },
        ],
    },

    // ---------- Act 2, "Borç" (the high court) ----------
    bidRigging: {
        name: 'İhaleye Fesat',
        branch: 'borc',
        severity: 4,
        laws: {
            base: { verdict: 'jail-short', text: 'kamu ihalesine hile karıştırma' },
            massive: { verdict: 'jail-medium', text: 'Büyük kamu zararı veya can güvenliğini tehlikeye atma' },
            whistle: { verdict: 'fine-moderate', text: 'İhaleye katılıp hileyi kendisi ihbar etmişse' },
        },
        statements: [
            {
                text: 'Şartnameyi biz yazdık ama ihaleyi hak ederek aldık.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Şartname',
                summary: 'Belediye ihalesinin şartnamesini kendi firmasına uyacak şekilde, belediyedeki tanıdığıyla birlikte hazırladı.',
                evidence: ['Şartnamenin taslağı firmanın bilgisayarında, ihaleden bir ay önce oluşturulmuş.', 'İhaleye tek teklif verilmiş.'],
                question: 'Şartnameyi kim yazdı?', answer: 'Belediyeye "yardım" ettik. Herkes yapıyor.',
            },
            {
                text: 'Okul binası çöktü ama deprem çok büyüktü!', emotion: 'panicked', sympathy: false, law: 'massive',
                detail: 'Çöken okul',
                summary: 'Kazandığı okul inşaatı ihalesinde eksik demir ve kalitesiz beton kullandı; depremde okul çöktü.',
                evidence: ['Bilirkişi: kolonlarda projede öngörülen demirin yarısı kullanılmış.', 'Aynı depremde çevredeki yeni binalar ayakta kaldı.'],
                question: 'Demiri neden eksik kullandın?', answer: 'Fiyatı düşük vermiştik. Bir yerden kısmak lazımdı.',
            },
            {
                text: 'Hileyi gördüm ve savcılığa ben gittim. Şimdi beni de yargılıyorsunuz.', emotion: 'defiant', sympathy: true, law: 'whistle',
                detail: 'İhbarcı müteahhit',
                summary: 'Danışıklı bir ihaleye katıldı, sonra diğer firmaların anlaştığını savcılığa kendisi ihbar etti.',
                evidence: ['Savcılık kayıtlarında ihbar dilekçesi sanığın imzasını taşıyor.', 'İhbar, ihale sonuçlanmadan önce yapılmış.'],
                question: 'Neden ihbar ettin?', answer: 'Çocuklarımın okuyacağı yolu yapacaklardı. Çürük olacağını bildiğim halde susamazdım.',
            },
            {
                text: 'Bakanlıktan "Bu firma kazanacak" dediler, ben de imzaladım.', emotion: 'remorseful', sympathy: false, law: 'massive',
                detail: 'Hastane ihalesi',
                summary: 'İhale komisyonu başkanıyken, bakanlığın istediği firmaya hastane ihalesini piyasanın üç katı fiyatla verdi.',
                evidence: ['Kamu zararı: ₺40.000.000.', 'Firmanın ortaklarından biri bakan yardımcısının kayınbiraderi.'],
                question: 'Talimatı kim verdi?', answer: 'Yazılı değil... Telefonla. Adını söylersem ailem yanar.',
            },
            {
                text: 'Teklifleri önceden konuştuk, evet. Ama kimse zarar görmedi.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Kartel',
                summary: 'Dört firma, belediyenin yol ihalelerinde sırayla kazanmak için teklif fiyatlarını önceden belirledi.',
                evidence: ['Firmalar arası yazışmalarda "Bu sefer sıra sende" mesajları var.', 'İhalelerin fiyatları piyasanın %30 üzerinde kalmış.'],
                question: 'Sırayı kim belirliyordu?', answer: 'Toplantılarda kura çekiyorduk. Adil bir sistemdi.',
            },
        ],
    },

    pressCrime: {
        name: 'Basın Yoluyla Suç',
        branch: 'borc',
        severity: 2,
        laws: {
            base: { verdict: 'fine-moderate', text: 'bilerek yalan haber yayma' },
            truth: { verdict: 'release', text: 'Haber belgelere dayanıyorsa' },
            incitement: { verdict: 'jail-short', text: 'Halkı şiddete kışkırtmışsa' },
        },
        statements: [
            {
                text: 'Bakanlığın gizlediği raporu yayımladım. Her satırı doğru.', emotion: 'defiant', sympathy: true, law: 'truth',
                detail: 'Gizlenen rapor',
                summary: 'Bir barajdaki çatlakları gösteren gizli raporu yayımladığı için "halkı paniğe sevk etmek"le yargılanıyor.',
                evidence: ['Bağımsız mühendisler raporun gerçek olduğunu ve barajın onarım gerektirdiğini doğruladı.', 'Yayından sonra baraj acil bakıma alındı.'],
                question: 'Raporu nereden buldun?', answer: 'Kaynağımı vermem. Ama baraj şimdi onarılıyorsa yaptığım doğruydu.',
            },
            {
                text: 'Tıklanıyordu, ben de yazdım. Doğru mu yanlış mı kim bakar?', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Uydurma haber',
                summary: 'Bir iş insanının çocuk kaçırdığına dair tamamen uydurma bir haberi internet sitesinde yayımladı.',
                evidence: ['Haberde adı geçen olay hiç yaşanmamış; tanık olarak gösterilen kişiler gerçek değil.', 'İş insanının evi taşlandı.'],
                question: 'Haberin kaynağı ne?', answer: 'Kaynak... Hayal gücüm. Okurlar seviyor.',
            },
            {
                text: '"Sokaklara dökülün" dedim ama kimseye silah almasını söylemedim.', emotion: 'defiant', sympathy: false, law: 'incitement',
                detail: 'Kışkırtma',
                summary: 'Yayın organında bir mahalle halkını "hainler" diye gösterip "Gereğini yapın" çağrısı yaptı; ertesi gün mahalle saldırıya uğradı.',
                evidence: ['Saldırganların telefonlarında yayının linki ve "Gereğini yapıyoruz" mesajları var.', 'Saldırıda 12 kişi yaralandı.'],
                question: 'Saldırıyı gördün mü?', answer: 'Gördüm. Benim suçum yok, ben sadece söyledim.',
            },
            {
                text: 'Milletvekilinin yazışmalarını yayımladım, beni hapse atmak istiyorlar.', emotion: 'panicked', sympathy: true, law: 'truth',
                detail: 'Vekil yazışmaları',
                summary: 'Bir milletvekilinin yabancı bir şirketle yaptığı yazışmaları yayımladığı için "casusluk"la suçlanıyor.',
                evidence: ['Yazışmaların gerçekliği teknik incelemeyle doğrulandı.', 'Belgeler yalnızca gazetede yayımlanmış; kimseye satılmamış.'],
                question: 'Belgeleri kime gösterdin?', answer: 'Sadece okurlara. Ve şimdi size.',
            },
            {
                text: 'Bir yorum yazdım, o kadar. Milyonlarca kişi yazıyor.', emotion: 'remorseful', sympathy: true, law: 'base',
                detail: 'Sosyal medya',
                summary: 'Sosyal medyada bir hakimin rüşvet aldığını iddia eden, kanıtsız bir paylaşım yaptı; paylaşım 100.000 kez paylaşıldı.',
                evidence: ['Hakim hakkında hiçbir soruşturma veya kanıt yok.', 'Sanık paylaşımı ertesi gün silip özür diledi.'],
                question: 'Bunu neye dayanarak yazdın?', answer: 'Bir gruptan duydum... Araştırmadım. Hata ettim.',
            },
        ],
    },

    // ---------- Expansion: ten more crimes, in every mode ----------
    cyberFraud: {
        name: 'Bilişim Dolandırıcılığı',
        severity: 3,
        laws: {
            base: { verdict: 'jail-short', text: 'sahte site, mesaj veya arama ile para çekme' },
            elderly: { verdict: 'jail-medium', text: 'Yaşlıları veya engellileri hedef almışsa' },
            mule: { verdict: 'fine-moderate', text: 'Banka hesabını dolandırıcılara kiralamış ama dolandırıcılığa katılmamışsa' },
        },
        statements: [
            {
                text: 'Sadece bir site kurdum. İnsanlar kartlarını kendileri girdi.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Sahte kargo sitesi',
                summary: '"Kargonuz bekliyor" mesajlarıyla insanları sahte bir siteye yönlendirip kart bilgilerini çaldı.',
                evidence: ['600 kişiden toplam ₺900.000 çekilmiş.', 'Site sunucusunun kira faturası sanığın adına.'],
                question: 'Mesajları kim gönderiyordu?', answer: 'Bir program. Ben sadece "gönder" tuşuna bastım.',
            },
            {
                text: 'Banka görevlisi gibi konuştum, evet. Ama kimseyi zorlamadım.', emotion: 'defiant', sympathy: false, law: 'elderly',
                detail: 'Sahte banka görevlisi',
                summary: 'Kendini banka görevlisi olarak tanıtıp yaşlıları arayarak "hesabınız tehlikede" diyerek birikimlerini aktarttı.',
                evidence: ['Mağdurların hepsi 70 yaş üstü; biri bütün emekli ikramiyesini kaybetti.', 'Arama kayıtlarında 300\'den fazla yaşlı aranmış.'],
                question: 'Neden hep yaşlıları aradın?', answer: 'Çünkü onlar telefonu kapatmıyor.',
            },
            {
                text: 'Hesabımı kiraya verdim, ayda ₺2.000 veriyorlardı. Ne için kullandıklarını bilmiyordum.', emotion: 'panicked', sympathy: true, law: 'mule', age: 20,
                detail: 'Kiralık hesap',
                summary: 'Banka hesabını aylık ücret karşılığı tanımadığı kişilere kullandırdı; hesaptan dolandırılmış insanların parası geçti.',
                evidence: ['Hesaba giren paralar dolandırıcılık mağdurlarına ait.', 'Sanık hesabı kapatıp kendisine kalan ₺6.000\'i mağdurlara iade etti.'],
                question: 'Paralar nereden geliyordu, sormadın mı?', answer: 'Sordum, "kripto işi" dediler. Üniversite harcım vardı...',
            },
            {
                text: 'Sevgilim sandı beni. Ben de para istedim, o kadar.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Sahte sevgili',
                summary: 'İnternette sahte bir profille kurduğu ilişkide, karşısındakinden "hasta annesi için" diyerek defalarca para istedi.',
                evidence: ['Mağdurdan 8 ayda ₺350.000 almış.', 'Profilde kullandığı fotoğraflar başka bir kişiye ait.'],
                question: 'Hasta bir annen var mı?', answer: 'Yok. Hikâye ne kadar acıklı olursa o kadar çok para geliyor.',
            },
            {
                text: 'Babaanneme "torunun kaza yaptı" diye arayan çeteyi ben yakaladım! Şimdi beni mi suçluyorsunuz?', emotion: 'defiant', sympathy: true, law: 'elderly',
                detail: 'Sahte torun',
                summary: 'Yaşlılara "torununuz kaza yaptı, para lazım" diye telefon açan bir çetenin para toplayan elemanı olarak yakalandı.',
                evidence: ['Kendi babaannesinden de para almaya gittiği tespit edildi.', 'Çetenin topladığı paranın %20\'si sanığa ödenmiş.'],
                question: 'Babaannene neden gittin?', answer: '...Adresler listeden geliyordu. Onun olduğunu kapıda anladım.',
            },
            {
                text: 'Kripto yatırımı herkesin kazanabileceği bir şeydi. Piyasa çöktü.', emotion: 'remorseful', sympathy: false, law: 'base',
                detail: 'Sahte kripto borsası',
                summary: 'Kendi kurduğu sahte bir kripto borsasında insanların parasını topladı, sonra siteyi kapattı.',
                evidence: ['Borsada gerçek bir alım satım hiç yapılmamış.', '2.000 kullanıcının parası sanığın yurt dışı hesabına aktarılmış.'],
                question: 'Paralar nerede?', answer: 'Bir kısmı harcandı. Kalanını iade etmeye çalışacağım.',
            },
        ],
    },

    workSafety: {
        name: 'İş Güvenliği İhmali',
        severity: 4,
        laws: {
            base: { verdict: 'jail-short', text: 'gerekli önlemleri almayıp işçinin ölümüne yol açma' },
            injury: { verdict: 'fine-major', text: 'Önlem alınmamış ve işçi yaralanmışsa' },
            repeated: { verdict: 'jail-medium', text: 'Uyarılara rağmen önlem almayıp birden fazla ölüme yol açma' },
        },
        statements: [
            {
                text: 'Emniyet kemeri vardı, takmamışlar. Ben her işçinin başında duramam.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'İskeleden düşüş',
                summary: 'Şantiye sahibi. Korkuluksuz bir iskeleden düşen işçi hayatını kaybetti.',
                evidence: ['Şantiyede tek bir emniyet kemeri bile bulunmadı.', 'İş müfettişi iki hafta önce yazılı uyarı vermiş.'],
                question: 'Kemerler nerede?', answer: 'Sipariş verilmişti... Gelmedi. İş de beklemez.',
            },
            {
                text: 'Makinenin koruması bozuktu, tamirciyi çağırmıştım.', emotion: 'remorseful', sympathy: true, law: 'injury',
                detail: 'Pres makinesi',
                summary: 'Atölye sahibi. Koruma kapağı bozuk pres makinesinde çalışan bir işçinin iki parmağı koptu.',
                evidence: ['Kapağın bir haftadır bozuk olduğu biliniyordu.', 'Tamirci kaydı var ama makine bu sürede çalıştırılmaya devam etmiş.'],
                question: 'Makineyi neden durdurmadın?', answer: 'Sipariş yetişecekti... Şimdi o işçinin elini düşündükçe uyuyamıyorum.',
            },
            {
                text: 'Madende risk her zaman vardır. Bunu herkes bilir.', emotion: 'proud', sympathy: false, law: 'repeated',
                detail: 'Maden göçüğü',
                summary: 'Maden işletmesinin müdürü. Gaz ölçüm cihazları çalışmayan ocakta çıkan patlamada 5 işçi öldü.',
                evidence: ['Gaz sensörlerinin aylardır kapalı olduğu kayıtlarda görülüyor.', 'Müdür üç kez yazılı uyarı almış, cevap vermemiş.'],
                question: 'Sensörler neden kapalıydı?', answer: 'Alarm sürekli çalıyordu, üretim duruyordu.',
            },
            {
                text: 'Çocuk kendi istedi çalışmayı. Ailesi de razıydı.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Çocuk işçi',
                summary: 'Mobilya atölyesi sahibi. Kayıt dışı çalıştırdığı 15 yaşındaki bir çocuk tezgah kazasında öldü.',
                evidence: ['Çocuğun sigortası yok; günde 12 saat çalıştırılmış.', 'Kazanın olduğu tezgahın koruması sökülmüş.'],
                question: 'Çocuğa ne kadar ödüyordun?', answer: 'Haftalık ₺500. Ailesi muhtaçtı, yardım ediyordum.',
            },
            {
                text: 'İşçilere baret dağıttım, makbuzu bile var!', emotion: 'panicked', sympathy: false, law: 'injury',
                detail: 'Düşen kalas',
                summary: 'İnşaat taşeronu. Yukarıdan düşen bir kalas, baretsiz çalışan bir işçinin kafasını yaraladı.',
                evidence: ['Baretlerin dağıtıldığı makbuz tarihi kazadan sonraki gün.', 'İşçi hastanede 10 gün yattı, kalıcı hasar yok.'],
                question: 'Makbuz neden kazadan sonra?', answer: '...Önceden de dağıtmıştık. Kâğıdı sonra kestik.',
            },
            {
                text: 'Ben sadece ustabaşıyım. Patron "devam" dedi.', emotion: 'panicked', sympathy: true, law: 'base',
                detail: 'Ustabaşı',
                summary: 'Fırtına uyarısına rağmen ekibine çatıda çalışmaya devam ettirdi; rüzgârda düşen bir işçi öldü.',
                evidence: ['Meteoroloji turuncu uyarı yayımlamış.', 'Patronun "İş bitmeden kimse inmesin" mesajı ustabaşının telefonunda.'],
                question: 'Neden işi durdurmadın?', answer: 'Durdursaydım beni kovacaktı. Keşke kovsaydı.',
            },
        ],
    },

    fakeMedicine: {
        name: 'Sahte İlaç',
        severity: 4,
        laws: {
            base: { verdict: 'jail-medium', text: 'sahte ilaç üretip satma' },
            fatal: { verdict: 'jail-long', text: 'Sahte ilaç birinin ölümüne yol açmışsa' },
            unaware: { verdict: 'fine-moderate', text: 'Sahte olduğunu bilmeden, faturalı mal satan eczacı' },
        },
        statements: [
            {
                text: 'Hap haptır, kimse farkını anlamaz.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Merdiven altı imalat',
                summary: 'Bodrum katta kurduğu atölyede un ve boyayla sahte tansiyon ilacı üretip internetten sattı.',
                evidence: ['Atölyede 50.000 sahte tablet ele geçirildi.', 'Tabletlerde hiçbir etken madde yok.'],
                question: 'Hastalara ne olacağını düşündün mü?', answer: 'Hastalığı olan doktora gitsin. Ben satıcıyım.',
            },
            {
                text: 'İnsülin ucuz olsun istedim. Ölüm benim suçum değil.', emotion: 'defiant', sympathy: false, law: 'fatal',
                detail: 'Sahte insülin',
                summary: 'İnternetten "ucuz insülin" diye sattığı sahte ilacı kullanan bir şeker hastası hayatını kaybetti.',
                evidence: ['Ölen hastanın evinde sanığın sattığı kutular bulundu.', 'Kutulardaki sıvı sadece tuzlu su.'],
                question: 'İlaçları nereden aldın?', answer: 'Kendim doldurdum. Kutuları basmak zor değil.',
            },
            {
                text: 'Depodan faturalı aldım! Sahte olduğunu nasıl bileyim?', emotion: 'panicked', sympathy: true, law: 'unaware',
                detail: 'Mahalle eczacısı',
                summary: 'Eczanesinde sahte kanser ilacı satıldı. Eczacı ilaçları resmi bir depodan faturayla aldığını söylüyor.',
                evidence: ['Faturalar gerçek; depo da soruşturma altında.', 'Eczacı şüphelenip ilaçları kendisi ihbar etmiş.'],
                question: 'Şüphelenmeni ne sağladı?', answer: 'Kutunun rengi farklıydı. Hemen sattıklarımı geri topladım.',
            },
            {
                text: 'Zayıflama hapıydı, mucize değildi zaten!', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Zayıflama hapı',
                summary: 'Sosyal medyada "bitkisel zayıflama hapı" diye, içinde yasaklı madde olan sahte kapsüller sattı.',
                evidence: ['Kapsüllerde kalp ritmini bozan yasaklı bir madde bulundu.', 'Üç kullanıcı çarpıntıyla hastaneye kaldırıldı.'],
                question: 'İçinde ne olduğunu biliyor muydun?', answer: 'Biliyordum. O yüzden işe yarıyordu zaten.',
            },
            {
                text: 'Babamın ilacını bulamadım, sahte de olsa denedim.', emotion: 'remorseful', sympathy: true, law: 'base',
                detail: 'Komşulara dağıtım',
                summary: 'Babası için yurt dışından getirttiği sahte ilacı, aynı hastalığı olan komşularına da parayla sattı.',
                evidence: ['İlaçların sahte olduğunu bildiği yazışmalarından anlaşılıyor.', 'Komşulara satılan kutu sayısı: 40.'],
                question: 'Sahte olduğunu biliyor muydun?', answer: 'Şüpheleniyordum... Ama komşular çok ısrar etti, hayır diyemedim.',
            },
            {
                text: 'Aşı değil, vitamin sattım. İnsanlar yanlış anlamış.', emotion: 'proud', sympathy: false, law: 'fatal',
                detail: 'Sahte aşı',
                summary: 'Salgın döneminde "aşı" diye sattığı sıvıyı enjekte ettirdiği yaşlı bir kadın enfeksiyondan öldü.',
                evidence: ['Sıvı steril değil; enfeksiyonun kaynağı olduğu raporla kesin.', 'Satış ilanlarında açıkça "aşı" yazıyor.'],
                question: 'İlanda neden "aşı" yazdın?', answer: '"Vitamin" yazınca kimse almıyordu.',
            },
        ],
    },

    illegalBuilding: {
        name: 'Kaçak Yapı',
        severity: 2,
        laws: {
            base: { verdict: 'fine-moderate', text: 'ruhsatsız bina veya kat yapma' },
            danger: { verdict: 'jail-short', text: 'Can güvenliğini tehlikeye atan kaçak yapı' },
            shelter: { verdict: 'fine-minor', text: 'Kendi barınması için yapılmış tek katlı küçük ev' },
        },
        statements: [
            {
                text: 'Çatıya bir kat çıktım, herkes çıkıyor.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Çatı katı',
                summary: 'Dört katlı apartmanın üstüne ruhsatsız bir kat daha çıkıp kiraya verdi.',
                evidence: ['Belediyenin yıkım kararına rağmen inşaata devam etmiş.', 'Binanın statik raporu yeni kata dayanabildiğini gösteriyor.'],
                question: 'Belediye kararını aldın mı?', answer: 'Aldım. Bir gün af çıkar diye bekliyordum.',
            },
            {
                text: 'Kolonu kestim ama dükkan büyüsün diye. Bina yıkılmadı ki!', emotion: 'defiant', sympathy: false, law: 'danger',
                detail: 'Kesilen kolon',
                summary: 'Apartmanın zemin katındaki dükkanını büyütmek için taşıyıcı kolonu kesti.',
                evidence: ['Mühendis raporu: bina orta şiddette bir depremde çökebilir.', 'Bina tahliye edildi; 12 aile evsiz kaldı.'],
                question: 'Mühendise danıştın mı?', answer: 'Ustam "bir şey olmaz" dedi.',
            },
            {
                text: 'Çocuklarımla sokakta kalacaktık. Bir gecede iki oda yaptım.', emotion: 'remorseful', sympathy: true, law: 'shelter',
                detail: 'Gecekondu',
                summary: 'Hazine arazisine tek katlı, iki odalı bir ev yaptı.',
                evidence: ['Evde sanık ve üç çocuğu yaşıyor.', 'Başka bir mülkü veya geliri olmadığı tespit edildi.'],
                question: 'Başka gidecek yerin var mı?', answer: 'Yok. Belediye yıkarsa çadır kuracağım.',
            },
            {
                text: 'Sahil benim de hakkım. Biraz beton döktüm, iskele yaptım.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Sahil iskelesi',
                summary: 'Yazlığının önündeki sahile ruhsatsız beton bir iskele ve bir kulübe yaptı.',
                evidence: ['Sahil şeridi kamu malı; halkın geçişi engellenmiş.', 'Yapının kaldırılması için iki kez tebligat almış.'],
                question: 'Halkın geçişini engellediğini biliyor muydun?', answer: 'Yabancılar plajımda yürümesin istedim.',
            },
            {
                text: 'Yurt binası ruhsatsız ama öğrenciler güvende!', emotion: 'panicked', sympathy: false, law: 'danger',
                detail: 'Kaçak yurt',
                summary: 'Ruhsatsız, yangın merdiveni olmayan bir binayı 80 öğrenciye yurt olarak kiraladı.',
                evidence: ['Binada yangın merdiveni, alarm ve söndürme sistemi yok.', 'İtfaiye binayı "çok yüksek risk" olarak raporladı.'],
                question: 'Yangın merdiveni neden yok?', answer: 'Yapacaktık... Kayıt dönemi yetişmedi.',
            },
            {
                text: 'Köy evime bir oda ekledim. Annem yaşlı, yanımda kalsın diye.', emotion: 'remorseful', sympathy: true, law: 'shelter',
                detail: 'Anneye oda',
                summary: 'Köydeki evine yaşlı annesi için ruhsatsız tek bir oda ekledi.',
                evidence: ['Oda tek katlı ve evin bitişiğinde; kimseyi tehlikeye atmıyor.', 'Ruhsat başvurusu yapmış ama aylardır cevap alamamış.'],
                question: 'Ruhsata başvurdun mu?', answer: 'Başvurdum, dosyam hâlâ belediyede bekliyor. Annem bekleyemezdi.',
            },
        ],
    },

    examLeak: {
        name: 'Sınav Sorusu Sızdırma',
        severity: 3,
        laws: {
            base: { verdict: 'jail-short', text: 'resmi sınav sorularını sızdırma' },
            sold: { verdict: 'jail-medium', text: 'Soruları para karşılığı geniş çapta satma' },
            buyer: { verdict: 'fine-moderate', text: 'Sızdırılmış soruları satın alıp kullanan aday' },
        },
        statements: [
            {
                text: 'Soruları basan matbaada çalışıyordum. Bir fotoğraf çektim, o kadar.', emotion: 'panicked', sympathy: false, law: 'base',
                detail: 'Matbaa işçisi',
                summary: 'Üniversite sınavının sorularını basan matbaada çalışırken soruların fotoğrafını çekip yeğenine gönderdi.',
                evidence: ['Fotoğraflar sanığın telefonundan sınavdan iki gün önce gönderilmiş.', 'Yeğeni dışında kimseye ulaştığına dair kanıt yok.'],
                question: 'Fotoğrafı kime gönderdin?', answer: 'Sadece yeğenime. Doktor olmak istiyordu.',
            },
            {
                text: 'Talep vardı, ben de arz ettim. Serbest piyasa.', emotion: 'proud', sympathy: false, law: 'sold',
                detail: 'Soru şebekesi',
                summary: 'Memurluk sınavının sorularını ele geçirip 400 adaya kişi başı ₺50.000\'e sattı.',
                evidence: ['Satış listesinde 400 aday adı ve ödemeler var.', 'Sınav iptal edildi; 1 milyon aday yeniden sınava girecek.'],
                question: 'Soruları kimden aldın?', answer: 'Kurumda dostlarım var. İsim vermem.',
            },
            {
                text: 'Herkes alıyordu, ben almasam kaybedecektim!', emotion: 'remorseful', sympathy: true, law: 'buyer', age: 22,
                detail: 'Soruları alan aday',
                summary: 'Memurluk sınavından önce sızdırılmış soruları ₺50.000\'e satın alıp sınava girdi.',
                evidence: ['Ödeme dekontu ve soruların bulunduğu dosya telefonunda.', 'Parayı ailesi tarlasını satarak bulmuş.'],
                question: 'Parayı nereden buldun?', answer: 'Babam tarlayı sattı. Şimdi ne tarla var ne iş.',
            },
            {
                text: 'Öğrencilerime yardım etmek istedim. Sınav zaten adaletsiz.', emotion: 'defiant', sympathy: true, law: 'base',
                detail: 'Öğretmen',
                summary: 'Lise öğretmeniyken, gözetmenlik yaptığı ulusal sınavın sorularını sınav başlamadan kendi öğrencilerine iletti.',
                evidence: ['Soruların sınavdan 20 dakika önce bir mesaj grubunda paylaşıldığı tespit edildi.', 'Para almamış; grup sadece kendi öğrencilerinden oluşuyor.'],
                question: 'Karşılığında bir şey aldın mı?', answer: 'Hiçbir şey. Köy okulunun çocukları şehirdekilerle yarışamıyor.',
            },
            {
                text: 'Sınav uygulamasının açığını buldum, satmadım ki!', emotion: 'panicked', sympathy: true, law: 'base', age: 19,
                detail: 'Genç yazılımcı',
                summary: 'Çevrimiçi sınav sisteminin güvenlik açığını kullanarak soruları indirdi ve arkadaşlarıyla paylaştı.',
                evidence: ['Sorular 15 kişilik bir arkadaş grubunda paylaşılmış.', 'Sanık açığı daha önce kuruma bildirmiş ama cevap alamamış.'],
                question: 'Açığı kuruma bildirdin mi?', answer: 'Bildirdim! Kimse cevap vermedi. Kanıtlamak istedim.',
            },
            {
                text: 'Ben kurumun müdürüyüm, soruları güvenli yere taşıyordum.', emotion: 'defiant', sympathy: false, law: 'sold',
                detail: 'Sınav müdürü',
                summary: 'Sınav kurumunun il müdürüyken soru kitapçıklarını bir dershane zincirine sattı.',
                evidence: ['Dershane sahibinden müdürün eşinin hesabına ₺8.000.000 yatırılmış.', 'Dershanenin öğrencileri o yıl ülke birincisi oldu.'],
                question: 'Dershaneyle ne ilişkin var?', answer: 'Eşimin danışmanlık yaptığı bir yer. Tesadüf.',
            },
        ],
    },

    gambling: {
        name: 'Yasa Dışı Bahis',
        severity: 2,
        laws: {
            base: { verdict: 'fine-major', text: 'yasa dışı bahis veya kumar oynatma' },
            player: { verdict: 'fine-minor', text: 'Yalnızca oynayan kişi' },
            minors: { verdict: 'jail-short', text: 'Çocuklara kumar oynatma veya bahis sitesine çekme' },
        },
        statements: [
            {
                text: 'Kahvede okey oynatıyordum. Biraz para dönüyordu, o kadar.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Kahvehane kumarı',
                summary: 'İşlettiği kahvehanenin arka odasında para karşılığı kumar oynattı.',
                evidence: ['Baskında masada ₺120.000 nakit bulundu.', 'Kahvehane her eldeki paradan %10 pay alıyormuş.'],
                question: 'Paydan ne kadar kazanıyordun?', answer: 'Kira çıkıyordu işte. Herkes yapıyor.',
            },
            {
                text: 'Maaşımı bahiste kaybettim. Beni yargılamayın, yardım edin.', emotion: 'remorseful', sympathy: true, law: 'player',
                detail: 'Bahis bağımlısı',
                summary: 'Yasa dışı bir bahis sitesinde oynarken yapılan operasyonda yakalandı. Bir yılda ₺400.000 kaybetmiş.',
                evidence: ['Sadece oyuncu olduğu, siteyle başka bağı olmadığı tespit edildi.', 'Bağımlılık tedavisine başvurusu var.'],
                question: 'Tedaviye neden başvurdun?', answer: 'Eşim çocukları alıp gitti. Dibe vurdum.',
            },
            {
                text: 'Okul çıkışı gençlere bahis kodu dağıttım, ne olmuş?', emotion: 'proud', sympathy: false, law: 'minors',
                detail: 'Okul önü kodları',
                summary: 'Bir bahis sitesi adına lise öğrencilerine "ilk bahis bedava" kodları dağıttı.',
                evidence: ['Siteye üye olan 200 öğrenci tespit edildi.', 'Sanık her yeni üye için komisyon almış.'],
                question: 'Öğrencilerin yaşını sordun mu?', answer: 'Sormadım. Para kazanan herkes yetişkindir.',
            },
            {
                text: 'Sitenin sadece yazılımını yaptım. Kim nasıl kullandı bilmem.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Site yazılımcısı',
                summary: 'Yasa dışı bir bahis sitesinin yazılımını geliştirip her ay sitenin kazancından pay aldı.',
                evidence: ['Sözleşmesinde "kazancın %5\'i" yazıyor.', 'Siteye erişim engeli konunca adresi o değiştirmiş.'],
                question: 'Erişim engelini kim aşıyordu?', answer: 'Ben. Müşteri memnuniyeti önemlidir.',
            },
            {
                text: 'Sadece maçlara iddiaya girdik, arkadaş arasında!', emotion: 'panicked', sympathy: true, law: 'player', tags: ['minor'], age: 16,
                detail: 'Arkadaş bahsi',
                summary: 'Okul arkadaşlarıyla birlikte bir yasa dışı bahis sitesinde oynarken yakalandı.',
                evidence: ['Toplam ₺3.000 oynamış; parayı annesinin kartından almış.', 'Siteye okul önünde dağıtılan bir kodla üye olmuş.'],
                question: 'Parayı nereden buldun?', answer: 'Annemin kartından... Kazanınca geri koyacaktım.',
            },
            {
                text: 'Maçı ben satmadım, sadece sonucu bildim.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Şike bahsi',
                summary: 'Amatör lig maçlarının sonuçlarını önceden ayarlayıp bu maçlara yüksek bahis oynattı.',
                evidence: ['İki hakem ve dört oyuncu para aldıklarını itiraf etti.', 'Bahis kazançları sanığın hesabına aktarılmış.'],
                question: 'Hakemlere para verdin mi?', answer: 'Hediye verdim. Futbol bir aile meselesi.',
            },
        ],
    },

    organTrafficking: {
        name: 'Organ Ticareti',
        severity: 5,
        laws: {
            base: { verdict: 'jail-long', text: 'para karşılığı organ alıp satma veya aracılık' },
            fatal: { verdict: 'death', text: 'Organı alınan kişinin ölümüne yol açmışsa' },
            seller: { verdict: 'house-arrest', text: 'Yoksulluk yüzünden kendi organını satan kişi' },
        },
        statements: [
            {
                text: 'Ben sadece insanları buluşturdum. Hasta da memnun, satan da.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Aracı',
                summary: 'Böbrek arayan zengin hastalarla parasız göçmenleri buluşturup her nakilden pay aldı.',
                evidence: ['Defterinde 30 nakil ve aldığı komisyonlar yazılı.', 'Böbrek veren göçmenlere vaat edilen paranın yarısı ödenmiş.'],
                question: 'Böbrek verenlere ne kadar ödendi?', answer: 'Söz verilenin yarısı. Gerisi masraftı.',
            },
            {
                text: 'Ameliyat başarılıydı! Sonra ne olduğu benim sorumluluğum değil.', emotion: 'defiant', sympathy: false, law: 'fatal',
                detail: 'Gizli klinik',
                summary: 'Ruhsatsız bir klinikte böbreği alınan genç bir göçmen, bakımsız bırakıldığı için enfeksiyondan öldü.',
                evidence: ['Klinikte steril ortam ve yoğun bakım yok.', 'Gencin ameliyattan sonra 2 gün bir depoda bırakıldığı tespit edildi.'],
                question: 'Ameliyattan sonra ona kim baktı?', answer: 'Kimse. Ertesi gün gidecekti zaten.',
            },
            {
                text: 'Çocuğumun ameliyatı için böbreğimi sattım. Pişman değilim.', emotion: 'remorseful', sympathy: true, law: 'seller',
                detail: 'Böbreğini satan',
                summary: 'Kızının kalp ameliyatı parasını bulmak için kendi böbreğini bir aracı üzerinden sattı.',
                evidence: ['Aldığı paranın tamamını hastaneye yatırdığı makbuzlarla doğrulandı.', 'Aracıyı polise kendisi ihbar etti.'],
                question: 'Aracıyı neden ihbar ettin?', answer: 'Benden sonra başkalarına da aynısını yapmasın diye.',
            },
            {
                text: 'Ben doktorum, hayat kurtarıyorum. Organ nereden geldi beni ilgilendirmez.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Nakil cerrahı',
                summary: 'Özel hastanesinde, kaynağı belirsiz organlarla parası çok olan hastalara nakil yaptı.',
                evidence: ['25 nakilde organ bağışçısının kimliği sahte.', 'Her nakil için ₺2.000.000 alınmış.'],
                question: 'Bağışçıları hiç gördün mü?', answer: 'Gördüm. Sormadım. Sorsaydım ameliyat yapamazdım.',
            },
            {
                text: 'Yetimhaneden çocuk getirmedim! Onlar gönüllüydü!', emotion: 'panicked', sympathy: false, law: 'fatal',
                detail: 'Kaybolan gençler',
                summary: 'Kimsesiz gençlere iş vaadiyle yurt dışına götürüp organlarını aldıran bir şebekenin elebaşı.',
                evidence: ['Götürülen 8 gençten 2\'sinin cesedi bulundu; organları alınmış.', 'Gençlere imzalatılan "gönüllülük" belgeleri sahte.'],
                question: 'Gençlere ne söylediniz?', answer: 'Otel işi... Orada iş vardı gerçekten.',
            },
            {
                text: 'Kardeşim için yaptım. Başka donör bulamadık.', emotion: 'remorseful', sympathy: true, law: 'base',
                detail: 'Kardeş için',
                summary: 'Böbrek yetmezliği olan kardeşi için bir yabancıya para verip böbreğini satın aldı.',
                evidence: ['Satıcıya ₺300.000 ödenmiş; satıcı sağlıklı.', 'Sanık başka bir organ ticaretine karışmamış.'],
                question: 'Satıcıyla nasıl tanıştın?', answer: 'Hastane bahçesinde bir adam yaklaştı. Çaresizdim.',
            },
        ],
    },

    poaching: {
        name: 'Kaçak Avcılık',
        severity: 2,
        laws: {
            base: { verdict: 'fine-moderate', text: 'yasak bölgede veya yasak zamanda avlanma' },
            endangered: { verdict: 'jail-short', text: 'Nesli tükenmekte olan bir türü avlama' },
            subsistence: { verdict: 'fine-minor', text: 'Geçim için küçük çapta, ilk kez' },
        },
        statements: [
            {
                text: 'Ayı köyün arılarına saldırıyordu. Vurmak zorundaydım.', emotion: 'defiant', sympathy: true, law: 'endangered',
                detail: 'Boz ayı',
                summary: 'Arı kovanlarına zarar veren koruma altındaki bir boz ayıyı tüfekle vurdu.',
                evidence: ['Boz ayı koruma altında; ayı ölü bulundu.', 'Köylüler zararı defalarca bildirdiğini ama tazminat alamadığını söylüyor.'],
                question: 'Zararı devlete bildirdin mi?', answer: 'Üç kez. Gelen giden olmadı. Kovanlar benim ekmeğimdi.',
            },
            {
                text: 'Avcılık atalarımızdan kalma. Yasakları şehirliler koyuyor.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Üreme mevsimi',
                summary: 'Avın yasak olduğu üreme mevsiminde yaban keçisi avlarken yakalandı.',
                evidence: ['Aracında iki yaban keçisi bulundu.', 'Av ruhsatı var ama mevsim yasağını bildiği kayıtlı.'],
                question: 'Yasağı biliyor muydun?', answer: 'Biliyordum. Ama et tüccarı acele ediyordu.',
            },
            {
                text: 'Göldeki balıklar çocuklarımın yemeği. Ağ atmasam aç kalırlar.', emotion: 'remorseful', sympathy: true, law: 'subsistence',
                detail: 'Göl balıkçısı',
                summary: 'Avlanma yasağı olan dönemde gölde ağla balık tutarken yakalandı.',
                evidence: ['Ağda 6 kilo balık vardı; satış izi yok.', 'Daha önce hiç ceza almamış.'],
                question: 'Balıkları satıyor muydun?', answer: 'Hayır. Ancak evdekilere yetiyor.',
            },
            {
                text: 'Kuşları kafeste satıyorum, öldürmüyorum ki!', emotion: 'defiant', sympathy: false, law: 'endangered',
                detail: 'Kaçak kuş',
                summary: 'Nesli tükenmekte olan saka kuşlarını ve doğanları yakalayıp internetten sattı.',
                evidence: ['Evinde 40 yabani kuş ele geçirildi; çoğu nesli tehlikede.', 'Kuşların yarısı nakil sırasında ölmüş.'],
                question: 'Kuşları nereden buluyordun?', answer: 'Ağ kuruyorum. Doğada nasılsa bol.',
            },
            {
                text: 'Sadece bir tavşan vurdum, ilk kez ava çıkmıştım.', emotion: 'panicked', sympathy: true, law: 'subsistence', tags: ['minor'], age: 17,
                detail: 'İlk av',
                summary: 'Dedesinin tüfeğiyle yasak bölgede avlanırken yakalandı.',
                evidence: ['Tek bir tavşan vurmuş; tüfek dedesine ait ve ruhsatlı.', 'Dedesi de yanındaydı ve sorumluluğu üstleniyor.'],
                question: 'Burada avın yasak olduğunu biliyor muydun?', answer: 'Hayır. Dedem "burası hep bizim avımızdı" dedi.',
            },
            {
                text: 'Fildişi değil, eski bir biblo. Dedemden kaldı.', emotion: 'proud', sympathy: false, law: 'endangered',
                detail: 'Kaplumbağa kabukları',
                summary: 'Deniz kaplumbağalarının kabuklarından yapılmış süs eşyalarını turistlere sattı.',
                evidence: ['Dükkanda 200 kaplumbağa kabuğu eşya bulundu; kabukların yeni olduğu bilirkişi raporuyla kesin.', 'Kumsaldaki yuvalardan yumurta topladığı kamerada görülüyor.'],
                question: 'Kabukları kim getiriyordu?', answer: 'Balıkçılar getiriyor, ben alıyorum. Ticaret işte.',
            },
        ],
    },

    loanShark: {
        name: 'Tefecilik',
        severity: 3,
        laws: {
            base: { verdict: 'jail-short', text: 'yüksek faizle borç verip senetle tehdit etme' },
            violence: { verdict: 'jail-medium', text: 'Borcu tahsil için şiddet kullanmışsa' },
            small: { verdict: 'fine-moderate', text: 'Küçük miktar, tehdit veya şiddet yok' },
        },
        statements: [
            {
                text: 'Bankalar vermedi, ben verdim. Faizi de piyasa belirler.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Aylık yüzde 20',
                summary: 'Esnafa aylık %20 faizle borç verip boş senet imzalattı; ödeyemeyenlerin dükkanlarına el koydu.',
                evidence: ['Elinde 40 esnafa ait boş imzalı senet bulundu.', 'Üç esnafın dükkanı senetlerle sanığın üzerine geçirilmiş.'],
                question: 'Senetleri neden boş imzalattın?', answer: 'Rakamı sonra yazarız. Güven işi.',
            },
            {
                text: 'Borcunu ödemeyeni uyardım, biraz sert oldu.', emotion: 'defiant', sympathy: false, law: 'violence',
                detail: 'Kırılan diz',
                summary: 'Faizli borcunu ödeyemeyen bir taksicinin dizini adamlarına sopayla kırdırdı.',
                evidence: ['Taksici kalıcı olarak topal kaldı.', 'Saldırganlar sanığın talimat verdiğini ifade etti.'],
                question: 'Adamlarına ne söyledin?', answer: '"Akıllansın" dedim. Akıllandı da.',
            },
            {
                text: 'Komşuma borç verdim, biraz faiz istedim. Suç mu?', emotion: 'panicked', sympathy: true, law: 'small',
                detail: 'Komşu borcu',
                summary: 'Emekli maaşıyla geçinen sanık, komşusuna ₺5.000 borç verip aylık faiz aldı.',
                evidence: ['Toplam aldığı faiz ₺1.500.', 'Tehdit veya senet yok; komşu şikayetini geri çekmek istiyor.'],
                question: 'Başka kime borç verdin?', answer: 'Kimseye. Emekli maaşım zaten yetmiyor.',
            },
            {
                text: 'Kumarhanede herkese borç verilir. Ben de verdim.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Kumarhane tefecisi',
                summary: 'Yasa dışı kumar masalarında kaybedenlere anında yüksek faizle borç verip tapularını rehin aldı.',
                evidence: ['Kasasında 12 tapunun aslı bulundu.', 'Faiz oranı haftalık %10.'],
                question: 'Tapular neden sende?', answer: 'Teminat. Kimse kaçmasın diye.',
            },
            {
                text: 'Ailemin önünde rezil etti beni! Ben de evini yaktım.', emotion: 'proud', sympathy: false, law: 'violence',
                detail: 'Yakılan ev',
                summary: 'Faizli borcunu ödemeyen bir ailenin evine, aile dışarıdayken benzin dökerek ateş verdi.',
                evidence: ['Evden geriye bir şey kalmadı; aile o gece dışarıdaydı.', 'Kamerada benzin bidonuyla eve girerken görülüyor.'],
                question: 'Evde kimse olmadığını biliyor muydun?', answer: 'Biliyordum. Ders vermek istedim, öldürmek değil.',
            },
            {
                text: 'Çiftçilere tohum parası veriyordum. Hasat olunca alıyordum.', emotion: 'remorseful', sympathy: false, law: 'base',
                detail: 'Köy tefecisi',
                summary: 'Köydeki çiftçilere hasat karşılığı borç verip, ödeyemeyenlerin tarlalarını senetlerle aldı.',
                evidence: ['Son iki yılda 9 çiftçinin tarlası sanığa geçmiş.', 'Borç sözleşmelerindeki faiz yıllık %150.'],
                question: 'Tarlaları ne yaptın?', answer: 'Ekiyorum. Eski sahipleri de bana yevmiyeyle çalışıyor.',
            },
        ],
    },

    foodFraud: {
        name: 'Gıda Hilesi',
        severity: 3,
        laws: {
            base: { verdict: 'fine-major', text: 'hileli veya sahte gıda üretip satma' },
            poisoning: { verdict: 'jail-medium', text: 'Hileli gıda zehirlenmeye yol açmışsa' },
            labeling: { verdict: 'fine-minor', text: 'Küçük esnafın etiket hatası, sağlığa zararsız' },
        },
        statements: [
            {
                text: 'Bal biraz şekerliydi, kimse ölmedi.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Sahte bal',
                summary: 'Glikoz şurubuyla ürettiği sahte balı "süzme köy balı" diye marketlere sattı.',
                evidence: ['Laboratuvar: ürünlerde %70 glikoz şurubu.', '5 ton sahte bal ele geçirildi.'],
                question: 'Etikette neden "köy balı" yazıyor?', answer: '"Şeker şurubu" yazsam kim alır?',
            },
            {
                text: 'Etler biraz eskiydi, baharatla kapattık.', emotion: 'panicked', sympathy: false, law: 'poisoning',
                detail: 'Bozuk et',
                summary: 'Restoranında son kullanma tarihi geçmiş etleri döner olarak sattı; 30 kişi zehirlendi.',
                evidence: ['Depoda tarihi iki ay geçmiş etler bulundu.', 'Zehirlenenlerden 4\'ü yoğun bakıma alındı.'],
                question: 'Etler ne zamandır depodaydı?', answer: 'Bir süredir... Atmaya kıyamadım.',
            },
            {
                text: 'Etikete "organik" yazmışım ama domatesler gerçekten bahçemden.', emotion: 'remorseful', sympathy: true, law: 'labeling',
                detail: 'Pazar tezgahı',
                summary: 'Pazarda sattığı domateslere sertifikasız olarak "organik" etiketi yapıştırdı.',
                evidence: ['Domateslerde ilaç kalıntısı bulunmadı; sağlığa zararsız.', 'Sertifika almadan etiket kullandığı için şikayet edilmiş.'],
                question: 'Sertifikan var mı?', answer: 'Yok. Pahalı. Ama bahçeme ilaç atmıyorum, gelin bakın.',
            },
            {
                text: 'Zeytinyağına biraz ayçiçek kattım, renk tuttu.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Karışık zeytinyağı',
                summary: 'Ayçiçek yağını boyayıp "sızma zeytinyağı" diye şişeleyip sattı.',
                evidence: ['Şişelerde zeytinyağı oranı %10 bile değil.', 'Kullanılan boya gıdaya uygun değil.'],
                question: 'Boyayı nereden aldın?', answer: 'Hırdavatçıdan. Renk iyi tutuyor.',
            },
            {
                text: 'Peynirdeki o madde süt verimini artırıyordu sadece.', emotion: 'defiant', sympathy: false, law: 'poisoning',
                detail: 'Çocuk mamasında',
                summary: 'Süt fabrikasında protein oranı yüksek görünsün diye süte zehirli bir kimyasal kattı; mama içen bebekler hastanelik oldu.',
                evidence: ['12 bebek böbrek sorunu yüzünden hastanede tedavi gördü.', 'Kimyasalın üretim hattına müdürün talimatıyla eklendiği belgelendi.'],
                question: 'Talimatı kim verdi?', answer: 'Ben. Rakipler yapıyordu, geride kalamazdık.',
            },
            {
                text: 'Ekmeğe biraz fazla tuz koymuşum, kasıtlı değil.', emotion: 'panicked', sympathy: true, law: 'labeling',
                detail: 'Mahalle fırını',
                summary: 'Fırınının ekmeklerinde gramaj ve tuz oranı etiketle uyuşmadı.',
                evidence: ['Ekmekler 20 gram eksik çıktı; tuz oranı sınırın biraz üstünde ama sağlığa zararlı değil.', 'Fırın 30 yıldır hiç ceza almamış.'],
                question: 'Gramaj neden eksik?', answer: 'Yeni çırak terazi ayarını bozmuş. Hemen düzelttim.',
            },
        ],
    },

    // ---- Added crimes ----
    sexualAssault: {
        name: 'Cinsel Saldırı',
        severity: 5,
        laws: {
            base: { verdict: 'jail-long', text: 'rızası olmadan cinsel ilişki (tecavüz)' },
            aggravated: { verdict: 'death', text: 'Silahla veya birden fazla kişiyle işlenmişse' },
            attempt: { verdict: 'jail-medium', text: 'Saldırı tamamlanmadan durdurulmuş, teşebbüste kalmışsa' },
        },
        statements: [
            {
                text: 'O da istiyordu. Sonradan pişman oldu, suç bana kaldı.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Parti dönüşü', gender: 'm',
                summary: 'Bir parti dönüşü evine bıraktığı tanıdığına, rızası olmadan cinsel saldırıda bulundu.',
                evidence: ['Adli tıp raporu cinsel saldırıyı ve direnme izlerini doğruluyor.', 'Mağdur o gece arkadaşına "bırakmıyor" diye mesaj atmış.'],
                question: 'Mağdurun mesajına ne diyorsun?', answer: 'Şaka yapıyordu. Herkes abartıyor.',
            },
            {
                text: 'Bıçağı sadece korksun diye çıkardım. Kullanmadım ki.', emotion: 'panicked', sympathy: false, law: 'aggravated',
                detail: 'Bıçak tehdidi', gender: 'm',
                summary: 'Gece otoparkta bir kadını bıçakla tehdit ederek arabasına zorla bindirdi ve cinsel saldırıda bulundu.',
                evidence: ['Adli tıp raporu saldırıyı doğruluyor; mağdurun boynunda bıçak çizikleri var.', 'Bıçak sanığın arabasında, üzerinde mağdurun kanıyla bulundu.'],
                question: 'Bıçak neden yanındaydı?', answer: 'Hep yanımda taşırım. Ama kimseyi kesmedim.',
            },
            {
                text: 'Sarhoştum, ne yaptığımı bilmiyordum. Çok özür dilerim.', emotion: 'remorseful', sympathy: false, law: 'attempt', tags: ['alcohol'],
                detail: 'Merdiven boşluğu', gender: 'm',
                summary: 'Alkollüyken apartman merdiveninde komşusuna saldırdı; bağırışları duyan başka bir komşu araya girip durdurdu.',
                evidence: ['Olay anında kandaki alkol: 1,8 promil.', 'Tanık komşu, saldırının tamamlanmadan durdurulduğunu söylüyor.'],
                question: 'Komşun gelmeseydi ne olacaktı?', answer: 'Bilmiyorum... Düşünmek bile istemiyorum.',
            },
            {
                text: 'Patronuyum, bana hayır diyemezdi zaten. Ses çıkarmadı.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'İş yeri', gender: 'm',
                summary: 'Mesai sonrası ofiste yalnız kaldığı çalışanına rızası olmadan cinsel saldırıda bulundu.',
                evidence: ['Adli tıp raporu ve ofis kamerası saldırıyı doğruluyor.', 'Çalışan ertesi gün istifa edip doğrudan savcılığa başvurdu.'],
                question: 'Sessiz kalmak rıza mı demek?', answer: 'Benim dünyamda öyle. Hayır deseydi.',
            },
            {
                text: 'O gece evdeydim! Yemin ederim, ben değilim.', emotion: 'panicked', sympathy: true, law: 'innocent',
                detail: 'Yanlış teşhis', gender: 'm',
                summary: 'Parkta gece yaşanan bir cinsel saldırıda, mağdurun karanlıkta tarif ettiği kişiye benzediği için gözaltına alındı.',
                evidence: ['Mağdur sanığı fotoğraftan "benziyor" diyerek gösterdi.', 'Sanığın o gece evde olduğunu yalnızca annesi doğruluyor.'],
                question: 'O gece neredeydin?', answer: 'Evde, annemle dizi izliyordum. Kimse inanmıyor.',
                delayed: {
                    note: 'Adli tıp DNA raporu bekleniyor',
                    evidence: 'Rapor: olay yerindeki DNA sanığa ait değil; başka bir sabıkalıyla eşleşti.',
                },
            },
        ],
    },

    sexualHarassment: {
        name: 'Cinsel Taciz',
        severity: 3,
        laws: {
            base: { verdict: 'house-arrest', text: 'sözle, mesajla veya dokunarak cinsel taciz' },
            authority: { verdict: 'jail-short', text: 'Mağdur üzerindeki yetkisini kötüye kullanmışsa veya uyarıya rağmen sürdürmüşse' },
            once: { verdict: 'fine-major', text: 'Tek seferlik sözlü taciz ise ve temas yoksa' },
        },
        statements: [
            {
                text: 'Laf attım, o kadar. Sokakta herkes yapıyor.', emotion: 'defiant', sympathy: false, law: 'once',
                detail: 'Sokakta laf',
                summary: 'Otobüs durağında bekleyen bir kadına müstehcen sözler söyledi. Kadın telefonla kaydetti.',
                evidence: ['Video kaydında müstehcen sözler açıkça duyuluyor.', 'Temas yok; sanığın daha önce şikayet kaydı yok.'],
                question: 'Ona dokundun mu?', answer: 'Hayır! Sadece laf attım, iltifattı yani.',
            },
            {
                text: 'Terfisini ben verdim. Biraz ilgi beklemek suç mu?', emotion: 'proud', sympathy: false, law: 'authority',
                detail: 'Müdür',
                summary: 'Şirket müdürüyken ekibindeki bir çalışana aylarca cinsel imalı mesajlar attı, terfiyi buna bağladı.',
                evidence: ['Altı aylık mesajlarda terfi ile "yakınlık" açıkça ilişkilendirilmiş.', 'Aynı müdür hakkında iki çalışan daha şikayetçi.'],
                question: 'Terfiyi neye bağladın?', answer: 'Sadakate. Bunu herkes anlar.',
            },
            {
                text: 'Kalabalıktı, istemeden değdi. Yanlış anlaşıldım.', emotion: 'panicked', sympathy: false, law: 'base',
                detail: 'Metrobüs',
                summary: 'Kalabalık metrobüste yanındaki yolcuya bilerek dokunduğu, yolcuların müdahalesiyle ortaya çıktı.',
                evidence: ['Araç kamerasında sanığın elini bilerek uzattığı görülüyor.', 'İlk kez şikayet ediliyor.'],
                question: 'Kamerada ne görülüyor?', answer: '...Elim gitti. Bir anlık şeydi.',
            },
            {
                text: 'Notunu ben veririm. O da biliyordu bunu.', emotion: 'defiant', sympathy: false, law: 'authority',
                detail: 'Hoca',
                summary: 'Üniversitede ders verdiği bir öğrencisine geceleri cinsel imalı mesajlar attı, sınav notunu ima etti.',
                evidence: ['Mesajlarda "notun bana bağlı" ifadesi geçiyor.', 'Bölüm daha önce aynı hoca hakkında uyarı vermiş.'],
                question: 'Uyarıdan sonra neden devam ettin?', answer: 'Uyarı dediğin kâğıt. Kimse bir şey yapmadı.',
            },
            {
                text: 'Sadece fotoğraf attım. Engelleyebilirdi.', emotion: 'remorseful', sympathy: false, law: 'base',
                detail: 'İnternet mesajı',
                summary: 'Sosyal medyada tanımadığı birine müstehcen fotoğraf ve mesajlar gönderdi.',
                evidence: ['Bir hafta içinde 15 müstehcen mesaj gönderilmiş.', 'Mağdur engelleyince sanık yeni hesap açıp yazmaya devam etmemiş.'],
                question: 'Neden yazdın?', answer: 'Aptallık. Ekran arkasında gerçek değil sandım.',
            },
        ],
    },

    threat: {
        name: 'Tehdit',
        severity: 2,
        laws: {
            base: { verdict: 'fine-major', text: 'birini zarar vermekle tehdit etme' },
            weapon: { verdict: 'jail-short', text: 'Silah gösterilmiş veya hayata kast edilmekle tehdit edilmişse' },
            quarrel: { verdict: 'fine-minor', text: 'Kavga anında söylenmiş, tekrarlanmamış ve özür dilenmişse' },
        },
        statements: [
            {
                text: 'Sinirle ağzımdan kaçtı. Ertesi gün özür diledim.', emotion: 'remorseful', sympathy: true, law: 'quarrel',
                detail: 'Otopark kavgası',
                summary: 'Otopark yeri yüzünden çıkan tartışmada karşısındakine "seni pişman ederim" dedi.',
                evidence: ['Tanıklar sözlerin tartışma sırasında bağırarak söylendiğini doğruluyor.', 'Ertesi gün mağdurdan özür dilemiş; başka mesaj yok.'],
                question: 'Sonra ne yaptın?', answer: 'Kapısını çalıp özür diledim. Elini sıktı.',
            },
            {
                text: 'Borcunu ödemezse arabasını yakarım dedim. Hâlâ öyle.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Borç',
                summary: 'Borcunu ödemeyen eski ortağına mesajla arabasını yakacağını yazdı.',
                evidence: ['Üç gün içinde gönderilmiş beş tehdit mesajı var.', 'Silah ya da hayata yönelik tehdit yok; mağdur korktuğu için şikayetçi.'],
                question: 'Gerçekten yakacak mıydın?', answer: 'Korksun diye yazdım. Ama parasını da istiyorum.',
            },
            {
                text: 'Tabancayı göstermek tehdit değil. Kendimi koruyordum.', emotion: 'proud', sympathy: false, law: 'weapon',
                detail: 'Tabanca',
                summary: 'Arazi sınırı yüzünden tartıştığı komşusuna belindeki tabancayı göstererek "bir daha gelirsen yaşamazsın" dedi.',
                evidence: ['İki tanık tabancanın gösterildiğini doğruluyor.', 'Tabanca ruhsatsız; komşu o günden beri tarlasına gidemiyor.'],
                question: 'Komşun sana saldırdı mı?', answer: 'Hayır. Ama saldırabilirdi, önce ben davrandım.',
            },
            {
                text: 'Sadece yorum yazdım. İnternette herkes böyle konuşuyor.', emotion: 'panicked', sympathy: false, law: 'weapon',
                detail: 'Ölüm tehdidi',
                summary: 'Yerel bir gazeteciye sosyal medyadan "seni evinin önünde vuracağız" diye mesaj attı.',
                evidence: ['Mesajda gazetecinin ev adresi de yazılı.', 'Sanığın telefonunda gazetecinin evinin fotoğrafları bulundu.'],
                question: 'Adresini nereden buldun?', answer: 'Biri paylaşmıştı... Fotoğrafları da öyle çektim, geçerken.',
            },
            {
                text: 'Tartışmada bağırdım, evet. Ama o da bana bağırdı.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Kiracı',
                summary: 'Kirasını artıran ev sahibine kapıda "başına iş açarım" diye bağırdı, ertesi hafta aynı sözleri mesajla yineledi.',
                evidence: ['Kapıdaki tartışma tanıklarla doğrulanıyor.', 'Bir hafta sonra aynı tehdidi mesajla tekrarlamış; özür yok.'],
                question: 'Özür diledin mi?', answer: 'Neden dileyeyim? Kirayı o artırdı.',
            },
        ],
    },

    trespass: {
        name: 'Konut Dokunulmazlığını İhlal',
        severity: 2,
        laws: {
            base: { verdict: 'fine-moderate', text: 'izinsiz başkasının konutuna girme' },
            forced: { verdict: 'house-arrest', text: 'Gece vakti veya kapı, pencere zorlanarak girilmişse' },
            rescue: { verdict: 'release', text: 'Birini kurtarmak için acil durumda girilmişse' },
        },
        statements: [
            {
                text: 'Kapı açıktı, kedimi arıyordum. Hemen çıktım.', emotion: 'panicked', sympathy: true, law: 'base',
                detail: 'Komşunun evi',
                summary: 'Kaybolan kedisini ararken komşusunun açık kapısından izinsiz içeri girdi.',
                evidence: ['Ev sahibi onu salonda bulup polisi aradı.', 'Evden hiçbir şey alınmamış; kapı zorlanmamış.'],
                question: 'Neden izin istemedin?', answer: 'Kimse yoktu. Kedim içeri kaçtı sandım.',
            },
            {
                text: 'Dumanı görünce düşünmedim. Camı kırıp içeri girdim.', emotion: 'proud', sympathy: true, law: 'rescue',
                detail: 'Yangın',
                summary: 'Komşu dairesinden duman geldiğini görünce camı kırarak içeri girdi, baygın yaşlı adamı dışarı taşıdı.',
                evidence: ['İtfaiye raporu dairede mutfak yangını çıktığını doğruluyor.', 'Yaşlı adam hastanede kurtarıldı; ev sahibi tazminat istiyor.'],
                question: 'İtfaiyeyi neden beklemedin?', answer: 'Beklesem adam ölürdü. Cam yenisini alır.',
            },
            {
                text: 'Eşimi görmeye gittim. O ev benim de evimdi.', emotion: 'defiant', sympathy: false, law: 'forced',
                detail: 'Eski ev',
                summary: 'Boşanma aşamasındaki eşinin evine gece yarısı kilidi kırarak girdi.',
                evidence: ['Kilitte zorlama izleri var; olay saati 02.30.', 'Ev tapuda yalnızca eşinin adına kayıtlı.'],
                question: 'Kilidi neden kırdın?', answer: 'Anahtarı değiştirmiş. Konuşmam lazımdı.',
            },
            {
                text: 'Burası zaten boştu sandım. Sadece fotoğraf çekecektim.', emotion: 'remorseful', sympathy: false, law: 'base',
                detail: 'Terk edilmiş ev',
                summary: 'Sosyal medya için terk edilmiş sandığı bir köşke gündüz izinsiz girdi; içeride yaşlı ev sahibi vardı.',
                evidence: ['Bahçe kapısı açıktı; zorlama yok.', 'Video kaydında sanığın "kimse yok" diyerek içeri girdiği görülüyor.'],
                question: 'Ev sahibini görünce ne yaptın?', answer: 'Özür dileyip çıktım. Çok korkmuştu.',
            },
            {
                text: 'İçeride ne var diye merak ettim. Bir şey almadım.', emotion: 'defiant', sympathy: false, law: 'forced',
                detail: 'Gece ziyareti',
                summary: 'Gece yarısı tanımadığı bir eve arka pencereden girerken ev sahibi tarafından yakalandı.',
                evidence: ['Pencere tornavidayla zorlanmış.', 'Üzerinden çalınmış bir eşya çıkmadı; olay saati 03.00.'],
                question: 'Gece o pencerede ne arıyordun?', answer: 'Merak. Bir şey almadım, yazın bunu.',
            },
        ],
    },

    embezzlement: {
        name: 'Zimmet',
        severity: 4,
        laws: {
            base: { verdict: 'jail-medium', text: 'görevi gereği elindeki kamu parasını kendine geçirme' },
            small: { verdict: 'house-arrest', text: 'Zimmete geçirilen miktar küçükse' },
            organised: { verdict: 'jail-long', text: 'Çok büyük miktarda veya başkalarıyla örgütlü şekilde işlenmişse' },
        },
        statements: [
            {
                text: 'Borcum vardı, adamlar kapıma dayanmıştı. Ödeyecektim.', emotion: 'remorseful', sympathy: false, law: 'base',
                detail: 'Belediye veznesi',
                summary: 'Belediye veznedarıyken iki yıl boyunca tahsil ettiği su ve emlak vergisi paralarının bir kısmını kasaya koymadı.',
                evidence: ['Kasa açığı: ₺420.000.', 'Paranın kumar sitelerine yatırıldığı banka kayıtlarında görülüyor.'],
                question: 'Para nereye gitti?', answer: 'Kumara. Her seferinde "bu sefer kazanır, yerine koyarım" dedim.',
            },
            {
                text: 'Kiramı ödeyemedim, okulun parasından aldım. Hepsini geri koydum.', emotion: 'remorseful', sympathy: true, law: 'small', tags: ['restitution'],
                detail: 'Okulun yakıt parası',
                summary: 'Okul müdürüyken okulun kalorifer yakıtı için ayrılan ödenekten kendi kirası için para aldı.',
                evidence: ['Eksik para: ₺9.000.', 'Müfettiş gelmeden parayı tamamen hesaba geri yatırmış.'],
                question: 'Parayı ne zaman geri koydun?', answer: 'Maaşım yatar yatmaz. Çocuklar bir gün bile soğukta kalmadı.',
            },
            {
                text: 'Bir zarfı açtım, o kadar. Kimse aramıyordu o parayı.', emotion: 'defiant', sympathy: false, law: 'small',
                detail: 'Adliye emaneti',
                summary: 'Adliyede emanet memuruyken, bir davada delil olarak teslim edilen zarftaki parayı kendine aldı.',
                evidence: ['Zarftan eksilen para: ₺6.500.', 'Para geri ödenmemiş; sanık "dava düştü, sahibi yok" diyor.'],
                question: 'Parayı geri verdin mi?', answer: 'Neyi vereyim? Sahibi cezaevinde, sormadı bile.',
            },
            {
                text: 'İmzayı ben attım ama düzeni ben kurmadım.', emotion: 'panicked', sympathy: false, law: 'organised',
                detail: 'Hastane faturaları',
                summary: 'Devlet hastanesinin muhasebe müdürüyken üç memurla birlikte hiç alınmamış malzemeler için sahte faturalar ödedi.',
                evidence: ['Sahte faturalarla çekilen kamu parası: ₺18.000.000.', 'Para dört memurun yakınlarının hesaplarında paylaştırılmış.'],
                question: 'Diğer memurlar ne kadar aldı?', answer: 'Herkes payını aldı. Ben de aldım, inkâr etmiyorum.',
            },
            {
                text: 'O açık benim değil! Yirmi yıldır bu kasadayım.', emotion: 'panicked', sympathy: true, law: 'innocent',
                detail: 'Postane kasası',
                summary: 'Postane gişe memuru; yıl sonu sayımında kasasında açık çıktı ve zimmetle suçlandı.',
                evidence: ['Kasa açığı: ₺75.000.', 'Eksik işlemler sanığın kullanıcı şifresiyle yapılmış.'],
                question: 'Şifreni başkası biliyor muydu?', answer: 'Şifreler müdürün çekmecesinde bir defterde yazılıydı. Herkes bilirdi.',
                delayed: {
                    note: 'Bilirkişi incelemesi bekleniyor',
                    evidence: 'Rapor: işlemlerin hepsi sanığın izinli olduğu günlerde, başka bir memurun bilgisayarından yapılmış.',
                },
            },
        ],
    },

    bribery: {
        name: 'Rüşvet',
        severity: 3,
        laws: {
            base: { verdict: 'jail-short', text: 'görevliye iş yaptırmak için rüşvet verme veya alma' },
            demanded: { verdict: 'jail-medium', text: 'Rüşveti görevli kendisi istemiş veya dayatmışsa' },
            forced: { verdict: 'fine-minor', text: 'Vatandaş zaten hakkı olan bir şeyi alabilmek için ödemeye mecbur bırakılmışsa' },
        },
        statements: [
            {
                text: 'Üç kere kaldım. Dördüncüde zarfı verdim, ne var?', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Ehliyet sınavı',
                summary: 'Direksiyon sınavında üç kez kaldıktan sonra sınav görevlisine geçmek için para verdi.',
                evidence: ['Görevliye verilen para: ₺15.000.', 'Görevli parayı istememiş; teklif sanıktan gelmiş.'],
                question: 'Parayı görevli mi istedi?', answer: 'Yok, ben uzattım. Herkes böyle geçiyor diye duydum.',
            },
            {
                text: 'Çay parası diyorduk. Kimseyi zorlamadım.', emotion: 'proud', sympathy: false, law: 'demanded',
                detail: 'Tapu memuru',
                summary: 'Tapu memuruyken satış işlemlerini "eksik evrak" diyerek bekletti; para veren vatandaşın işini aynı gün bitirdi.',
                evidence: ['Bir yılda 200\'den fazla vatandaştan para aldığı tespit edildi.', 'Para vermeyenlerin dosyaları aylarca bekletilmiş.'],
                question: 'Evrak gerçekten eksik miydi?', answer: 'Eksik bulmak isteyen her zaman bulur.',
            },
            {
                text: 'Oğlumun raporu için ödedim. Altı aydır kapı kapı geziyordum.', emotion: 'remorseful', sympathy: true, law: 'forced',
                detail: 'Engelli raporu',
                summary: 'Engelli çocuğu için alması gereken sağlık raporu aylarca bekletilince hastane memuruna para verdi.',
                evidence: ['Doktorlar çocuğun rapora hak kazandığını yazmış.', 'Memur "para yoksa rapor yok" demiş; sanık durumu sonra kendisi ihbar etmiş.'],
                question: 'Parayı kim istedi?', answer: 'Memur. "Sıra uzun, hızlandırırım" dedi. Başka çarem yoktu.',
            },
            {
                text: 'Görüş kolay değil. Emeğimin karşılığını aldım.', emotion: 'defiant', sympathy: false, law: 'demanded',
                detail: 'Cezaevi görüşü',
                summary: 'Cezaevinde gardiyanken hükümlü yakınlarından açık görüş ve paket teslimi için düzenli para istedi.',
                evidence: ['Kırk aileden para aldığı tespit edildi.', 'Para vermeyen ailelerin görüşleri "teknik sorun" diyerek iptal edilmiş.'],
                question: 'Para vermeyenlere ne oldu?', answer: 'Sıraları biraz geç geldi. O kadar.',
            },
            {
                text: 'Memur para istedi! Vermesem ruhsat yoktu, dükkanım kapanırdı.', emotion: 'panicked', sympathy: true, law: 'base',
                detail: 'Restoran ruhsatı',
                summary: 'Restoranının ruhsatı için belediye denetçisine para verdi. Parayı denetçinin dayattığını söylüyor.',
                evidence: ['Restoranda yangın merdiveni ve acil çıkış yok.', 'Denetçi parayı aldığını kabul ediyor ama "teklif ondan geldi" diyor.'],
                question: 'Yangın çıkışını neden yapmadın?', answer: 'Yer yoktu. Zaten kimse yangın çıkışına bakmaz.',
                delayed: {
                    note: 'Ses kaydı incelemesi bekleniyor',
                    evidence: 'Kayıt: parayı ilk teklif eden sanık; denetçi önce reddetmiş, sanık ısrar etmiş.',
                },
            },
        ],
    },

    moneyLaundering: {
        name: 'Kara Para Aklama',
        severity: 4,
        laws: {
            base: { verdict: 'jail-medium', text: 'suç gelirinin kaynağını gizleyip yasal gösterme' },
            unaware: { verdict: 'fine-minor', text: 'Adını veya hesabını kullandırmış ama paranın suçtan geldiğini bilmiyorsa' },
            grave: { verdict: 'jail-long', text: 'Aklanan para uyuşturucu veya terör kaynaklıysa' },
        },
        statements: [
            {
                text: 'Ben altın satarım. Parayı kimin getirdiğine bakmam.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Kuyumcu',
                summary: 'Kuyumcu; bir dolandırıcılık çetesinin nakit parasını sahte satış faturalarıyla külçe altına çevirdi.',
                evidence: ['Bir yılda ₺30.000.000 nakit, kayıtsız altına çevrilmiş.', 'Çeteyle yazışmalarda "temizlik ücreti %5" yazıyor.'],
                question: 'Paranın nereden geldiğini biliyor muydun?', answer: 'Sormadım. Sormamak da bu işin parçası.',
            },
            {
                text: 'Lokantam boş görünür ama hesabım tutar.', emotion: 'defiant', sympathy: false, law: 'grave',
                detail: 'Boş lokanta',
                summary: 'Hiç müşterisi olmayan üç lokantasının kasasından, bir uyuşturucu şebekesinin parasını satış hasılatı gibi geçirdi.',
                evidence: ['Lokantaların günlük "cirosu" ₺200.000; kamera kayıtlarında içerisi hep boş.', 'Paranın şebekenin eroin satışından geldiği tapelerde konuşuluyor.'],
                question: 'Günde kaç müşteri gelir?', answer: 'Paket servis yapıyoruz. Kimse görmez.',
            },
            {
                text: 'Oğlum "imza at anne" dedi, attım. Okumam yazmam yok ki.', emotion: 'panicked', sympathy: true, law: 'unaware', gender: 'f',
                detail: 'Annenin adına',
                summary: 'Oğlunun isteğiyle bir oto yıkama şirketini ve banka hesaplarını kendi adına açtırdı; hesaplardan milyonlar geçti.',
                evidence: ['Hesaplara giren paranın oğlunun dolandırıcılık gelirleri olduğu tespit edildi.', 'Okuma yazma bilmiyor; hesaplardan tek kuruş çekmemiş.'],
                question: 'Hesaplarda ne kadar para olduğunu biliyor muydun?', answer: 'Kartı bile görmedim. Oğlum "vergi işi" dedi.',
            },
            {
                text: 'Sanat fiyatı belli olmaz. Bir tablo milyon da eder, beş kuruş da.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Sanat galerisi',
                summary: 'Galeri sahibi; rüşvet alan bir bürokratın parasını, tanınmamış ressamların tablolarını şişirilmiş fiyatla satarak temize çıkardı.',
                evidence: ['Değeri ₺20.000 olan tablolar ₺2.000.000\'a "satılmış".', 'Alıcı ve satıcının arkasında aynı bürokratın akrabaları var.'],
                question: 'Tabloları kim aldı?', answer: 'Sanatseverler. İsimlerini veremem, gizlilik esastır.',
            },
            {
                text: 'Şanslı bir adamım, Sayın Hakim. Piyango bana gülüyor.', emotion: 'proud', sympathy: false, law: 'grave',
                detail: 'Şanslı bilet',
                summary: 'Son iki yılda yedi kez büyük ikramiye kazanmış görünüyor; kazanan biletleri gerçek sahiplerinden nakit parayla satın aldığı anlaşıldı.',
                evidence: ['Biletlerin asıl sahipleri, sanığın biletleri ikramiyeden fazla nakitle aldığını söylüyor.', 'Kullanılan nakdin kaynağı henüz belirsiz.'],
                question: 'Biletleri aldığın nakit nereden?', answer: 'Kardeşimin işinden. Ticaret işte.',
                delayed: {
                    note: 'Mali Suçları Araştırma raporu bekleniyor',
                    evidence: 'Rapor: nakit, kardeşinin yönettiği eroin şebekesinin satış gelirinden geliyor.',
                },
            },
        ],
    },

    hacking: {
        name: 'Bilişim Sistemine Girme',
        severity: 3,
        laws: {
            base: { verdict: 'fine-major', text: 'izinsiz olarak bir bilişim sistemine girme' },
            dataTheft: { verdict: 'jail-short', text: 'Verileri kopyalamış, satmış veya yaymışsa' },
            critical: { verdict: 'jail-medium', text: 'Hastane veya kamu sistemini çalışamaz hale getirmişse' },
            researcher: { verdict: 'release', text: 'Açığı hemen yetkililere bildirmiş ve hiçbir veri almamışsa' },
        },
        statements: [
            {
                text: 'Matematik notumu biraz düzelttim. Babam beni öldürecekti.', emotion: 'panicked', sympathy: true, law: 'base', age: 16, tags: ['minor'],
                detail: 'Okul not sistemi',
                summary: 'Öğretmeninin şifresini omzunun üstünden görüp okulun not sistemine girdi ve kendi matematik notunu değiştirdi.',
                evidence: ['Not 35\'ten 70\'e çıkarılmış; giriş okulun dışındaki bir internet kafeden yapılmış.', 'Başka öğrencinin notuna dokunulmamış, hiçbir veri kopyalanmamış.'],
                question: 'Başka bir şeye baktın mı?', answer: 'Hayır. Sadece kendi notum. Çok korktum, hemen çıktım.',
            },
            {
                text: 'Veriler orada duruyordu. Ben almasam başkası alırdı.', emotion: 'defiant', sympathy: false, law: 'dataTheft',
                detail: 'Müşteri listesi',
                summary: 'Bir alışveriş sitesinin sunucusuna sızıp iki milyon müşterinin adres ve telefon bilgilerini bir forumda sattı.',
                evidence: ['Forumdaki satış ilanı sanığın kripto cüzdanına bağlı.', 'Satılan listeyle müşterilere sahte kargo mesajları gönderilmiş.'],
                question: 'Listeyi kime sattın?', answer: 'Kim para verdiyse. Ne yapacaklarını sormam.',
            },
            {
                text: 'Hastaneyi kilitleyeceğimi bilmiyordum. Sadece fidye istedim.', emotion: 'panicked', sympathy: false, law: 'critical',
                detail: 'Hastane sistemi',
                summary: 'Bir devlet hastanesinin bilgisayarlarını şifreleyen zararlı yazılım gönderip sistemi açmak için fidye istedi.',
                evidence: ['Hastane üç gün kağıtla çalıştı; ameliyatlar ertelendi.', 'Acil hastalar başka şehirlere sevk edildi.'],
                question: 'Hedefin hastane olduğunu biliyor muydun?', answer: 'Liste halinde gönderdim. Hangisi açılırsa...',
            },
            {
                text: 'Açığı buldum, bildirdim. Ödül beklerken kelepçe geldi.', emotion: 'defiant', sympathy: true, law: 'researcher',
                detail: 'Belediye sitesi',
                summary: 'Belediyenin e-hizmet sitesinde başkalarının su faturalarını görebilmeye yol açan bir açık buldu.',
                evidence: ['Giriş kayıtlarında yalnızca kendi kaydını ve bir deneme kaydını açmış.', 'Aynı gün belediyeye açığı anlatan bir e-posta göndermiş; açık kapatılmış.'],
                question: 'Başkalarının bilgilerini kaydettin mi?', answer: 'Hiçbirini. Bir kere gördüm, kapattım, yazdım.',
            },
            {
                text: 'Ben güvenlik araştırmacısıyım. Açığı bildirecektim.', emotion: 'proud', sympathy: false, law: 'dataTheft',
                detail: 'Sağlık kayıtları',
                summary: 'Bir özel klinik zincirinin hasta kayıt sistemine girdi. Açığı bildireceğini, hiçbir şey almadığını söylüyor.',
                evidence: ['Kliniğe hiçbir bildirim yapılmamış.', 'Sisteme üç hafta boyunca her gece girilmiş.'],
                question: 'Neden hemen bildirmedin?', answer: 'Raporumu hazırlıyordum. Bu işler zaman alır.',
                delayed: {
                    note: 'Dijital inceleme raporu bekleniyor',
                    evidence: 'Rapor: sanığın bilgisayarında 50.000 hastanın kaydı bulundu; bir kısmı yurt dışındaki bir alıcıya gönderilmiş.',
                },
            },
        ],
    },

    privacy: {
        name: 'Özel Hayatın Gizliliğini İhlal',
        severity: 3,
        laws: {
            base: { verdict: 'jail-short', text: 'başkasının özel konuşma, görüntü veya mesajlarını izinsiz kaydetme ya da yayma' },
            intimate: { verdict: 'jail-medium', text: 'Mahrem görüntüleri başkalarına yaymışsa' },
            selfDefense: { verdict: 'release', text: 'Kendine karşı işlenen bir suçu belgelemek için kaydetmiş ve yalnızca savcılığa vermişse' },
        },
        statements: [
            {
                text: 'Eşimin telefonu benim de telefonum sayılır. Saklayacak neyi var?', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Casus uygulama',
                summary: 'Eşinin telefonuna gizlice casus uygulama kurup aylarca mesajlarını, aramalarını ve konumunu izledi.',
                evidence: ['Uygulama 7 ay boyunca bütün yazışmaları kendi telefonuna aktarmış.', 'Kayıtları kimseyle paylaşmamış; eşi uygulamayı telefon tamircisinde fark etmiş.'],
                question: 'Eşinin haberi var mıydı?', answer: 'Olsa kurar mıydım? Aldatıyor sandım, hepsi bu.',
            },
            {
                text: 'Beni rezil etti, ben de onu ettim. Ödeştik.', emotion: 'proud', sympathy: false, law: 'intimate',
                detail: 'İntikam paylaşımı',
                summary: 'Ayrıldıktan sonra eski sevgilisinin mahrem fotoğraflarını sahte bir hesaptan sosyal medyada paylaştı.',
                evidence: ['Fotoğraflar silinene kadar binlerce kez görüntülendi.', 'Sahte hesabın kendi telefonundan açıldığını siber birim tespit etti.'],
                question: 'Hesabı kim açtı?', answer: 'Ben açtım. Ayrılırken onun bana yaptıklarını soran yok ama.',
            },
            {
                text: 'Kaydetmeseydim kim inanırdı bana? Sadece savcıya verdim.', emotion: 'panicked', sympathy: true, law: 'selfDefense',
                detail: 'Patronun tehdidi',
                summary: 'Maaşını vermeyip kendisini tehdit eden patronunun sözlerini gizlice telefonuna kaydetti. Patron, gizli kayıt için şikayetçi oldu.',
                evidence: ['Kayıtta patron "şikayet edersen seni bitiririm" diyor.', 'Kaydı yalnızca savcılığa teslim etmiş; başka kimseye göndermemiş.'],
                question: 'Kaydı başka kime gösterdin?', answer: 'Hiç kimseye. Avukatım bile savcılıkta dinledi.',
            },
            {
                text: 'Şaka olsun diye attım... Bu kadar büyüyeceğini bilmiyordum.', emotion: 'remorseful', sympathy: false, law: 'base', tags: ['minor'], age: 16,
                detail: 'Okul grubu',
                summary: 'Sınıf arkadaşının sırada açık unuttuğu telefonundan özel mesajlarının fotoğrafını çekip okulun mesaj grubunda paylaştı.',
                evidence: ['Mesajlar 300 kişilik grupta yayıldı; arkadaşı okula gidemez oldu.', 'Paylaşılanlar yalnızca yazışmalar; mahrem görüntü yok.'],
                question: 'Telefona neden baktın?', answer: 'Açık duruyordu, bir bakayım dedim. Sonra elim gitti.',
            },
            {
                text: 'Fotoğraflar telefonumda duruyordu, o kadar. Kimseye göndermedim.', emotion: 'panicked', sympathy: false, law: 'intimate',
                detail: 'Telefondaki fotoğraflar',
                summary: 'Eski eşinin mahrem fotoğrafları ortak tanıdıklara ulaştı. Fotoğrafları sakladığını kabul ediyor, göndermeyi reddediyor.',
                evidence: ['Fotoğraflar ilişki sürerken rızayla çekilmiş.', 'Eski eşi, fotoğrafların yalnızca sanıkta olduğunu söylüyor.'],
                question: 'Fotoğrafları neden silmedin?', answer: 'Unuttum işte. Telefonu bir ara kaybetmiştim, belki ondandır.',
                delayed: {
                    note: 'Telefon inceleme raporu bekleniyor',
                    evidence: 'Rapor: fotoğraflar sanığın telefonundan üç ayrı mesaj grubuna, evindeki internetten gönderilmiş.',
                },
            },
        ],
    },

    childMarriage: {
        name: 'Çocuk Yaşta Evlilik',
        severity: 5,
        laws: {
            base: { verdict: 'jail-medium', text: 'çocuğu evlendiren, evliliğe zorlayan veya nikahını kıyan yetişkin' },
            groom: { verdict: 'jail-long', text: 'Çocukla evlenen veya onunla karı koca gibi yaşayan yetişkinse' },
            reported: { verdict: 'jail-short', text: 'Baskıyla katılmış ama sonra kendisi ihbar etmişse' },
        },
        statements: [
            {
                text: 'Kızımı kendi adetimize göre evlendirdim. Kimse karışamaz.', emotion: 'proud', sympathy: false, law: 'base', gender: 'm',
                detail: 'Başlık parası',
                summary: '14 yaşındaki kızını başlık parası karşılığında komşu köyden bir adamla dini nikahla evlendirdi.',
                evidence: ['Damadın ailesinden ₺300.000 başlık parası alındığı tanıklarla sabit.', 'Kız okuldan alınmış; öğretmeni devamsızlık üzerine ihbar etmiş.'],
                question: 'Kızın kaç yaşında?', answer: 'On dört. Annesi de o yaşta evlendi, bir şey olmadı.',
            },
            {
                text: 'Ailesi verdi, ben aldım. Nikahımız var, suç nerede?', emotion: 'defiant', sympathy: false, law: 'groom', gender: 'm',
                detail: 'Damat',
                summary: '38 yaşındayken 15 yaşındaki bir kızla dini nikah kıydırıp onu evine aldı. Durum komşuların ihbarıyla ortaya çıktı.',
                evidence: ['Kızın nüfus kaydı 15 yaşında olduğunu gösteriyor.', 'Kız bir yıldır sanığın evinde onunla birlikte yaşıyor; adli tıp raporu alındı.'],
                question: 'Kızın yaşını biliyor muydun?', answer: 'Biliyordum. Bizim orada o yaşta kız evde kalmaz.',
            },
            {
                text: 'Düğüne ben de gittim, ama susmadım. Bir hafta sonra jandarmaya gittim.', emotion: 'remorseful', sympathy: true, law: 'reported', gender: 'f',
                detail: 'Pişman teyze',
                summary: '15 yaşındaki yeğeninin evlendirilmesine aile baskısıyla aracılık etti. Bir hafta sonra jandarmaya gidip her şeyi anlattı.',
                evidence: ['Yeğeni, nikahtan önce teyzesine ağlayarak yalvardığını anlattı.', 'Kız, teyzenin ihbarı ve verdiği adres sayesinde kurtarıldı.'],
                question: 'Neden en başta karşı çıkmadın?', answer: 'Çıktım, dinlemediler. Kocam beni evden atacaktı. Bir hafta uyuyamadım.',
            },
            {
                text: 'Ben sadece duayı okudum. Gerisi ailelerin işi.', emotion: 'defiant', sympathy: false, law: 'base',
                detail: 'Gayriresmi nikah', gender: 'm',
                summary: 'Hiçbir resmi yetkisi olmadan, 13 yaşındaki bir kızın dini nikahını para karşılığı kıydı.',
                evidence: ['Nikah sırasında çekilen video düğünden sosyal medyaya düştü.', 'Videoda kızın yaşını sorduğu ve "on üç" cevabını aldığı duyuluyor.'],
                question: 'Kızın yaşını sordun mu?', answer: 'Sordum... Aileler razıydı. Ben kimim ki karışayım?',
            },
            {
                text: 'Kızım on sekiz yaşında! Kimliği geç çıkarıldı, yaşı yanlış yazıldı.', emotion: 'panicked', sympathy: false, law: 'base', gender: 'f',
                detail: 'Yaş tartışması',
                summary: 'Kızını bir akrabasıyla evlendirdi. Kızın kimliğinde 15 yazıyor; anne, nüfus kaydının yanlış olduğunu söylüyor.',
                evidence: ['Kızın kimliği geç alınmış; doğum tarihi tahminle yazılmış.', 'Kızın okul kaydı yok; anne yaşını kanıtlayacak belge sunamadı.'],
                question: 'Kızın gerçekte kaç yaşında?', answer: 'On sekiz, dedim ya! Benden iyi mi bileceksiniz?',
                delayed: {
                    note: 'Adli tıp yaş tespiti bekleniyor',
                    evidence: 'Rapor: kemik yaşı tespitine göre kız 14 ile 15 yaşında; reşit değil.',
                },
            },
        ],
    },

    migrantSmuggling: {
        name: 'Göçmen Kaçakçılığı',
        severity: 4,
        laws: {
            base: { verdict: 'jail-medium', text: 'para karşılığı insanları yasa dışı yoldan sınırdan geçirme veya taşıma' },
            organized: { verdict: 'jail-long', text: 'Bu iş için örgüt kurup sürekli yapmışsa' },
            fatal: { verdict: 'death', text: 'Yolda insanların ölümüne yol açmışsa' },
            compassion: { verdict: 'fine-moderate', text: 'Hiç para almadan, yalnızca insani amaçla yardım etmişse' },
        },
        statements: [
            {
                text: 'Denizi ben mi dalgalandırdım? Botu ben batırmadım.', emotion: 'defiant', sympathy: false, law: 'fatal',
                detail: 'Batan bot',
                summary: '10 kişilik lastik bota 40 göçmen bindirip fırtına uyarısına rağmen denize itti. Bot battı, 9 kişi boğuldu.',
                evidence: ['Botta can yeleği yok denecek kadar azdı.', 'Göçmenlerden kişi başı 2.000 dolar almış, botu kıyıdan itip geri dönmüş.'],
                question: 'Hava durumunu biliyor muydun?', answer: 'Biliyordum. Ama müşteri bekletilmez, başkasına gider.',
            },
            {
                text: 'İlk ve son kez yaptım. Borçlarımı kapatacaktım.', emotion: 'panicked', sympathy: false, law: 'base',
                detail: 'Minibüs',
                summary: 'Sınırdan yeni geçmiş 11 göçmeni para karşılığı minibüsüyle batıya götürürken jandarma kontrolünde yakalandı.',
                evidence: ['Kişi başı ₺15.000 almış; göçmenlerin hepsi sağlıklı.', 'Sabıkası yok; telefonunda başka bir seferin izi bulunmadı.'],
                question: 'Parayı kim verdi?', answer: 'Göçmenler kendileri. Biri numaramı vermiş, ilk kez aradılar.',
            },
            {
                text: 'Ben insanlara yeni hayat satıyorum. Talep varsa arz da olur.', emotion: 'proud', sympathy: false, law: 'organized',
                detail: 'Şebeke başı',
                summary: 'Sahte pasaportçular, güvenli evler ve şoförlerden oluşan bir ağ kurup iki yılda yüzlerce göçmeni sınırdan geçirdi.',
                evidence: ['Ağın defterinde 600 kişiden fazla göçmen ve 14 maaşlı çalışan kayıtlı.', 'Yakalanan şoförlerin hepsi ödemeleri sanıktan aldıklarını söyledi.'],
                question: 'Kaç kişi çalıştırıyordun?', answer: 'On dört. Hepsi sigortasız ama maaşları zamanında.',
            },
            {
                text: 'Kucağında bebekle kapımı çaldılar. Kapıyı kapatamazdım.', emotion: 'remorseful', sympathy: true, law: 'compassion',
                detail: 'Ahırdaki aile',
                summary: 'Sınır köyünde, kapısını çalan göçmen bir aileyi iki gün ahırında saklayıp kendi traktörüyle şehre götürdü.',
                evidence: ['Aile, sanığın hiç para almadığını doğruluyor.', 'Bebeği köy sağlık ocağına götürüp ilaçlarını kendi cebinden almış.'],
                question: 'Para teklif ettiler mi?', answer: 'Ettiler, almadım. Ellerinde bir şey yoktu ki zaten.',
            },
            {
                text: 'Bana mobilya dediler! Kasayı mühürlü verdiler, ben açmadım.', emotion: 'panicked', sympathy: true, law: 'innocent',
                detail: 'Tır şoförü',
                summary: 'Kullandığı tırın kasasından 23 göçmen çıktı. Yükü firmadan mühürlü teslim aldığını söylüyor.',
                evidence: ['Kasa mühürlüydü; irsaliyede "mobilya" yazıyor.', 'Göçmenler şoförü yolculuk boyunca hiç görmediklerini söylüyor.'],
                question: 'Kasayı hiç açtın mı?', answer: 'Mühürlü yükü açmak yasak. Ben sadece direksiyon sallarım.',
                delayed: {
                    note: 'Telefon ve banka incelemesi bekleniyor',
                    evidence: 'İnceleme: şoförün hesabına yalnızca normal nakliye ücreti yatmış; kaçakçılarla hiçbir bağlantısı yok.',
                },
            },
        ],
    },

    forestArson: {
        name: 'Orman Yakma',
        severity: 4,
        laws: {
            base: { verdict: 'jail-long', text: 'ormanı bilerek ateşe verme' },
            fatal: { verdict: 'death', text: 'Yangında insanlar hayatını kaybetmişse' },
            negligence: { verdict: 'house-arrest', text: 'Yasağa rağmen ateş yakıp dikkatsizlikle orman yangınına yol açmışsa' },
        },
        statements: [
            {
                text: 'Üç çam yandı diye kıyamet koptu. Orası zaten imara açılacaktı.', emotion: 'proud', sympathy: false, law: 'base',
                detail: 'Villa arsası',
                summary: 'Ormanı imara açtırmak umuduyla, villa yapmak istediği yamaçta gece üç ayrı noktadan yangın başlattı.',
                evidence: ['120 dönüm orman yandı; can kaybı yok.', 'Yangından önce aynı arazi için müteahhitle ön sözleşme imzalamış.'],
                question: 'Müteahhitle ne konuştun?', answer: 'Yanan yerde orman kalmaz, imar çıkar dediler. Ben de biraz yardım ettim.',
            },
            {
                text: 'Babamdan gördüğüm gibi anızı yaktım. Rüzgar döndü, ormana geçti.', emotion: 'remorseful', sympathy: true, law: 'negligence',
                detail: 'Anız yangını',
                summary: 'Yangın yasağı ilan edilmişken tarlasındaki anızı yaktı. Ateş rüzgarla bitişikteki ormana sıçradı, 30 dönüm yandı.',
                evidence: ['Muhtarlık yangın yasağını bir hafta önce duyurmuştu.', 'Yangını ilk haber veren kendisi; söndürmeye sabaha kadar katılmış.'],
                question: 'Yasağı duymadın mı?', answer: 'Duydum. Hep yakardık, bir şey olmazdı... Bu sefer oldu.',
            },
            {
                text: 'Orman idaresi tarlamı elimden aldı. Ben de ormanını aldım.', emotion: 'defiant', sympathy: false, law: 'fatal',
                detail: 'İntikam yangını',
                summary: 'Tarlası orman sınırına alınınca öfkelenip ormanı benzinle ateşe verdi. Yangın köye ulaştı, iki gönüllü itfaiyeci öldü.',
                evidence: ['Yangın yerinde benzin bidonu ve sanığın parmak izleri bulundu.', 'Gönüllüler köydeki evleri korurken alevlerin arasında kaldı.'],
                question: 'Bidon kimin?', answer: 'Benim. Ama kimse ölsün istemedim, orman yansın istedim.',
            },
            {
                text: 'Sinirliydim... Bir çakmak çaktım, sonra durduramadım.', emotion: 'panicked', sympathy: false, law: 'base', tags: ['minor'], age: 17,
                detail: 'Öfkeli genç',
                summary: 'Okuldan uzaklaştırma aldığı gün öfkeyle okulun arkasındaki çamlığı birkaç yerden tutuşturdu. 15 dönüm orman yandı.',
                evidence: ['Kimse yaralanmadı; yangın iki saatte söndürüldü.', 'Bir öğrencinin videosunda kuru otlara tek tek çakmak tuttuğu görülüyor.'],
                question: 'Kaç yerden yaktın?', answer: 'Üç dört yerden... Kafam atmıştı. Annemin yüzüne bakamıyorum.',
            },
            {
                text: 'Yangın çıktığında oradaydım diye beni yakaladılar. Ben o ormanda büyüdüm!', emotion: 'panicked', sympathy: true, law: 'innocent',
                detail: 'Yanlış şüphe',
                summary: 'Yangının başladığı yerin yakınında görüldüğü için gözaltına alındı. Komşularıyla arasında arazi davası sürüyor.',
                evidence: ['İki komşusu onu yangından hemen önce o bölgede gördüğünü söylüyor.', 'Üzerinde çakmak veya yanıcı madde bulunmadı.'],
                question: 'Orada ne yapıyordun?', answer: 'Keçilerimi otlatıyordum, her gün oradayım. Dumanı görünce ben de söndürmeye koştum.',
                delayed: {
                    note: 'Yangın uzmanı raporu bekleniyor',
                    evidence: 'Rapor: yangın, kopan bir elektrik hattının kuru otlara değmesiyle başlamış; insan eli yok.',
                },
            },
        ],
    },
};

[VERDICT_LABELS, GENERAL_NOTES, AMENDMENTS, LAW_CHAPTERS, CRIMES].forEach(translateTree);
