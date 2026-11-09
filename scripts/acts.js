/**
 * Act 2 (TURKISH)
 *
 * The story mode runs 30 days: act 1 is days 1-15, act 2 days 16-30.
 * How the judge handled the minister\'s son on day 15 picks the branch:
 *   - the law (or harsher)        -> 'surgun': exile to Karaçam, a town run by
 *                                     Hacı Rıza Karaca and his government-linked "Hikmet Vakfı"
 *   - a favour (deal or lighter)  -> 'borc':   promotion to the high court, where ruling-party
 *                                     MPs are tried for treason
 *
 * All people, places and organisations here are fictional.
 *
 * Special cases carry `wants`: the direction the power behind them wants the verdict
 * to go. Verdicts that go that way (or accepting their offer) count as favours and
 * decide the ending.
 */

import { choice, adjust } from './family.js';

export const ACT_LENGTH = 15;
export const TOTAL_DAYS = 30;
export const ACT2_CASES_PER_DAY = 4;

const one = (text, label, apply = () => '') => ({ text, choices: [choice(label, apply)] });

// A calm evening, one of a few, chosen by day so it does not repeat back to back
const quiet = (state, options) => {
    const [text, result] = options[state.day % options.length];
    return one(text, 'Dinlen', s => { adjust(s, { harmony: 2 }); return result; });
};

// Branch from the day-15 verdict on the minister\'s son
export function branchFor(finale) {
    return finale === 'correct' || finale === 'harsh' ? 'surgun' : 'borc';
}

