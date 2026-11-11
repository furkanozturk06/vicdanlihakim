/**
 * The judge\'s private life (TURKISH)
 * Every evening at home: fixed household costs, then one scene with a choice.
 * Scenes react to what happened in court (death sentences, bribes, ignored threats).
 *
 * state.family = { harmony: 0-100, motherHealth: 0-3, spouseLeft: bool }
 */

import { L } from './i18n.js';

export const HOUSEHOLD_COST = 60;

export function createFamily() {
    return { harmony: 70, motherHealth: 2, spouseLeft: false };
}

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Short status lines shown at the top of the evening screen
export function familyStatus(family) {
    const h = family.harmony;
    const spouse = family.spouseLeft ? L('evden ayrıldı') : h >= 60 ? L('yanında') : h >= 30 ? L('mesafeli') : L('kırgın');
    const child = h >= 60 ? L('neşeli') : h >= 30 ? L('sessiz') : L('korkuyor');
    const mother = [L('ağır hasta'), L('hasta'), L('idare ediyor'), L('iyi')][clamp(family.motherHealth, 0, 3)];
    return [
        { name: L('Deniz'), role: L('eşin'), status: spouse },
        { name: L('Ece'), role: L('kızın, 12'), status: family.spouseLeft ? L('evde değil') : child },
        { name: L('Saniye'), role: L('annen'), status: mother },
    ];
}

// A choice: { label, cost?, apply(state) -> result text }
export const choice = (label, apply, cost = 0) => ({ label, apply, cost });

export function adjust(state, { harmony = 0, conscience = 0, money = 0, health = 0 }) {
    state.family.harmony = clamp(state.family.harmony + harmony, 0, 100);
    state.conscience = clamp(state.conscience + conscience, 0, 100);
    state.money = Math.max(0, state.money + money);
    state.family.motherHealth = clamp(state.family.motherHealth + health, 0, 3);
}

/**
 * The scene for the evening after `day`. Returns { text, choices }.
 */
