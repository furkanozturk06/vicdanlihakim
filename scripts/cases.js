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
                detail: 'Doğum sancısı',
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
                detail: 'Üvey baba',
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
                detail: 'Velayet',
                summary: 'Velayeti eski eşinde olan oğlunu okuldan izinsiz alıp başka şehre götürdü.',
                evidence: ['Çocuk iki gün sonra sağlıklı bulundu.', 'Mahkeme kararına rağmen eski eşi altı aydır görüşmeye izin vermiyormuş.'],
                question: 'Çocuk ne diyor?', answer: 'Babasını özlediğini söylüyor. Ben de onu...',
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
            innocent: { verdict: 'jail-medium', text: 'Masum birinin mahkum olmasına yol açmışsa' },
            corrected: { verdict: 'fine-moderate', text: 'Bir yakınını korumak için yapıp sonradan kendisi düzeltmişse' },
        },
        statements: [
            {
                text: 'Para verdiler, ben de söylediklerini söyledim.', emotion: 'defiant', sympathy: false, law: 'innocent',
                detail: 'Para karşılığı tanıklık',
                summary: 'Para karşılığı verdiği yalan ifadeyle masum bir adam 3 yıl hapis yattı.',
                evidence: ['Gerçek fail sonradan itiraf etti.', 'Sanığın hesabına duruşmadan önce ₺50.000 yatırılmış.'],
                question: 'Parayı kim verdi?', answer: 'Gerçek failin ailesi. Adam yattı mı umurumda değildi.',
            },
            {
                text: 'Oğlumu korumak istedim... Ertesi gün gelip gerçeği anlattım.', emotion: 'remorseful', sympathy: true, law: 'corrected',
                detail: 'Anne',
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
        ],
    },
};