export const BRANCHES = {
    // =====================================================================
    surgun: {
        name: 'İkinci Perde: Sürgün',
        transition: {
            text: 'Akşam bakanlıktan tebligat geldi: "Karaçam Asliye Ceza Mahkemesine atandınız. Göreve başlama: üç gün içinde." Deniz kâğıdı iki kez okudu. Ece "Karaçam neresi?" diye sordu. Haritada bulmanız on dakika sürdü.',
            choices: [
                choice('"Kanunu uyguladık, bedelini ödeyeceğiz."', s => { adjust(s, { conscience: 5 }); return 'Deniz elini omzuna koydu: "Doğrusunu yaptın. Gerisini birlikte hallederiz."'; }),
                choice('Bakanlığı arayıp tayini geri aldırmayı dene', s => { adjust(s, { conscience: -3 }); return 'Telefondaki ses güldü: "Karaçam\'ın havası iyi gelir size, Hakim Bey." Telefon kapandı.'; }),
            ],
        },
        intro: {
            title: 'Karaçam',
            text: 'Kasabaya giden tek yol çamurlu. Adliye binası eski bir han. Kapıdaki tabelanın yanında daha büyük bir tabela var: "Hikmet Vakfı – Hacı Rıza Karaca\'nın himayesinde."\n\nKâtip fısıldıyor: "Burada her şey Hacı Rıza Bey\'den sorulur, hakim bey. Vakfın Ankara\'da da dostları vardır."\n\nKarşında on beş gün daha var. Bu kez seni deneyen bir bakanlık değil, bütün bir kasaba.',
            button: 'Adliyeye Gir',
        },
        directives: [
            { text: 'Belediye: Pazar esnafına anlayış gösterilmesi rica olunur.', crimeFilter: ['landDispute', 'pettyTheft', 'vandalism'], bonus: 'fine', bonusAmount: 1.3 },
            { text: 'Vakıf: "Kasabanın huzuru için sert kararlar bekliyoruz."', crimeFilter: ['bloodFeud', 'assault', 'organizedCrime'], bonus: 'jail', bonusAmount: 1.3 },
            { text: 'Kaymakamlık: Seçim döneminde dikkatli olun.', crimeFilter: ['election', 'defamation'], bonus: null, bonusAmount: 1 },
            { text: 'Sakin bir gün. Kasabada yağmur yağıyor.', crimeFilter: null, bonus: null, bonusAmount: 1 },
        ],
        finalDirective: { text: 'Bütün kasaba adliyenin önünde. Bugün Hacı Rıza Karaca yargılanıyor.', crimeFilter: null, bonus: null, bonusAmount: 1 },

        // Morning story beats
        beats: {
            17: () => ({
                icon: '🏛️', title: 'Belediye Başkanının Ziyareti',
                text: 'Belediye Başkanı Sabri Öz odana elinde lokumla girdi: "Hoş geldiniz hakim bey. Kasabamızda işler Hacı Rıza Bey\'in bilgisi dahilinde yürür. Siz de rahat edersiniz, biz de."',
                choices: [{ label: '"Kanun herkese eşittir."', value: 'stand' }, { label: 'Lokumu al, sessiz kal', value: 'quiet' }],
                onChoice: (s, v) => { s.flags.mayor = v; if (v === 'quiet') adjust(s, { conscience: -3 }); },
            }),
            18: () => ({
                icon: '📰', title: 'Karaçam Postası',
                text: 'Yerel gazetenin sahibi ve tek muhabiri Hasan Ulu adliye çıkışında yanına yaklaştı: "Vakfın yurtlarında çocuklar çalıştırılıyor, belediyenin ihaleleri vakfa gidiyor. Hepsini yazıyorum. Bir gün beni de önünüze getirecekler."',
                choices: [{ label: 'Devam', value: true }],
            }),
            21: (s) => (s.specials.imar && s.specials.imar.favored
                ? { icon: '🧺', title: 'Vakıftan Bir Sepet', text: 'Kapına vakıftan bir erzak sepeti bırakılmış: yağ, şeker, bir de Ece için oyuncak. Kartta "Hacı Rıza Bey\'in selamıyla" yazıyor.', choices: [{ label: 'Devam', value: true }], apply: { conscience: -4 } }
                : { icon: '🚰', title: 'Suyunuz Kesildi', text: 'Sabah musluklardan su akmadı. Belediyeden gelen görevli omuz silkti: "Arıza var, hakim bey. Ne zaman düzelir, Hacı Rıza Bey bilir."', choices: [{ label: 'Devam', value: true }], apply: { harmony: -8 } }),
            23: () => ({
                icon: '🩺', title: 'Doktor Leyla Tan',
                text: 'Sağlık ocağının genç doktoru Leyla Tan annenin kontrolünden sonra seni kenara çekti: "Vakfın yurdunda geçen ay bir öğrenci öldü. Rapora \'kaza\' yazmamı istediler, yazmadım. Dosya size gelecek. Ben gerçeği söyleyeceğim."',
                choices: [{ label: 'Devam', value: true }],
            }),
            27: (s) => {
                const h = s.specials.hasan;
                if (h && h.verdict === 'release') return { icon: '📰', title: 'Karaçam Postası Yeniden Çıktı', text: 'Hasan\'ın gazetesinin manşeti: "Vakfın yurtlarında neler oluyor?" Kasaba gazeteyi elden ele dolaştırıyor. Hasan sana bir not bırakmış: "Teşekkürler. Korkmadığınız için."', choices: [{ label: 'Devam', value: true }], apply: { reputation: 6 } };
                return { icon: '🔒', title: 'Kapanan Gazete', text: 'Karaçam Postası\'nın kepenkleri indirilmiş. Kasabada kimse Hasan\'ın adını yüksek sesle anmıyor.', choices: [{ label: 'Devam', value: true }], apply: { conscience: -6 } };
            },
            29: (s) => ({
                icon: '🩺', title: 'Son Uyarı',
                text: s.flags.mayor === 'stand'
                    ? 'Doktor Leyla akşam kapını çaldı: "Yarın Hacı Rıza\'nın kendisi önünüze çıkacak. Ankara\'dan aramalar başladı bile. Kasaba sizi izliyor. Biz de."'
                    : 'Belediye Başkanı Sabri Öz telefonda: "Yarınki dosya bir formalite hakim bey. Hacı Rıza Bey vakfın başında kalırsa kasaba için iyi olur. Sizin için de."',
                choices: [{ label: 'Devam', value: true }],
            }),
        },

        // Cases tied to the story. position: 'first' or 'last' case of the day.
        specials: [
            {
                day: 19, position: 'first', key: 'imar', crimeType: 'corruption', name: 'Kenan Yıldız', age: 51, gender: 'm', wants: 'lighter',
                statement: {
                    text: 'Vakfın yurt binalarına izin verdim, evet. Kasabaya hayır yapıyorlar.', emotion: 'proud', sympathy: false, law: 'bribery',
                    detail: 'Vakfın imar izinleri',
                    summary: 'Belediye imar müdürüyken Hikmet Vakfı\'nın orman arazisine yaptığı yurt binalarına, karşılığında para alarak izin verdi.',
                    evidence: ['Hesabına vakıftan "danışmanlık ücreti" adıyla ₺1.800.000 yatırılmış.', 'Binaların hiçbirinin deprem raporu yok.'],
                    question: 'Vakıftan para aldın mı?', answer: 'Danışmanlık yaptım. Hacı Rıza Bey cömert biridir.',
                },
                offer: { icon: '🧔', title: 'Hacı Rıza\'dan Haber', text: 'Kâtip kapıyı kapatıp fısıldadı: "Hacı Rıza Bey selam söyledi. Kenan Bey\'e beraat verirseniz kasabada her kapı size açılır. Bir de şu zarf..."', accept: 'Beraat ver', decline: 'Kanunu uygula', amount: 1500, forcedVerdict: 'release' },
            },
            {
                day: 22, position: 'first', key: 'hasan', crimeType: 'defamation', name: 'Hasan Ulu', age: 46, gender: 'm', wants: 'harsher',
                statement: {
                    text: 'Yazdığım her satırın belgesi var. İftira değil, gerçek bu.', emotion: 'defiant', sympathy: true, law: 'truth',
                    detail: 'Muhabir Hasan Ulu',
                    summary: 'Karaçam Postası\'nda Hikmet Vakfı\'nın yurtlarında çocukların ücretsiz çalıştırıldığını yazdı. Vakıf "iftira" diye şikayetçi oldu.',
                    evidence: ['Haberdeki çocukların bordrosuz çalıştırıldığı iş müfettişi raporuyla doğrulandı.', 'Haberde adı geçen üç çocuk mahkemede ifade vermeye hazır.'],
                    question: 'Belgelerini nereden aldın?', answer: 'Çocukların kendisinden. Bir de vicdanı olan bir yurt aşçısından.',
                },
                offer: { icon: '🧔', title: 'Vakıftan Telefon', text: 'Hacı Rıza bizzat aradı, sesi yumuşak: "Hasan kasabanın huzurunu bozuyor hakim bey. Ona ağır bir ceza verin ki herkes haddini bilsin. Karşılığını görürsünüz."', accept: 'Hapis ver', decline: 'Kanunu uygula', amount: 1500, forcedVerdict: 'jail-medium' },
            },
            {
                day: 25, position: 'first', key: 'yurt', crimeType: 'murder', name: 'Necmi Aksoy', age: 58, gender: 'm', wants: 'lighter',
                statement: {
                    text: 'Kapıyı ben kilitlemedim! Yönetim öyle istedi, çocuklar kaçmasın diye.', emotion: 'panicked', sympathy: false, law: 'negligent',
                    detail: 'Vakıf yurdu yangını',
                    summary: 'Hikmet Vakfı yurdunun müdürüyken yangın çıkış kapılarını geceleri kilitletti. Çıkan yangında bir öğrenci hayatını kaybetti.',
                    evidence: ['Doktor Leyla Tan\'ın raporu: öğrenci dumandan, kilitli kapının önünde öldü.', 'Kapıları kilitleme talimatının müdürün imzasıyla asıldığı tespit edildi.'],
                    question: 'Kapıları neden kilitlediniz?', answer: 'Çocuklar geceleri kaçıyordu. Vakıf "Bir tane daha kaçarsa sen sorumlusun" dedi.',
                },
                offer: { icon: '🧔', title: 'Vakfın Avukatı', text: 'Vakfın avukatı masana bir dosya bıraktı: "Kaza, hakim bey. Müdür beraat ederse vakıf kasabaya yeni bir okul yaptıracak. Adınızı da koyarız."', accept: 'Beraat ver', decline: 'Kanunu uygula', amount: 1500, forcedVerdict: 'release' },
            },
            {
                day: 28, position: 'first', key: 'saldiri', crimeType: 'assault', name: 'Rüstem Kaya', age: 34, gender: 'm', wants: 'lighter',
                statement: {
                    text: 'Doktor haddini bilseydi bunlar olmazdı.', emotion: 'defiant', sympathy: false, law: 'serious',
                    detail: 'Sağlık ocağı baskını',
                    summary: 'Hikmet Vakfı\'nın korumasıyken, yurt davasında ifade veren Doktor Leyla Tan\'ın sağlık ocağını bastı; doktoru tehdit edip araya giren hemşireyi dövdü.',
                    evidence: ['Hemşirenin kolu ve iki kaburgası kırıldı.', 'Sağlık ocağının kamerasında yüzü açıkça görülüyor; telefonunda "Doktora ders verin" mesajı var.'],
                    question: 'Bu mesajı kim gönderdi?', answer: 'Vakıfta emir yukarıdan gelir. Ben aşağıdayım.',
                },
                offer: { icon: '🧔', title: 'Hacı Rıza\'dan Haber', text: 'Kâtip yine fısıldıyor: "Rüstem, Hacı Rıza Bey\'in yeğeni. Beraat ederse siz de bir şey kaybetmezsiniz."', accept: 'Beraat ver', decline: 'Kanunu uygula', amount: 1500, forcedVerdict: 'release' },
            },
            {
                day: 30, position: 'last', key: 'aga', crimeType: 'organizedCrime', name: 'Hacı Rıza Karaca', age: 67, gender: 'm', wants: 'lighter', finalCase: true,
                statement: {
                    text: 'Bu kasabaya okul, cami, yol yaptım. Beni sen mi yargılayacaksın?', emotion: 'proud', sympathy: false, law: 'leader',
                    detail: 'Hacı Rıza Karaca',
                    summary: 'Hikmet Vakfı\'nın lideri. Vakıf aracılığıyla haraç, kayıt dışı çocuk işçiliği, ihale rüşveti ve tehdit çarkını yönettiği iddiasıyla yargılanıyor.',
                    evidence: ['Vakfın gizli defterleri: esnaftan haraç, belediyeden ihale payı ve korumalara ödemeler Hacı Rıza\'nın imzasıyla onaylanmış.', 'Korumaların ve yurt müdürünün ifadeleri talimatların doğrudan ondan geldiğini söylüyor.'],
                    question: 'Defterlerdeki imza kimin?', answer: 'Benim. Ama o defterleri okuyacak cesaret kimde var, hakim bey?',
                },
                offer: { icon: '📞', title: 'Ankara\'dan Telefon', text: 'Bakanlıktan aynı tanıdık ses: "Hacı Rıza Bey devletimizin dostudur. Beraat verin; Ankara\'ya tayininiz ve ₺5000 hazır. Karaçam\'ı unutursunuz."', accept: 'Beraat ver', decline: 'Kanunu uygula', amount: 5000, forcedVerdict: 'release' },
            },
        ],

        // Evenings after days 16-29; days without an entry get a quiet scene
        evenings: {
            16: () => ({
                text: 'Lojmanın sobası tütüyor. Ece battaniyeye sarılmış, ağlıyor: "Arkadaşlarım yok burada." Annen öksürüyor. Deniz pencereden çamurlu sokağa bakıyor.',
                choices: [
                    choice('Ece\'nin yanına otur, hikâye anlat', s => { adjust(s, { harmony: 8 }); return 'Ece senin kucağında uyudu. Soba da sonunda alev aldı.'; }),
                    choice('Yarının dosyalarını oku', s => { adjust(s, { harmony: -5 }); s.bonusQuestions = 1; return 'Gece yarısına kadar dosyaları okudun. Yarın bir soru fazla sorabileceksin, ama ev sessizdi.'; }),
                ],
            }),
            18: () => ({
                text: 'Ece okuldan morarmış bir dizle döndü: "Vakfın torunu \'Senin ailen bizimkileri hapse atacakmış\' dedi, itti beni."',
                choices: [
                    choice('Okulla konuşmaya git', s => { adjust(s, { harmony: 5 }); return 'Müdür sana gözlerini kaçırarak dinledi: "Vakfın çocukları... anlarsınız."'; }),
                    choice('"Görmezden gel kızım."', s => { adjust(s, { harmony: -8 }); return 'Ece başını salladı ama ertesi sabah okula gitmek istemedi.'; }),
                ],
            }),
            20: () => ({
                text: 'Annen bahçedeki incir ağacına bakıyor: "Bu kasabanın insanı korkak değil evladım, korkutulmuş. Bir kişi dik durursa ötekiler de durur."',
                choices: [choice('Annenin elini tut', s => { adjust(s, { conscience: 5, harmony: 5 }); return 'O gece uzun zamandır ilk kez rahat uyudun.'; })],
            }),
            22: (s) => (s.specials.hasan && s.specials.hasan.verdict === 'release'
                ? one('Kapı çalındı. Hasan\'ın karısı elinde bir tencere yemekle duruyordu: "Kocam bu akşam evde. Size teşekkür etmeye geldim." Deniz ağladı.', 'Teşekkür et', st => { adjust(st, { harmony: 10 }); return 'Mutfak sıcacık yemek kokuyor. Kasabada bir dostunuz var artık.'; })
                : one('Ece sordu: "Gazeteci amcaya ne oldu? Okulda herkes onu konuşuyor."', '"Kanun neyse o oldu."', st => { adjust(st, { conscience: -4 }); return 'Ece bir şey demedi. Odasının ışığı gece geç saate kadar yandı.'; })),
            24: () => ({
                text: 'Sağlık ocağında annenin ilacı "bitmiş". Vakfın eczanesinde var, ama eczacı "Hacı Rıza Bey\'in misafirlerine ücretsiz" diyor.',
                choices: [
                    choice('Şehre gidip parayla al (₺150)', s => { adjust(s, { money: -150, health: 1 }); return 'Dört saat yol gittin. Annen ilacını aldı; borç kimseye değil, yola.'; }, 150),
                    choice('Vakfın ilacını kabul et', s => { adjust(s, { conscience: -6, health: 1 }); s.flags.vakifIlac = true; return 'Annen iyileşti. Kutunun üstünde vakfın mührü vardı.'; }),
                ],
            }),
            26: () => ({
                text: 'Deniz yorgun: "Burada kalırsak Ece büyüyünce bu kasabaya benzeyecek. Gidelim mi? Sen istifa et, şehre dönelim."',
                choices: [
                    choice('"Davayı bitirmeden gidemem."', s => { adjust(s, { harmony: -5, conscience: 4 }); return 'Deniz uzun süre sustu. Sonra "Tamam. Ama sonra gideriz" dedi.'; }),
                    choice('"Belki haklısın."', s => { adjust(s, { harmony: 8 }); return 'Deniz sana sarıldı. Gece ikiniz de uyuyamadınız.'; }),
                ],
            }),
            29: () => one('Yarın Hacı Rıza önüne çıkacak. Ece kapıdan baktı: "Korkuyor musun?"', '"Biraz. Ama doğru olanı yapacağım."', s => { adjust(s, { harmony: 5 }); return 'Ece gülümsedi ve ışığı kapattı.'; }),
        },

        quietEvening: (state) => quiet(state, [
            ['Karaçam\'da sakin bir akşam. Uzaktan bir köpek havlıyor, soba çıtırdıyor.', 'Gece sessiz geçti.'],
            ['Ece pencereden yıldızları sayıyor: "Burada şehirdekinden çok yıldız var."', 'Ece\'yle birlikte yıldız saydınız; on yediye kadar.'],
            ['Annen kasabanın pazarından ev yapımı tarhana almış. Mutfak çorba kokuyor.', 'Çorba sıcacıktı. Kasaba bir an daha az yabancı geldi.'],
            ['Deniz eski bir radyo bulmuş; cızırtılı bir türkü çalıyor.', 'Türkü bitene kadar kimse konuşmadı.'],
        ]),

        // Did the judge do the ağa\'s bidding? Lighter verdict for the ağa himself, or two favours
        favored(state) {
            const sp = state.specials;
            if (sp.aga && sp.aga.favored) return true;
            return ['imar', 'hasan', 'yurt', 'saldiri'].filter(k => sp[k] && sp[k].favored).length >= 2;
        },
        endings: {
            honest: {
                title: 'Kasabanın Hakimi',
                description: 'Kendinle gurur duy. Ne bakanlığa ne Hacı Rıza\'ya boyun eğdin. Kasaba adliyenin önünde seni alkışlarla uğurladı. Sen gerçek bir hakimsin.\n\nHikâye modu sona erdi.',
            },
            favored: {
                title: 'Emekli',
                description: 'Bazı şeylere göz yumdun ama doğru kararlar da verdin. Cübbeni son kez astın; artık emeklisin. Karaçam\'da Hacı Rıza\'nın tabelası hâlâ yerinde duruyor.\n\nHikâye modu sona erdi.',
            },
        },
    },

    // =====================================================================
    borc: {
        name: 'İkinci Perde: Borç',
        transition: {
            text: 'Akşam bakanlıktan bir kurye geldi. Zarfın içinde terfi yazısı: "Yüksek Mahkeme Ceza Dairesi üyeliğine seçildiniz." Yanında el yazısıyla bir not: "Bakan Bey teşekkürlerini iletir. Unutmayız."',
            choices: [
                choice('Şampanyayı aç', s => { adjust(s, { harmony: 8, conscience: -3 }); return 'Deniz kadehini kaldırdı ama "Unutmayız" sözü aklından çıkmadı.'; }),
                choice('Notu yırt', s => { adjust(s, { conscience: 4 }); return 'Kâğıt parçaları halıya döküldü. Borçlar yırtılarak ödenmez ama.'; }),
            ],
        },
        intro: {
            title: 'Yüksek Mahkeme',
            text: 'Yeni odan mermer. Pencereden başkentin bütün bakanlıkları görünüyor. Masanın üstünde bir çiçek ve kartı: "Hayırlı olsun. — Parti Genel Merkezi."\n\nDaire Başkanı Nazım Erdem elini sıktı: "Burada her dosyanın bir sahibi vardır hakim bey. Bazıları dosyayı, bazıları da hakimi sahiplenir."\n\nÖnünde on beş gün daha var. Bu kez yargılayacakların, seni terfi ettirenlerin ta kendileri olabilir.',
            button: 'Göreve Başla',
        },
        directives: [
            { text: 'Genel Merkez: "Devletin bekası için hassas olun."', crimeFilter: ['treason', 'pressCrime', 'terrorism'], bonus: 'jail', bonusAmount: 1.3 },
            { text: 'Bakanlık: İhale dosyalarında "kamu yararı" gözetilsin.', crimeFilter: ['bidRigging', 'corruption', 'fraud'], bonus: 'fine', bonusAmount: 1.3 },
            { text: 'Daire Başkanı: Dosyaları dikkatle okuyun.', crimeFilter: null, bonus: null, bonusAmount: 1 },
            { text: 'Başkentte bayram havası. Adliye yarı boş.', crimeFilter: null, bonus: null, bonusAmount: 1 },
        ],
        finalDirective: { text: 'Bütün ülke bugünkü davayı izliyor: Parti Genel Sekreteri Selami Kuru yargılanıyor.', crimeFilter: null, bonus: null, bonusAmount: 1 },

        beats: {
            17: () => ({
                icon: '⚖️', title: 'Daire Başkanı Nazım Erdem',
                text: 'Nazım Bey kapını kapattı: "Önümüzdeki günlerde bazı milletvekillerinin dosyaları gelecek. Savunma ihalesi. Yabancı bir şirket. Ben otuz yıldır buradayım hakim bey; dosyayı değil, vicdanınızı dinleyin."',
                choices: [{ label: 'Devam', value: true }],
            }),
            19: () => ({
                icon: '✉️', title: 'Savcı Elif Demir\'den Not',
                text: 'Genç savcı Elif Demir koridorda eline bir dosya tutuşturdu: "Üç milletvekili ve partinin genel sekreteri, savunma ihalesinin gizli teknik bilgilerini yabancı bir silah şirketine sattı. Delillerin hepsi burada. Beni susturmaya çalışacaklar."',
                choices: [{ label: 'Dosyayı al', value: 'take' }, { label: '"Beni karıştırma."', value: 'refuse' }],
                onChoice: (s, v) => { s.flags.elif = v; if (v === 'refuse') adjust(s, { conscience: -3 }); },
            }),
            21: (s) => ({
                icon: '🧺', title: 'Genel Merkezden Hediye',
                text: 'Evine büyük bir hediye sepeti geldi. Kartta: "Bakanımızın oğlunu unutmadığınız gibi, biz de sizi unutmuyoruz. Yaklaşan davalarda sağduyunuza güveniyoruz."',
                choices: [{ label: 'Sepeti geri gönder', value: 'return' }, { label: 'Sepeti tut', value: 'keep' }],
                onChoice: (st, v) => { if (v === 'keep') adjust(st, { conscience: -5, harmony: 3 }); else adjust(st, { conscience: 3 }); },
            }),
            24: (s) => {
                const e = s.specials.elif;
                if (e && e.verdict === 'death') return { icon: '🕯️', title: 'Sessizlik', text: 'Savcı Elif Demir\'in idamı haberlerde birkaç saniye geçti. Adliyede kimse onun adını anmıyor. Nazım Bey o gün odasından hiç çıkmadı.', choices: [{ label: 'Devam', value: true }], apply: { conscience: -12 } };
                if (e && e.favored) return { icon: '🔒', title: 'Ağır Ceza', text: 'Elif Demir cezaevine götürülürken kameralara döndü: "Delillerim mahkemede. Birileri onları okuyacak." Savcılar arasında sessiz bir öfke dolaşıyor.', choices: [{ label: 'Devam', value: true }], apply: { conscience: -6 } };
                return { icon: '📄', title: 'Elif\'in Mektubu', text: 'Elif Demir\'den kısa bir not: "Kanunun öngördüğü cezayı verdiniz, fazlasını değil. Delillerim artık savcılıkta. Gerisi sizin vicdanınıza kalmış."', choices: [{ label: 'Devam', value: true }], apply: { conscience: 4 } };
            },
            27: () => ({
                icon: '⚖️', title: 'Nazım Bey\'in Uyarısı',
                text: 'Nazım Bey çayını karıştırırken alçak sesle: "Başsavcılıkta bir ekip kurulmuş. Son yıllarda verilen kararları tek tek inceliyorlar. Kimin kime borcu olduğunu biliyorlar hakim bey."',
                choices: [{ label: 'Devam', value: true }],
            }),
            29: () => ({
                icon: '📞', title: 'Gece Yarısı Telefonu',
                text: 'Telefondaki ses tanıdık: "Yarın Selami Bey\'in davası. Bakanın oğlunu hatırlıyor musunuz hakim bey? Biz hatırlıyoruz. Borç ödenir."',
                choices: [{ label: 'Telefonu kapat', value: true }],
            }),
        },

        specials: [
            {
                day: 20, position: 'first', key: 'ferit', crimeType: 'treason', name: 'Ferit Ekinci', age: 54, gender: 'm', wants: 'lighter',
                statement: {
                    text: 'Ben milletin vekiliyim. Bu dava siyasi bir komplo!', emotion: 'proud', sympathy: false, law: 'base',
                    detail: 'Milletvekili Ferit Ekinci',
                    summary: 'İktidar partisi milletvekili. Savunma ihalesinin gizli teknik şartnamesini yabancı bir silah şirketine sattığı iddiasıyla yargılanıyor.',
                    evidence: ['Yabancı şirketin hesabından vekilin kayınbiraderine ₺30.000.000 aktarılmış.', 'Gizli şartname vekilin e-postasından şirketin yöneticisine gönderilmiş.'],
                    question: 'Şartname neden sizin e-postanızdan gitti?', answer: 'Hesabım ele geçirilmiş olmalı. Kayınbiraderimin işleri beni ilgilendirmez.',
                },
                offer: { icon: '📞', title: 'Parti Genel Merkezi', text: 'Telefondaki ses: "Ferit Bey partimizin değerli bir üyesidir. Beraat verin. Bakanın oğlunu nasıl anladıysanız, bunu da öyle anlayın."', accept: 'Beraat ver', decline: 'Kanunu uygula', amount: 3000, forcedVerdict: 'release' },
            },
            {
                day: 23, position: 'first', key: 'elif', crimeType: 'treason', name: 'Elif Demir', age: 31, gender: 'f', wants: 'harsher',
                statement: {
                    text: 'Vekillerin ihanetini belgeledim. Şimdi hain ben oldum.', emotion: 'defiant', sympathy: true, law: 'whistleblower',
                    detail: 'Savcı Elif Demir',
                    summary: 'Savcı. Milletvekillerinin yabancı şirketle yazışmalarını yetkisi dışında basına verdiği için "devlet sırrını ifşa" ve "vatana ihanet"le yargılanıyor.',
                    evidence: ['Belgeler yalnızca bir gazeteye verilmiş; hiçbir yabancı devlete ulaştırılmamış.', 'Yayımlanan belgelerin gerçek olduğu teknik incelemeyle doğrulandı.'],
                    question: 'Belgeleri neden basına verdiniz?', answer: 'Çünkü savcılıkta dosyayı üç kez rafa kaldırdılar. Başka kapı kalmadı.',
                },
                offer: { icon: '📞', title: 'Parti Genel Merkezi', text: '"Bu kadın devletin sırlarını sattı hakim bey. Örnek olsun diye idam verin. Karşılığında daire başkanlığı sizin."', accept: 'İdam ver', decline: 'Kanunu uygula', amount: 3000, forcedVerdict: 'death' },
            },
            {
                day: 26, position: 'first', key: 'nermin', crimeType: 'treason', name: 'Nermin Saygın', age: 48, gender: 'f', wants: 'lighter',
                statement: {
                    text: 'Yabancı şirketle görüştüm ama sadece yatırım konuştuk.', emotion: 'defiant', sympathy: false, law: 'base',
                    detail: 'Milletvekili Nermin Saygın',
                    summary: 'İktidar partisi milletvekili, Savunma Komisyonu üyesi. Komisyondaki gizli toplantı tutanaklarını yabancı silah şirketine verdiği iddiasıyla yargılanıyor.',
                    evidence: ['Gizli tutanakların fotoğrafları şirketin sunucusunda bulundu; fotoğraflar vekilin telefonuyla çekilmiş.', 'Vekilin yurt dışındaki hesabına şirketten düzenli ödeme yapılmış.'],
                    question: 'Tutanakların fotoğrafını neden çektiniz?', answer: 'Not almak için... Telefonum çalındı, biri göndermiş olmalı.',
                },
                offer: { icon: '📞', title: 'Parti Genel Merkezi', text: '"Nermin Hanım\'ın beraati partimiz için hayati. Bir de şunu bilin: Bakanın oğlunun dosyası hâlâ bizim çekmecemizde."', accept: 'Beraat ver', decline: 'Kanunu uygula', amount: 3000, forcedVerdict: 'release' },
            },
            {
                day: 28, position: 'first', key: 'cahit', crimeType: 'treason', name: 'Cahit Ural', age: 61, gender: 'm', wants: 'lighter',
                statement: {
                    text: 'Kızımın videolarıyla şantaj yaptılar. Vermezsem yayımlayacaklardı.', emotion: 'remorseful', sympathy: true, law: 'coerced',
                    detail: 'Milletvekili Cahit Ural',
                    summary: 'İktidar partisi milletvekili. Savunma projelerinin listesini yabancı şirkete verdi; şantajla zorlandığını söylüyor.',
                    evidence: ['Kızına ait özel görüntülerle yapılan şantaj mesajları telefonunda kayıtlı.', 'Hiçbir ödeme almadığı banka kayıtlarıyla doğrulandı.'],
                    question: 'Neden polise gitmediniz?', answer: 'Şantajı yapan partinin genel sekreterinin adamlarıydı. Kime gidecektim?',
                },
                offer: { icon: '📞', title: 'Parti Genel Merkezi', text: '"Cahit Bey\'i beraat ettirin; şantaj meselesi de kapansın. Kimse kimseyi suçlamasın, değil mi?"', accept: 'Beraat ver', decline: 'Kanunu uygula', amount: 3000, forcedVerdict: 'release' },
            },
            {
                day: 30, position: 'last', key: 'selami', crimeType: 'treason', name: 'Selami Kuru', age: 63, gender: 'm', wants: 'lighter', finalCase: true,
                statement: {
                    text: 'Bu ülkeyi ben yönetiyorum hakim bey. Siz de bizim sayemizde o koltuktasınız.', emotion: 'proud', sympathy: false, law: 'base',
                    detail: 'Genel Sekreter Selami Kuru',
                    summary: 'İktidar partisinin genel sekreteri. Savunma ihalesinin gizli bilgilerini yabancı silah şirketine satan çarkı kurup yönettiği, vekillere şantaj yaptırdığı iddiasıyla yargılanıyor.',
                    evidence: ['Yabancı şirketle imzalanmış gizli "danışmanlık" sözleşmesi: ₺200.000.000.', 'Cahit Ural\'a yapılan şantajın talimatının Selami Kuru\'nun telefonundan verildiği tespit edildi.'],
                    question: 'Sözleşmedeki imza sizin mi?', answer: 'İmza benim. Ama o sözleşmeyi bu salonda kimse yüksek sesle okuyamaz.',
                },
                offer: { icon: '📞', title: 'Başbakanlıktan Telefon', text: 'Bu kez ses çok daha yukarıdan geliyor: "Selami Bey beraat ederse Anayasa Mahkemesi üyeliğiniz hazır. Etmezse... bakanın oğlunun dosyasını savcılara biz veririz."', accept: 'Beraat ver', decline: 'Kanunu uygula', amount: 10000, forcedVerdict: 'release' },
            },
        ],

        evenings: {
            16: () => ({
                text: 'Yeni ev büyük ve soğuk. Ece kendi odasını beğendi ama "Burada kimse birbirini tanımıyor" dedi. Annen salondaki pahalı halıya basmaya çekiniyor.',
                choices: [
                    choice('Ailece yemeğe çık', s => { adjust(s, { harmony: 8, money: -100 }); return 'Lokantada herkes sana "Sayın Hakim" diye eğildi. Ece bundan hoşlanmadı.'; }, 100),
                    choice('Evde makarna yap', s => { adjust(s, { harmony: 5 }); return 'Mutfakta eski evdeki gibi güldünüz. Bir an her şey yerindeydi.'; }),
                ],
            }),
            18: () => ({
                text: 'Deniz telefonu kapattı, yüzü bembeyaz: "Bakanlıktan aradılar. İşimde terfi almışım. Hiç başvurmamıştım."',
                choices: [
                    choice('"Reddet."', s => { adjust(s, { harmony: -6, conscience: 5 }); return 'Deniz terfiyi reddetti. Ertesi gün masasının başka birine verildiğini öğrendi.'; }),
                    choice('"Hak ettin, kabul et."', s => { adjust(s, { harmony: 6, conscience: -6 }); s.flags.denizPromotion = true; return 'Deniz terfiyi kabul etti. Borcunuz bir kat daha arttı.'; }),
                ],
            }),
            20: (s) => (s.specials.ferit && s.specials.ferit.favored
                ? one('Haberlerde Ferit Ekinci mahkeme çıkışında alkışlanıyor. Ece televizyonu kapattı: "Hani bu adam vatanı satmıştı?"', '"Karmaşık bir dava kızım."', st => { adjust(st, { conscience: -5, harmony: -5 }); return 'Ece odasına gitti. "Karmaşık" kelimesi evin içinde yankılandı.'; })
                : one('Haberlerde Ferit Ekinci\'nin cezası tartışılıyor. Annen sana baktı: "Seni bu yüzden mi oraya koydular sanıyorsun? Aksine."', '"Biliyorum anne."', st => { adjust(st, { conscience: 4 }); return 'Annen başını salladı: "Babana çekmişsin."'; })),
            22: () => ({
                text: 'Ece okulda "hakim çocuğu" diye özel muamele görüyor; öğretmeni notunu yükseltmiş.',
                choices: [
                    choice('Okula gidip düzelt', s => { adjust(s, { harmony: 4, conscience: 4 }); return 'Öğretmen şaşırdı: "Kimse itiraz etmezdi bugüne kadar."'; }),
                    choice('Karışma', s => { adjust(s, { conscience: -4 }); return 'Ece karnesine baktı, sevinmedi.'; }),
                ],
            }),
            25: () => ({
                text: 'Annen gece fenalaştı. Devlet hastanesinde yer yok; partinin tanıdığı özel hastane "ücretsiz" kabul edebileceğini söylüyor.',
                choices: [
                    choice('Parasını öde (₺300)', s => { adjust(s, { money: -300, health: 2 }); return 'Annen kurtuldu. Faturayı kendi cebinden ödedin.'; }, 300),
                    choice('Partinin teklifini kabul et', s => { adjust(s, { health: 2, conscience: -8 }); s.flags.partyHospital = true; return 'Annen kurtuldu. Hastane müdürü "Genel Merkez geçmiş olsun diyor" dedi.'; }),
                ],
            }),
            27: () => ({
                text: 'Deniz ciddi: "Savcılar eski dosyaları inceliyormuş. Bakanın oğlunun dosyası da aralarında olabilir mi?"',
                choices: [
                    choice('"Olabilir. Ne olacaksa olsun."', s => { adjust(s, { conscience: 5, harmony: -3 }); return 'Deniz sana sarıldı: "O zaman bundan sonra doğruyu yap."'; }),
                    choice('"Merak etme, korunuyoruz."', s => { adjust(s, { conscience: -5 }); return 'Deniz sustu. "Korunuyoruz" kelimesi ikinizi de ürpertti.'; }),
                ],
            }),
            29: () => one('Yarın son dava. Ece yatmadan önce sordu: "Sen iyi bir hakim misin?"', '"Yarın göreceğiz kızım."', s => { adjust(s, { harmony: 3 }); return 'Ece gülümsedi ve ışığı kapattı. Sen sabaha kadar uyuyamadın.'; }),
        },

        quietEvening: (state) => quiet(state, [
            ['Başkentte trafiğin uğultusu. Salon sessiz, televizyon kapalı.', 'Gece sessiz geçti.'],
            ['Ece yeni okulundan bir resim getirmiş: eski evinizin önünde dört kişi.', 'Resmi buzdolabına astınız.'],
            ['Annen balkonda simit kırıntısıyla güvercin besliyor: "Burada kuşlar bile resmi."', 'Güldünüz. Güvercinler kırıntıları bitirince uçup gitti.'],
            ['Deniz eski fotoğrafları karıştırıyor; ilk evinizin mutfağında çekilmiş bir kare.', 'O küçük mutfağı ikiniz de özlediniz.'],
        ]),

        // Covered up the treason: a lighter verdict for the ringleader, or two favours
        favored(state) {
            const sp = state.specials;
            if (sp.selami && sp.selami.favored) return true;
            return ['ferit', 'elif', 'nermin', 'cahit'].filter(k => sp[k] && sp[k].favored).length >= 2;
        },
        endings: {
            honest: {
                title: 'Emekli',
                description: 'Bazı şeylere göz yumdun ama doğru kararlar da verdin. Bakanın oğlunun dosyası hâlâ bir çekmecede, ama vatanını satanları kanunla yargıladın. Cübbeni son kez astın; artık emeklisin.\n\nHikâye modu sona erdi.',
            },
            favored: {
                title: 'İdam',
                description: 'Devletin onurlu savcıları, verdiğin hukuka aykırı kararları tek tek tespit etti. Kutsal yargı görevini kötüye kullanarak vatana ihanet ettiğin için idamına karar verildi.\n\nBir zamanlar oturduğun kürsünün karşısında, sanık sandalyesinde son kez oturdun.\n\nHikâye modu sona erdi.',
            },
        },
    },
};