export function eveningScene(state, day) {
    const f = state.family;

    switch (day) {
        case 1:
            return {
                text: L('Eve döndüğünde Deniz sofrayı kurmuştu. Ece senin cübbeni giymiş, aynanın karşısında hakimcilik oynuyor. Annen odasından seslendi: "İlk gün nasıldı evladım?"'),
                choices: [
                    choice(L('"Zordu ama doğru olanı yapmaya çalıştım."'), s => { adjust(s, { harmony: 5 }); return L('Annen gülümsedi: "Baban da hep böyle derdi."'); }),
                    choice(L('Sessizce yemeğini ye'), s => { adjust(s, { harmony: -5 }); return L('Kimse bir şey sormadı. Deniz seni uzun uzun izledi.'); }),
                ],
            };

        case 2:
            return {
                text: L('Annenin kalp ilacı bitmiş. Eczane yeni kutuyu ₺120\'ye veriyor.'),
                choices: [
                    choice(L('İlacı al (₺120)'), s => { adjust(s, { money: -120, health: 1 }); return L('Annen ilacını aldı. Akşam yüzüne renk geldi.'); }, 120),
                    choice(L('Bu hafta idare etsin'), s => { adjust(s, { health: -1, harmony: -5 }); return L('Annen "Önemli değil" dedi ama gece öksürüğünden kimse uyuyamadı.'); }),
                ],
            };

        case 3:
            return {
                text: L('Ece heyecanla koştu: "Sınıfça müzeye gidiyoruz! Gezi ücreti ₺60, yarına kadar vermem lazım."'),
                choices: [
                    choice(L('Parayı ver (₺60)'), s => { adjust(s, { money: -60, harmony: 5 }); return L('Ece boynuna sarıldı. Gece rüyasında müzeyi gördüğünü anlattı.'); }, 60),
                    choice(L('"Bu sefer olmaz kızım."'), s => { adjust(s, { harmony: -10 }); return L('Ece bir şey demedi. Odasına kapandı ve kapıyı yavaşça kapattı.'); }),
                ],
            };

        case 5:
            if (state.flags.threatIgnored) {
                return {
                    text: L('Ece titreyerek anlattı: okuldan dönerken siyah bir araba onu sokak boyunca takip etmiş. Mahkemede aldırmadığın o tehdit aklına geldi.'),
                    choices: [
                        choice(L('Polise bildir'), s => { adjust(s, { harmony: -5 }); return L('Polis okulun önüne devriye koydu. Ece yine de pencereden dışarı bakmaya korkuyor.'); }),
                        choice(L('Ece\'yi okula sen götür'), s => { adjust(s, { harmony: 5, conscience: 2 }); return L('Artık sabahları Ece\'yi okula sen götürüyorsun. Elini hiç bırakmıyor.'); }),
                    ],
                };
            }
            return {
                text: L('Deniz moralsiz: "Şirkette işten çıkarılacaklar listesinde adım varmış. Bakanlıkta tanıdığın var, bir telefon açsan..."'),
                choices: [
                    choice(L('"Kimseyi arayamam."'), s => { adjust(s, { harmony: -5, conscience: 3 }); return L('Deniz anlayışla başını salladı ama gece sırtını dönüp uyudu.'); }),
                    choice(L('Bir telefon aç'), s => { adjust(s, { harmony: 10, conscience: -8 }); s.flags.owesMinistry = true; return L('Ertesi gün Deniz listeden çıkarıldı. Telefondaki ses "Bunu unutmayız Hakim Bey" dedi.'); }),
                ],
            };

        case 8:
            if (state.deathSentences > 0) {
                return {
                    text: L('Ece yatmadan önce sordu: "Okulda idam ettiğin adamı konuştular. O gerçekten çok mu kötüydü?"'),
                    choices: [
                        choice(L('"Kanun böyle diyordu."'), s => { adjust(s, { conscience: -2 }); return L('Ece başını salladı ama gözlerini kaçırdı.'); }),
                        choice(L('"Bilmiyorum kızım."'), s => { adjust(s, { harmony: 5, conscience: 4 }); return L('Ece sana sarıldı. O gece uzun süre tavana baktın.'); }),
                    ],
                };
            }
            if (state.bribesTaken > 0) {
                return {
                    text: L('Deniz yeni gelen buzdolabına baktı, sonra sana: "Bu parayı nereden buldun?"'),
                    choices: [
                        choice(L('"İkramiye verdiler."'), s => { adjust(s, { conscience: -5 }); return L('Deniz inandı. Ya da inanmış gibi yaptı.'); }),
                        choice(L('Gerçeği anlat'), s => { adjust(s, { harmony: -15, conscience: 8 }); return L('Deniz uzun süre konuşmadı. Sonunda "Bir daha olmasın" dedi.'); }),
                    ],
                };
            }
            return {
                text: L('Ece ödevini okudu: "En saygı duyduğum insan". Seni yazmış. "Çünkü kimseden korkmuyor ve haksızlık yapmıyor."'),
                choices: [
                    choice(L('Ece\'ye sarıl'), s => { adjust(s, { harmony: 10, conscience: 3 }); return L('O gece mahkemenin ağırlığını biraz daha hafif taşıdın.'); }),
                ],
            };

        case 9:
            if (f.motherHealth <= 1) {
                return {
                    text: L('Annen gece fenalaştı, ambulansla hastaneye kaldırıldı. Özel hastane hemen müdahale için ₺250 istiyor.'),
                    choices: [
                        choice(L('Öde (₺250)'), s => { adjust(s, { money: -250, health: 2 }); return L('Annen kurtuldu. Doktor ilaçlarını bir daha aksatmamanızı söyledi.'); }, 250),
                        choice(L('Devlet hastanesinde sıra bekle'), s => { adjust(s, { health: -1, harmony: -15 }); return L('Annen koridorda sabahladı. Durumu ağır.'); }),
                    ],
                };
            }
            return {
                text: L('Annen bahçede çay demlemiş, yanına çağırdı: "Seni izliyorum evladım. Zor bir işin var. Kararların seni yemesin."'),
                choices: [
                    choice(L('Annenle çay iç'), s => { adjust(s, { harmony: 5, conscience: 5 }); return L('Uzun zamandır ilk kez içinde bir sükunet hissettin.'); }),
                ],
            };

        case 10:
            return {
                text: L('Ev sahibi kapıya geldi: "Kirayı artırıyorum. Bu ay fazladan ₺100 istiyorum, yoksa evi boşaltın."'),
                choices: [
                    choice(L('Farkı öde (₺100)'), s => { adjust(s, { money: -100 }); return L('Ev sahibi parayı sayıp gitti. Deniz derin bir nefes aldı.'); }, 100),
                    choice(L('Daha küçük bir eve taşınmayı konuş'), s => { adjust(s, { harmony: -10 }); return L('Ece arkadaşlarından ayrılmak istemiyor. Ev bir süre sessizliğe gömüldü.'); }),
                ],
            };

        case 13:
            if (state.conscience < 40 || f.harmony < 25) {
                return {
                    text: L('Deniz bavulunu hazırlamış: "Seni tanıyamıyorum artık. Bir süre annemde kalacağım. Ece de benimle geliyor."'),
                    choices: [
                        choice(L('Kapıya kadar geçir'), s => { s.family.spouseLeft = true; adjust(s, { harmony: -25, conscience: -5 }); return L('Kapı kapandı. Ev, mahkeme salonundan daha sessiz.'); }),
                    ],
                };
            }
            return {
                text: L('Deniz yorgun gözlerle baktı: "Bu iş seni değiştiriyor mu?"'),
                choices: [
                    choice(L('"Hayır, hâlâ aynı insanım."'), s => { adjust(s, { harmony: 5 }); return L('Deniz gülümsedi ama inanmak istediği belliydi.'); }),
                    choice(L('"Bilmiyorum."'), s => { adjust(s, { harmony: 10, conscience: 3 }); return L('Deniz elini tuttu: "Bilmemen iyi. Sorgulamaya devam et."'); }),
                ],
            };

        case 4:
            return {
                text: L('Annen eski bir fotoğraf albümü açtı. Cübbeli bir adam gülümsüyor: dedenin, yani annenin babasının hakimlik yemin günü. "Babam derdi ki, kanun bir terazidir; ama onu tutan elin titrememesi gerekir."'),
                choices: [
                    choice(L('Fotoğrafı masana koy'), s => { adjust(s, { conscience: 5, harmony: 3 }); return L('Fotoğraf artık masanda. Zor kararlarda gözün ona kayacak.'); }),
                    choice(L('"Eski zamanlardı anne."'), s => { adjust(s, { harmony: -3 }); return L('Annen albümü sessizce kapattı.'); }),
                ],
            };

        case 6:
            return {
                text: L('Bugün Deniz\'in doğum günüymüş. Mahkemenin telaşında aklından çıkmış. Ece fısıldıyor: "Pastacı hâlâ açık, ₺80."'),
                choices: [
                    choice(L('Pasta ve çiçek al (₺80)'), s => { adjust(s, { money: -80, harmony: 10 }); return L('Deniz mumu üflerken gözleri doldu: "Unuttuğunu sanmıştım."'); }, 80),
                    choice(L('Özür dile, yarın kutlarız de'), s => { adjust(s, { harmony: -10 }); return L('Deniz "Önemli değil" dedi. Önemliydi.'); }),
                ],
            };

        case 7: {
            const verdict = state.selin;
            if (verdict === 'death') {
                return {
                    text: L('Ece akşam haberlerinde Selin Aydın\'ın davasını izledi. Sana döndü: "O gazeteci abla gerçekten hain miydi?"'),
                    choices: [
                        choice(L('"Bakanlık öyle dedi."'), s => { adjust(s, { conscience: -6, harmony: -5 }); return L('Ece başka bir şey sormadı. Bir daha da haber izlemedi.'); }),
                        choice(L('Cevap verme, odana git'), s => { adjust(s, { conscience: -3 }); return L('Kapıyı kapattın. Ama sorunun sesi kapanmadı.'); }),
                    ],
                };
            }
            return {
                text: L('Ece akşam haberlerinde Selin Aydın\'ın davasını izledi: "Onu sen mi yargıladın? Bakanlık çok kızmış diyorlar."'),
                choices: [
                    choice(L('"Kanun neyse onu verdim."'), s => { adjust(s, { conscience: 3, harmony: 3 }); return L('Ece gururla gülümsedi: "Yarın okulda anlatacağım."'); }),
                    choice(L('"Bunları düşünme kızım."'), s => { adjust(s, { harmony: -2 }); return L('Ece omuz silkti ama gözlerinde bir merak kaldı.'); }),
                ],
            };
        }

        case 11:
            return {
                text: L('Yarın sabah Ece\'nin veli toplantısı var. Ama masanda yarının dosyaları yığılı.'),
                choices: [
                    choice(L('Toplantıya git'), s => { adjust(s, { harmony: 8 }); return L('Öğretmen Ece\'yi övdü. Ece eve kadar elini bırakmadı.'); }),
                    choice(L('Dosyalara çalış'), s => { adjust(s, { harmony: -6 }); s.bonusQuestions = 1; return L('Gece yarısına kadar dosyaları okudun. Yarın bir soru fazla sorabileceksin. Ece toplantıya Deniz\'le gitti.'); }),
                ],
            };

        case 12:
            return {
                text: L('Alt kattaki komşu kapını çaldı, elinde bir tepsi börek: "Oğlum yarın sizin mahkemede, hakim bey. Bir kavga meselesi. Biraz anlayış gösterseniz..."'),
                choices: [
                    choice(L('"Kanun neyse o olur."'), s => { adjust(s, { conscience: 4, harmony: -3 }); return L('Komşu böreği geri götürdü. Merdivende selam vermeden geçti.'); }),
                    choice(L('Böreği al, "Bakarız" de'), s => { adjust(s, { conscience: -7 }); return L('Börek güzeldi. Ama her lokmada midende bir ağırlık vardı.'); }),
                ],
            };

        default: {
            // Day 14: the night before the minister\'s son
            const lines = [];
            if (f.spouseLeft) lines.push(L('Ev sessiz; Ece\'nin odası boş.'));
            else lines.push(L('Ece yatmadan önce kapında durdu: "Yarın son günün, değil mi? Ne olacak?"'));
            if (state.flags.owesMinistry) lines.push(L('Gece telefon çaldı. Bakanlıktan aynı ses: "Deniz\'in işini kurtarmıştık. Yarın siz de bizi kurtarırsınız, değil mi?"'));
            if (state.flags.kayaAlly) lines.push(L('Müfettiş Kaya\'nın sözleri aklında: "Ben kanunun yanındayım."'));
            return {
                text: lines.join(' '),
                choices: [choice(L('Uyumaya çalış'), () => L('Sabaha kadar yarınki davayı düşündün.'))],
            };
        }
    }
}

// One paragraph about the family for the ending screen
export function familyEpilogue(state) {
    const f = state.family;
    if (f.motherHealth === 0) return L('Annen hastaneden hiç çıkamadı. Son kararlarını onun yatağının başında düşündün.');
    if (f.spouseLeft) return L('Deniz ve Ece hâlâ evde değil. Akşamları boş masaya iki tabak koymayı unutamıyorsun.');
    if (f.harmony >= 70) return L('Evde seni sıcak bir sofra ve "Nasıldı bugün?" diye soran üç ses bekliyor.');
    if (f.harmony >= 40) return L('Evde hayat sürüyor; ama sofralar eskisinden daha sessiz.');
    return L('Aynı evde yaşıyorsunuz, ama artık birbirinizle pek konuşmuyorsunuz.');
}
