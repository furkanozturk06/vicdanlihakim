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
import { L } from './i18n.js';

export const ACT_LENGTH = 15;
export const TOTAL_DAYS = 30;
export const ACT2_CASES_PER_DAY = 4;

const one = (text, label, apply = () => '') => ({ text, choices: [choice(label, apply)] });

// A calm evening, one of a few, chosen by day so it does not repeat back to back
const quiet = (state, options) => {
    const [text, result] = options[state.day % options.length];
    return one(text, L('Dinlen'), s => { adjust(s, { harmony: 2 }); return result; });
};

// Branch from the day-15 verdict on the minister\'s son
export function branchFor(finale) {
    return finale === 'correct' || finale === 'harsh' ? 'surgun' : 'borc';
}

export const BRANCHES = {
    // =====================================================================
    surgun: {
        name: L('İkinci Perde: Sürgün'),
        transition: {
            text: L('Akşam bakanlıktan tebligat geldi: "Karaçam Asliye Ceza Mahkemesine atandınız. Göreve başlama: üç gün içinde." Deniz kâğıdı iki kez okudu. Ece "Karaçam neresi?" diye sordu. Haritada bulmanız on dakika sürdü.'),
            choices: [
                choice(L('"Kanunu uyguladık, bedelini ödeyeceğiz."'), s => { adjust(s, { conscience: 5 }); return L('Deniz elini omzuna koydu: "Doğrusunu yaptın. Gerisini birlikte hallederiz."'); }),
                choice(L('Bakanlığı arayıp tayini geri aldırmayı dene'), s => { adjust(s, { conscience: -3 }); return L('Telefondaki ses güldü: "Karaçam\'ın havası iyi gelir size, Hakim Bey." Telefon kapandı.'); }),
            ],
        },
        intro: {
            title: L('Karaçam'),
            text: L('Kasabaya giden tek yol çamurlu. Adliye binası eski bir han. Kapıdaki tabelanın yanında daha büyük bir tabela var: "Hikmet Vakfı – Hacı Rıza Karaca\'nın himayesinde."\n\nKâtip fısıldıyor: "Burada her şey Hacı Rıza Bey\'den sorulur, hakim bey. Vakfın Ankara\'da da dostları vardır."\n\nKarşında on beş gün daha var. Bu kez seni deneyen bir bakanlık değil, bütün bir kasaba.'),
            button: L('Adliyeye Gir'),
        },
        directives: [
            { text: L('Belediye: Pazar esnafına anlayış gösterilmesi rica olunur.'), crimeFilter: ['landDispute', 'pettyTheft', 'vandalism'], bonus: 'fine', bonusAmount: 1.3 },
            { text: L('Vakıf: "Kasabanın huzuru için sert kararlar bekliyoruz."'), crimeFilter: ['bloodFeud', 'assault', 'organizedCrime'], bonus: 'jail', bonusAmount: 1.3 },
            { text: L('Kaymakamlık: Seçim döneminde dikkatli olun.'), crimeFilter: ['election', 'defamation'], bonus: null, bonusAmount: 1 },
            { text: L('Sakin bir gün. Kasabada yağmur yağıyor.'), crimeFilter: null, bonus: null, bonusAmount: 1 },
        ],
        finalDirective: { text: L('Bütün kasaba adliyenin önünde. Bugün Hacı Rıza Karaca yargılanıyor.'), crimeFilter: null, bonus: null, bonusAmount: 1 },

        // Morning story beats
        beats: {
            17: () => ({
                icon: '🏛️', title: L('Belediye Başkanının Ziyareti'),
                text: L('Belediye Başkanı Sabri Öz odana elinde lokumla girdi: "Hoş geldiniz hakim bey. Kasabamızda işler Hacı Rıza Bey\'in bilgisi dahilinde yürür. Siz de rahat edersiniz, biz de."'),
                choices: [{ label: L('"Kanun herkese eşittir."'), value: 'stand' }, { label: L('Lokumu al, sessiz kal'), value: 'quiet' }],
                onChoice: (s, v) => { s.flags.mayor = v; if (v === 'quiet') adjust(s, { conscience: -3 }); },
            }),
            18: () => ({
                icon: '📰', title: L('Karaçam Postası'),
                text: L('Yerel gazetenin sahibi ve tek muhabiri Hasan Ulu adliye çıkışında yanına yaklaştı: "Vakfın yurtlarında çocuklar çalıştırılıyor, belediyenin ihaleleri vakfa gidiyor. Hepsini yazıyorum. Bir gün beni de önünüze getirecekler."'),
                choices: [{ label: L('Devam'), value: true }],
            }),
            21: (s) => (s.specials.imar && s.specials.imar.favored
                ? { icon: '🧺', title: L('Vakıftan Bir Sepet'), text: L('Kapına vakıftan bir erzak sepeti bırakılmış: yağ, şeker, bir de Ece için oyuncak. Kartta "Hacı Rıza Bey\'in selamıyla" yazıyor.'), choices: [{ label: L('Devam'), value: true }], apply: { conscience: -4 } }
                : { icon: '🚰', title: L('Suyunuz Kesildi'), text: L('Sabah musluklardan su akmadı. Belediyeden gelen görevli omuz silkti: "Arıza var, hakim bey. Ne zaman düzelir, Hacı Rıza Bey bilir."'), choices: [{ label: L('Devam'), value: true }], apply: { harmony: -8 } }),
            23: () => ({
                icon: '🩺', title: L('Doktor Leyla Tan'),
                text: L('Sağlık ocağının genç doktoru Leyla Tan annenin kontrolünden sonra seni kenara çekti: "Vakfın yurdunda geçen ay bir öğrenci öldü. Rapora \'kaza\' yazmamı istediler, yazmadım. Dosya size gelecek. Ben gerçeği söyleyeceğim."'),
                choices: [{ label: L('Devam'), value: true }],
            }),
            27: (s) => {
                const h = s.specials.hasan;
                if (h && h.verdict === 'release') return { icon: '📰', title: L('Karaçam Postası Yeniden Çıktı'), text: L('Hasan\'ın gazetesinin manşeti: "Vakfın yurtlarında neler oluyor?" Kasaba gazeteyi elden ele dolaştırıyor. Hasan sana bir not bırakmış: "Teşekkürler. Korkmadığınız için."'), choices: [{ label: L('Devam'), value: true }], apply: { reputation: 6 } };
                return { icon: '🔒', title: L('Kapanan Gazete'), text: L('Karaçam Postası\'nın kepenkleri indirilmiş. Kasabada kimse Hasan\'ın adını yüksek sesle anmıyor.'), choices: [{ label: L('Devam'), value: true }], apply: { conscience: -6 } };
            },
            29: (s) => ({
                icon: '🩺', title: L('Son Uyarı'),
                text: s.flags.mayor === 'stand'
                    ? L('Doktor Leyla akşam kapını çaldı: "Yarın Hacı Rıza\'nın kendisi önünüze çıkacak. Ankara\'dan aramalar başladı bile. Kasaba sizi izliyor. Biz de."')
                    : L('Belediye Başkanı Sabri Öz telefonda: "Yarınki dosya bir formalite hakim bey. Hacı Rıza Bey vakfın başında kalırsa kasaba için iyi olur. Sizin için de."'),
                choices: [{ label: L('Devam'), value: true }],
            }),
        },

        // Cases tied to the story. position: 'first' or 'last' case of the day.
        specials: [
            {
                day: 19, position: 'first', key: 'imar', crimeType: 'corruption', name: L('Kenan Yıldız'), age: 51, gender: 'm', wants: 'lighter',
                statement: {
                    text: L('Vakfın yurt binalarına izin verdim, evet. Kasabaya hayır yapıyorlar.'), emotion: 'proud', sympathy: false, law: 'bribery',
                    detail: L('Vakfın imar izinleri'),
                    summary: L('Belediye imar müdürüyken Hikmet Vakfı\'nın orman arazisine yaptığı yurt binalarına, karşılığında para alarak izin verdi.'),
                    evidence: [L('Hesabına vakıftan "danışmanlık ücreti" adıyla ₺1.800.000 yatırılmış.'), L('Binaların hiçbirinin deprem raporu yok.')],
                    question: L('Vakıftan para aldın mı?'), answer: L('Danışmanlık yaptım. Hacı Rıza Bey cömert biridir.'),
                },
                offer: { icon: '🧔', title: L('Hacı Rıza\'dan Haber'), text: L('Kâtip kapıyı kapatıp fısıldadı: "Hacı Rıza Bey selam söyledi. Kenan Bey\'e beraat verirseniz kasabada her kapı size açılır. Bir de şu zarf..."'), accept: L('Beraat ver'), decline: L('Kanunu uygula'), amount: 1500, forcedVerdict: 'release' },
            },
            {
                day: 22, position: 'first', key: 'hasan', crimeType: 'defamation', name: L('Hasan Ulu'), age: 46, gender: 'm', wants: 'harsher',
                statement: {
                    text: L('Yazdığım her satırın belgesi var. İftira değil, gerçek bu.'), emotion: 'defiant', sympathy: true, law: 'truth',
                    detail: L('Muhabir Hasan Ulu'),
                    summary: L('Karaçam Postası\'nda Hikmet Vakfı\'nın yurtlarında çocukların ücretsiz çalıştırıldığını yazdı. Vakıf "iftira" diye şikayetçi oldu.'),
                    evidence: [L('Haberdeki çocukların bordrosuz çalıştırıldığı iş müfettişi raporuyla doğrulandı.'), L('Haberde adı geçen üç çocuk mahkemede ifade vermeye hazır.')],
                    question: L('Belgelerini nereden aldın?'), answer: L('Çocukların kendisinden. Bir de vicdanı olan bir yurt aşçısından.'),
                },
                offer: { icon: '🧔', title: L('Vakıftan Telefon'), text: L('Hacı Rıza bizzat aradı, sesi yumuşak: "Hasan kasabanın huzurunu bozuyor hakim bey. Ona ağır bir ceza verin ki herkes haddini bilsin. Karşılığını görürsünüz."'), accept: L('Hapis ver'), decline: L('Kanunu uygula'), amount: 1500, forcedVerdict: 'jail-medium' },
            },
            {
                day: 25, position: 'first', key: 'yurt', crimeType: 'murder', name: L('Necmi Aksoy'), age: 58, gender: 'm', wants: 'lighter',
                statement: {
                    text: L('Kapıyı ben kilitlemedim! Yönetim öyle istedi, çocuklar kaçmasın diye.'), emotion: 'panicked', sympathy: false, law: 'negligent',
                    detail: L('Vakıf yurdu yangını'),
                    summary: L('Hikmet Vakfı yurdunun müdürüyken yangın çıkış kapılarını geceleri kilitletti. Çıkan yangında bir öğrenci hayatını kaybetti.'),
                    evidence: [L('Doktor Leyla Tan\'ın raporu: öğrenci dumandan, kilitli kapının önünde öldü.'), L('Kapıları kilitleme talimatının müdürün imzasıyla asıldığı tespit edildi.')],
                    question: L('Kapıları neden kilitlediniz?'), answer: L('Çocuklar geceleri kaçıyordu. Vakıf "Bir tane daha kaçarsa sen sorumlusun" dedi.'),
                },
                offer: { icon: '🧔', title: L('Vakfın Avukatı'), text: L('Vakfın avukatı masana bir dosya bıraktı: "Kaza, hakim bey. Müdür beraat ederse vakıf kasabaya yeni bir okul yaptıracak. Adınızı da koyarız."'), accept: L('Beraat ver'), decline: L('Kanunu uygula'), amount: 1500, forcedVerdict: 'release' },
            },
            {
                day: 28, position: 'first', key: 'saldiri', crimeType: 'assault', name: L('Rüstem Kaya'), age: 34, gender: 'm', wants: 'lighter',
                statement: {
                    text: L('Doktor haddini bilseydi bunlar olmazdı.'), emotion: 'defiant', sympathy: false, law: 'serious',
                    detail: L('Sağlık ocağı baskını'),
                    summary: L('Hikmet Vakfı\'nın korumasıyken, yurt davasında ifade veren Doktor Leyla Tan\'ın sağlık ocağını bastı; doktoru tehdit edip araya giren hemşireyi dövdü.'),
                    evidence: [L('Hemşirenin kolu ve iki kaburgası kırıldı.'), L('Sağlık ocağının kamerasında yüzü açıkça görülüyor; telefonunda "Doktora ders verin" mesajı var.')],
                    question: L('Bu mesajı kim gönderdi?'), answer: L('Vakıfta emir yukarıdan gelir. Ben aşağıdayım.'),
                },
                offer: { icon: '🧔', title: L('Hacı Rıza\'dan Haber'), text: L('Kâtip yine fısıldıyor: "Rüstem, Hacı Rıza Bey\'in yeğeni. Beraat ederse siz de bir şey kaybetmezsiniz."'), accept: L('Beraat ver'), decline: L('Kanunu uygula'), amount: 1500, forcedVerdict: 'release' },
            },
            {
                day: 30, position: 'last', key: 'aga', crimeType: 'organizedCrime', name: L('Hacı Rıza Karaca'), age: 67, gender: 'm', wants: 'lighter', finalCase: true,
                statement: {
                    text: L('Bu kasabaya okul, cami, yol yaptım. Beni sen mi yargılayacaksın?'), emotion: 'proud', sympathy: false, law: 'leader',
                    detail: L('Hacı Rıza Karaca'),
                    summary: L('Hikmet Vakfı\'nın lideri. Vakıf aracılığıyla haraç, kayıt dışı çocuk işçiliği, ihale rüşveti ve tehdit çarkını yönettiği iddiasıyla yargılanıyor.'),
                    evidence: [L('Vakfın gizli defterleri: esnaftan haraç, belediyeden ihale payı ve korumalara ödemeler Hacı Rıza\'nın imzasıyla onaylanmış.'), L('Korumaların ve yurt müdürünün ifadeleri talimatların doğrudan ondan geldiğini söylüyor.')],
                    question: L('Defterlerdeki imza kimin?'), answer: L('Benim. Ama o defterleri okuyacak cesaret kimde var, hakim bey?'),
                },
                offer: { icon: '📞', title: L('Ankara\'dan Telefon'), text: L('Bakanlıktan aynı tanıdık ses: "Hacı Rıza Bey devletimizin dostudur. Beraat verin; Ankara\'ya tayininiz ve ₺5000 hazır. Karaçam\'ı unutursunuz."'), accept: L('Beraat ver'), decline: L('Kanunu uygula'), amount: 5000, forcedVerdict: 'release' },
            },
        ],

        // Evenings after days 16-29; days without an entry get a quiet scene
        evenings: {
            16: () => ({
                text: L('Lojmanın sobası tütüyor. Ece battaniyeye sarılmış, ağlıyor: "Arkadaşlarım yok burada." Annen öksürüyor. Deniz pencereden çamurlu sokağa bakıyor.'),
                choices: [
                    choice(L('Ece\'nin yanına otur, hikâye anlat'), s => { adjust(s, { harmony: 8 }); return L('Ece senin kucağında uyudu. Soba da sonunda alev aldı.'); }),
                    choice(L('Yarının dosyalarını oku'), s => { adjust(s, { harmony: -5 }); s.bonusQuestions = 1; return L('Gece yarısına kadar dosyaları okudun. Yarın bir soru fazla sorabileceksin, ama ev sessizdi.'); }),
                ],
            }),
            18: () => ({
                text: L('Ece okuldan morarmış bir dizle döndü: "Vakfın torunu \'Senin ailen bizimkileri hapse atacakmış\' dedi, itti beni."'),
                choices: [
                    choice(L('Okulla konuşmaya git'), s => { adjust(s, { harmony: 5 }); return L('Müdür sana gözlerini kaçırarak dinledi: "Vakfın çocukları... anlarsınız."'); }),
                    choice(L('"Görmezden gel kızım."'), s => { adjust(s, { harmony: -8 }); return L('Ece başını salladı ama ertesi sabah okula gitmek istemedi.'); }),
                ],
            }),
            20: () => ({
                text: L('Annen bahçedeki incir ağacına bakıyor: "Bu kasabanın insanı korkak değil evladım, korkutulmuş. Bir kişi dik durursa ötekiler de durur."'),
                choices: [choice(L('Annenin elini tut'), s => { adjust(s, { conscience: 5, harmony: 5 }); return L('O gece uzun zamandır ilk kez rahat uyudun.'); })],
            }),
            22: (s) => (s.specials.hasan && s.specials.hasan.verdict === 'release'
                ? one(L('Kapı çalındı. Hasan\'ın karısı elinde bir tencere yemekle duruyordu: "Kocam bu akşam evde. Size teşekkür etmeye geldim." Deniz ağladı.'), L('Teşekkür et'), st => { adjust(st, { harmony: 10 }); return L('Mutfak sıcacık yemek kokuyor. Kasabada bir dostunuz var artık.'); })
                : one(L('Ece sordu: "Gazeteci amcaya ne oldu? Okulda herkes onu konuşuyor."'), L('"Kanun neyse o oldu."'), st => { adjust(st, { conscience: -4 }); return L('Ece bir şey demedi. Odasının ışığı gece geç saate kadar yandı.'); })),
            24: () => ({
                text: L('Sağlık ocağında annenin ilacı "bitmiş". Vakfın eczanesinde var, ama eczacı "Hacı Rıza Bey\'in misafirlerine ücretsiz" diyor.'),
                choices: [
                    choice(L('Şehre gidip parayla al (₺150)'), s => { adjust(s, { money: -150, health: 1 }); return L('Dört saat yol gittin. Annen ilacını aldı; borç kimseye değil, yola.'); }, 150),
                    choice(L('Vakfın ilacını kabul et'), s => { adjust(s, { conscience: -6, health: 1 }); s.flags.vakifIlac = true; return L('Annen iyileşti. Kutunun üstünde vakfın mührü vardı.'); }),
                ],
            }),
            26: () => ({
                text: L('Deniz yorgun: "Burada kalırsak Ece büyüyünce bu kasabaya benzeyecek. Gidelim mi? Sen istifa et, şehre dönelim."'),
                choices: [
                    choice(L('"Davayı bitirmeden gidemem."'), s => { adjust(s, { harmony: -5, conscience: 4 }); return L('Deniz uzun süre sustu. Sonra "Tamam. Ama sonra gideriz" dedi.'); }),
                    choice(L('"Belki haklısın."'), s => { adjust(s, { harmony: 8 }); return L('Deniz sana sarıldı. Gece ikiniz de uyuyamadınız.'); }),
                ],
            }),
            29: () => one(L('Yarın Hacı Rıza önüne çıkacak. Ece kapıdan baktı: "Korkuyor musun?"'), L('"Biraz. Ama doğru olanı yapacağım."'), s => { adjust(s, { harmony: 5 }); return L('Ece gülümsedi ve ışığı kapattı.'); }),
        },

        quietEvening: (state) => quiet(state, [
            [L('Karaçam\'da sakin bir akşam. Uzaktan bir köpek havlıyor, soba çıtırdıyor.'), L('Gece sessiz geçti.')],
            [L('Ece pencereden yıldızları sayıyor: "Burada şehirdekinden çok yıldız var."'), L('Ece\'yle birlikte yıldız saydınız; on yediye kadar.')],
            [L('Annen kasabanın pazarından ev yapımı tarhana almış. Mutfak çorba kokuyor.'), L('Çorba sıcacıktı. Kasaba bir an daha az yabancı geldi.')],
            [L('Deniz eski bir radyo bulmuş; cızırtılı bir türkü çalıyor.'), L('Türkü bitene kadar kimse konuşmadı.')],
        ]),

        // Did the judge do the ağa\'s bidding? Lighter verdict for the ağa himself, or two favours
        favored(state) {
            const sp = state.specials;
            if (sp.aga && sp.aga.favored) return true;
            return ['imar', 'hasan', 'yurt', 'saldiri'].filter(k => sp[k] && sp[k].favored).length >= 2;
        },
        endings: {
            honest: {
                title: L('Kasabanın Hakimi'),
                description: L('Kendinle gurur duy. Ne bakanlığa ne Hacı Rıza\'ya boyun eğdin. Kasaba adliyenin önünde seni alkışlarla uğurladı. Sen gerçek bir hakimsin.\n\nHikâye modu sona erdi.'),
            },
            favored: {
                title: L('Emekli'),
                description: L('Bazı şeylere göz yumdun ama doğru kararlar da verdin. Cübbeni son kez astın; artık emeklisin. Karaçam\'da Hacı Rıza\'nın tabelası hâlâ yerinde duruyor.\n\nHikâye modu sona erdi.'),
            },
        },
    },

    // =====================================================================
    borc: {
        name: L('İkinci Perde: Borç'),
        transition: {
            text: L('Akşam bakanlıktan bir kurye geldi. Zarfın içinde terfi yazısı: "Yüksek Mahkeme Ceza Dairesi üyeliğine seçildiniz." Yanında el yazısıyla bir not: "Bakan Bey teşekkürlerini iletir. Unutmayız."'),
            choices: [
                choice(L('Şampanyayı aç'), s => { adjust(s, { harmony: 8, conscience: -3 }); return L('Deniz kadehini kaldırdı ama "Unutmayız" sözü aklından çıkmadı.'); }),
                choice(L('Notu yırt'), s => { adjust(s, { conscience: 4 }); return L('Kâğıt parçaları halıya döküldü. Borçlar yırtılarak ödenmez ama.'); }),
            ],
        },
        intro: {
            title: L('Yüksek Mahkeme'),
            text: L('Yeni odan mermer. Pencereden başkentin bütün bakanlıkları görünüyor. Masanın üstünde bir çiçek ve kartı: "Hayırlı olsun. — Parti Genel Merkezi."\n\nDaire Başkanı Nazım Erdem elini sıktı: "Burada her dosyanın bir sahibi vardır hakim bey. Bazıları dosyayı, bazıları da hakimi sahiplenir."\n\nÖnünde on beş gün daha var. Bu kez yargılayacakların, seni terfi ettirenlerin ta kendileri olabilir.'),
            button: L('Göreve Başla'),
        },
        directives: [
            { text: L('Genel Merkez: "Devletin bekası için hassas olun."'), crimeFilter: ['treason', 'pressCrime', 'terrorism'], bonus: 'jail', bonusAmount: 1.3 },
            { text: L('Bakanlık: İhale dosyalarında "kamu yararı" gözetilsin.'), crimeFilter: ['bidRigging', 'corruption', 'fraud'], bonus: 'fine', bonusAmount: 1.3 },
            { text: L('Daire Başkanı: Dosyaları dikkatle okuyun.'), crimeFilter: null, bonus: null, bonusAmount: 1 },
            { text: L('Başkentte bayram havası. Adliye yarı boş.'), crimeFilter: null, bonus: null, bonusAmount: 1 },
        ],
        finalDirective: { text: L('Bütün ülke bugünkü davayı izliyor: Parti Genel Sekreteri Selami Kuru yargılanıyor.'), crimeFilter: null, bonus: null, bonusAmount: 1 },

        beats: {
            17: () => ({
                icon: '⚖️', title: L('Daire Başkanı Nazım Erdem'),
                text: L('Nazım Bey kapını kapattı: "Önümüzdeki günlerde bazı milletvekillerinin dosyaları gelecek. Savunma ihalesi. Yabancı bir şirket. Ben otuz yıldır buradayım hakim bey; dosyayı değil, vicdanınızı dinleyin."'),
                choices: [{ label: L('Devam'), value: true }],
            }),
            19: () => ({
                icon: '✉️', title: L('Savcı Elif Demir\'den Not'),
                text: L('Genç savcı Elif Demir koridorda eline bir dosya tutuşturdu: "Üç milletvekili ve partinin genel sekreteri, savunma ihalesinin gizli teknik bilgilerini yabancı bir silah şirketine sattı. Delillerin hepsi burada. Beni susturmaya çalışacaklar."'),
                choices: [{ label: L('Dosyayı al'), value: 'take' }, { label: L('"Beni karıştırma."'), value: 'refuse' }],
                onChoice: (s, v) => { s.flags.elif = v; if (v === 'refuse') adjust(s, { conscience: -3 }); },
            }),
            21: (s) => ({
                icon: '🧺', title: L('Genel Merkezden Hediye'),
                text: L('Evine büyük bir hediye sepeti geldi. Kartta: "Bakanımızın oğlunu unutmadığınız gibi, biz de sizi unutmuyoruz. Yaklaşan davalarda sağduyunuza güveniyoruz."'),
                choices: [{ label: L('Sepeti geri gönder'), value: 'return' }, { label: L('Sepeti tut'), value: 'keep' }],
                onChoice: (st, v) => { if (v === 'keep') adjust(st, { conscience: -5, harmony: 3 }); else adjust(st, { conscience: 3 }); },
            }),
            24: (s) => {
                const e = s.specials.elif;
                if (e && e.verdict === 'death') return { icon: '🕯️', title: L('Sessizlik'), text: L('Savcı Elif Demir\'in idamı haberlerde birkaç saniye geçti. Adliyede kimse onun adını anmıyor. Nazım Bey o gün odasından hiç çıkmadı.'), choices: [{ label: L('Devam'), value: true }], apply: { conscience: -12 } };
                if (e && e.favored) return { icon: '🔒', title: L('Ağır Ceza'), text: L('Elif Demir cezaevine götürülürken kameralara döndü: "Delillerim mahkemede. Birileri onları okuyacak." Savcılar arasında sessiz bir öfke dolaşıyor.'), choices: [{ label: L('Devam'), value: true }], apply: { conscience: -6 } };
                return { icon: '📄', title: L('Elif\'in Mektubu'), text: L('Elif Demir\'den kısa bir not: "Kanunun öngördüğü cezayı verdiniz, fazlasını değil. Delillerim artık savcılıkta. Gerisi sizin vicdanınıza kalmış."'), choices: [{ label: L('Devam'), value: true }], apply: { conscience: 4 } };
            },
            27: () => ({
                icon: '⚖️', title: L('Nazım Bey\'in Uyarısı'),
                text: L('Nazım Bey çayını karıştırırken alçak sesle: "Başsavcılıkta bir ekip kurulmuş. Son yıllarda verilen kararları tek tek inceliyorlar. Kimin kime borcu olduğunu biliyorlar hakim bey."'),
                choices: [{ label: L('Devam'), value: true }],
            }),
            29: () => ({
                icon: '📞', title: L('Gece Yarısı Telefonu'),
                text: L('Telefondaki ses tanıdık: "Yarın Selami Bey\'in davası. Bakanın oğlunu hatırlıyor musunuz hakim bey? Biz hatırlıyoruz. Borç ödenir."'),
                choices: [{ label: L('Telefonu kapat'), value: true }],
            }),
        },

        specials: [
            {
                day: 20, position: 'first', key: 'ferit', crimeType: 'treason', name: L('Ferit Ekinci'), age: 54, gender: 'm', wants: 'lighter',
                statement: {
                    text: L('Ben milletin vekiliyim. Bu dava siyasi bir komplo!'), emotion: 'proud', sympathy: false, law: 'base',
                    detail: L('Milletvekili Ferit Ekinci'),
                    summary: L('İktidar partisi milletvekili. Savunma ihalesinin gizli teknik şartnamesini yabancı bir silah şirketine sattığı iddiasıyla yargılanıyor.'),
                    evidence: [L('Yabancı şirketin hesabından vekilin kayınbiraderine ₺30.000.000 aktarılmış.'), L('Gizli şartname vekilin e-postasından şirketin yöneticisine gönderilmiş.')],
                    question: L('Şartname neden sizin e-postanızdan gitti?'), answer: L('Hesabım ele geçirilmiş olmalı. Kayınbiraderimin işleri beni ilgilendirmez.'),
                },
                offer: { icon: '📞', title: L('Parti Genel Merkezi'), text: L('Telefondaki ses: "Ferit Bey partimizin değerli bir üyesidir. Beraat verin. Bakanın oğlunu nasıl anladıysanız, bunu da öyle anlayın."'), accept: L('Beraat ver'), decline: L('Kanunu uygula'), amount: 3000, forcedVerdict: 'release' },
            },
            {
                day: 23, position: 'first', key: 'elif', crimeType: 'treason', name: L('Elif Demir'), age: 31, gender: 'f', wants: 'harsher',
                statement: {
                    text: L('Vekillerin ihanetini belgeledim. Şimdi hain ben oldum.'), emotion: 'defiant', sympathy: true, law: 'whistleblower',
                    detail: L('Savcı Elif Demir'),
                    summary: L('Savcı. Milletvekillerinin yabancı şirketle yazışmalarını yetkisi dışında basına verdiği için "devlet sırrını ifşa" ve "vatana ihanet"le yargılanıyor.'),
                    evidence: [L('Belgeler yalnızca bir gazeteye verilmiş; hiçbir yabancı devlete ulaştırılmamış.'), L('Yayımlanan belgelerin gerçek olduğu teknik incelemeyle doğrulandı.')],
                    question: L('Belgeleri neden basına verdiniz?'), answer: L('Çünkü savcılıkta dosyayı üç kez rafa kaldırdılar. Başka kapı kalmadı.'),
                },
                offer: { icon: '📞', title: L('Parti Genel Merkezi'), text: L('"Bu kadın devletin sırlarını sattı hakim bey. Örnek olsun diye idam verin. Karşılığında daire başkanlığı sizin."'), accept: L('İdam ver'), decline: L('Kanunu uygula'), amount: 3000, forcedVerdict: 'death' },
            },
            {
                day: 26, position: 'first', key: 'nermin', crimeType: 'treason', name: L('Nermin Saygın'), age: 48, gender: 'f', wants: 'lighter',
                statement: {
                    text: L('Yabancı şirketle görüştüm ama sadece yatırım konuştuk.'), emotion: 'defiant', sympathy: false, law: 'base',
                    detail: L('Milletvekili Nermin Saygın'),
                    summary: L('İktidar partisi milletvekili, Savunma Komisyonu üyesi. Komisyondaki gizli toplantı tutanaklarını yabancı silah şirketine verdiği iddiasıyla yargılanıyor.'),
                    evidence: [L('Gizli tutanakların fotoğrafları şirketin sunucusunda bulundu; fotoğraflar vekilin telefonuyla çekilmiş.'), L('Vekilin yurt dışındaki hesabına şirketten düzenli ödeme yapılmış.')],
                    question: L('Tutanakların fotoğrafını neden çektiniz?'), answer: L('Not almak için... Telefonum çalındı, biri göndermiş olmalı.'),
                },
                offer: { icon: '📞', title: L('Parti Genel Merkezi'), text: L('"Nermin Hanım\'ın beraati partimiz için hayati. Bir de şunu bilin: Bakanın oğlunun dosyası hâlâ bizim çekmecemizde."'), accept: L('Beraat ver'), decline: L('Kanunu uygula'), amount: 3000, forcedVerdict: 'release' },
            },
            {
                day: 28, position: 'first', key: 'cahit', crimeType: 'treason', name: L('Cahit Ural'), age: 61, gender: 'm', wants: 'lighter',
                statement: {
                    text: L('Kızımın videolarıyla şantaj yaptılar. Vermezsem yayımlayacaklardı.'), emotion: 'remorseful', sympathy: true, law: 'coerced',
                    detail: L('Milletvekili Cahit Ural'),
                    summary: L('İktidar partisi milletvekili. Savunma projelerinin listesini yabancı şirkete verdi; şantajla zorlandığını söylüyor.'),
                    evidence: [L('Kızına ait özel görüntülerle yapılan şantaj mesajları telefonunda kayıtlı.'), L('Hiçbir ödeme almadığı banka kayıtlarıyla doğrulandı.')],
                    question: L('Neden polise gitmediniz?'), answer: L('Şantajı yapan partinin genel sekreterinin adamlarıydı. Kime gidecektim?'),
                },
                offer: { icon: '📞', title: L('Parti Genel Merkezi'), text: L('"Cahit Bey\'i beraat ettirin; şantaj meselesi de kapansın. Kimse kimseyi suçlamasın, değil mi?"'), accept: L('Beraat ver'), decline: L('Kanunu uygula'), amount: 3000, forcedVerdict: 'release' },
            },
            {
                day: 30, position: 'last', key: 'selami', crimeType: 'treason', name: L('Selami Kuru'), age: 63, gender: 'm', wants: 'lighter', finalCase: true,
                statement: {
                    text: L('Bu ülkeyi ben yönetiyorum hakim bey. Siz de bizim sayemizde o koltuktasınız.'), emotion: 'proud', sympathy: false, law: 'base',
                    detail: L('Genel Sekreter Selami Kuru'),
                    summary: L('İktidar partisinin genel sekreteri. Savunma ihalesinin gizli bilgilerini yabancı silah şirketine satan çarkı kurup yönettiği, vekillere şantaj yaptırdığı iddiasıyla yargılanıyor.'),
                    evidence: [L('Yabancı şirketle imzalanmış gizli "danışmanlık" sözleşmesi: ₺200.000.000.'), L('Cahit Ural\'a yapılan şantajın talimatının Selami Kuru\'nun telefonundan verildiği tespit edildi.')],
                    question: L('Sözleşmedeki imza sizin mi?'), answer: L('İmza benim. Ama o sözleşmeyi bu salonda kimse yüksek sesle okuyamaz.'),
                },
                offer: { icon: '📞', title: L('Başbakanlıktan Telefon'), text: L('Bu kez ses çok daha yukarıdan geliyor: "Selami Bey beraat ederse Anayasa Mahkemesi üyeliğiniz hazır. Etmezse... bakanın oğlunun dosyasını savcılara biz veririz."'), accept: L('Beraat ver'), decline: L('Kanunu uygula'), amount: 10000, forcedVerdict: 'release' },
            },
        ],

        evenings: {
            16: () => ({
                text: L('Yeni ev büyük ve soğuk. Ece kendi odasını beğendi ama "Burada kimse birbirini tanımıyor" dedi. Annen salondaki pahalı halıya basmaya çekiniyor.'),
                choices: [
                    choice(L('Ailece yemeğe çık'), s => { adjust(s, { harmony: 8, money: -100 }); return L('Lokantada herkes sana "Sayın Hakim" diye eğildi. Ece bundan hoşlanmadı.'); }, 100),
                    choice(L('Evde makarna yap'), s => { adjust(s, { harmony: 5 }); return L('Mutfakta eski evdeki gibi güldünüz. Bir an her şey yerindeydi.'); }),
                ],
            }),
            18: () => ({
                text: L('Deniz telefonu kapattı, yüzü bembeyaz: "Bakanlıktan aradılar. İşimde terfi almışım. Hiç başvurmamıştım."'),
                choices: [
                    choice(L('"Reddet."'), s => { adjust(s, { harmony: -6, conscience: 5 }); return L('Deniz terfiyi reddetti. Ertesi gün masasının başka birine verildiğini öğrendi.'); }),
                    choice(L('"Hak ettin, kabul et."'), s => { adjust(s, { harmony: 6, conscience: -6 }); s.flags.denizPromotion = true; return L('Deniz terfiyi kabul etti. Borcunuz bir kat daha arttı.'); }),
                ],
            }),
            20: (s) => (s.specials.ferit && s.specials.ferit.favored
                ? one(L('Haberlerde Ferit Ekinci mahkeme çıkışında alkışlanıyor. Ece televizyonu kapattı: "Hani bu adam vatanı satmıştı?"'), L('"Karmaşık bir dava kızım."'), st => { adjust(st, { conscience: -5, harmony: -5 }); return L('Ece odasına gitti. "Karmaşık" kelimesi evin içinde yankılandı.'); })
                : one(L('Haberlerde Ferit Ekinci\'nin cezası tartışılıyor. Annen sana baktı: "Seni bu yüzden mi oraya koydular sanıyorsun? Aksine."'), L('"Biliyorum anne."'), st => { adjust(st, { conscience: 4 }); return L('Annen başını salladı: "Babana çekmişsin."'); })),
            22: () => ({
                text: L('Ece okulda "hakim çocuğu" diye özel muamele görüyor; öğretmeni notunu yükseltmiş.'),
                choices: [
                    choice(L('Okula gidip düzelt'), s => { adjust(s, { harmony: 4, conscience: 4 }); return L('Öğretmen şaşırdı: "Kimse itiraz etmezdi bugüne kadar."'); }),
                    choice(L('Karışma'), s => { adjust(s, { conscience: -4 }); return L('Ece karnesine baktı, sevinmedi.'); }),
                ],
            }),
            25: () => ({
                text: L('Annen gece fenalaştı. Devlet hastanesinde yer yok; partinin tanıdığı özel hastane "ücretsiz" kabul edebileceğini söylüyor.'),
                choices: [
                    choice(L('Parasını öde (₺300)'), s => { adjust(s, { money: -300, health: 2 }); return L('Annen kurtuldu. Faturayı kendi cebinden ödedin.'); }, 300),
                    choice(L('Partinin teklifini kabul et'), s => { adjust(s, { health: 2, conscience: -8 }); s.flags.partyHospital = true; return L('Annen kurtuldu. Hastane müdürü "Genel Merkez geçmiş olsun diyor" dedi.'); }),
                ],
            }),
            27: () => ({
                text: L('Deniz ciddi: "Savcılar eski dosyaları inceliyormuş. Bakanın oğlunun dosyası da aralarında olabilir mi?"'),
                choices: [
                    choice(L('"Olabilir. Ne olacaksa olsun."'), s => { adjust(s, { conscience: 5, harmony: -3 }); return L('Deniz sana sarıldı: "O zaman bundan sonra doğruyu yap."'); }),
                    choice(L('"Merak etme, korunuyoruz."'), s => { adjust(s, { conscience: -5 }); return L('Deniz sustu. "Korunuyoruz" kelimesi ikinizi de ürpertti.'); }),
                ],
            }),
            29: () => one(L('Yarın son dava. Ece yatmadan önce sordu: "Sen iyi bir hakim misin?"'), L('"Yarın göreceğiz kızım."'), s => { adjust(s, { harmony: 3 }); return L('Ece gülümsedi ve ışığı kapattı. Sen sabaha kadar uyuyamadın.'); }),
        },

        quietEvening: (state) => quiet(state, [
            [L('Başkentte trafiğin uğultusu. Salon sessiz, televizyon kapalı.'), L('Gece sessiz geçti.')],
            [L('Ece yeni okulundan bir resim getirmiş: eski evinizin önünde dört kişi.'), L('Resmi buzdolabına astınız.')],
            [L('Annen balkonda simit kırıntısıyla güvercin besliyor: "Burada kuşlar bile resmi."'), L('Güldünüz. Güvercinler kırıntıları bitirince uçup gitti.')],
            [L('Deniz eski fotoğrafları karıştırıyor; ilk evinizin mutfağında çekilmiş bir kare.'), L('O küçük mutfağı ikiniz de özlediniz.')],
        ]),

        // Covered up the treason: a lighter verdict for the ringleader, or two favours
        favored(state) {
            const sp = state.specials;
            if (sp.selami && sp.selami.favored) return true;
            return ['ferit', 'elif', 'nermin', 'cahit'].filter(k => sp[k] && sp[k].favored).length >= 2;
        },
        endings: {
            honest: {
                title: L('Emekli'),
                description: L('Bazı şeylere göz yumdun ama doğru kararlar da verdin. Bakanın oğlunun dosyası hâlâ bir çekmecede, ama vatanını satanları kanunla yargıladın. Cübbeni son kez astın; artık emeklisin.\n\nHikâye modu sona erdi.'),
            },
            favored: {
                title: L('İdam'),
                description: L('Devletin onurlu savcıları, verdiğin hukuka aykırı kararları tek tek tespit etti. Kutsal yargı görevini kötüye kullanarak vatana ihanet ettiğin için idamına karar verildi.\n\nBir zamanlar oturduğun kürsünün karşısında, sanık sandalyesinde son kez oturdun.\n\nHikâye modu sona erdi.'),
            },
        },
    },
};
