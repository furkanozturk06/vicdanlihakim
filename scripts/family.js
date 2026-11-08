/**
 * The judge's private life (TURKISH)
 * Every evening at home: fixed household costs, then one scene with a choice.
 * Scenes react to what happened in court (death sentences, bribes, ignored threats).
 *
 * state.family = { harmony: 0-100, motherHealth: 0-3, spouseLeft: bool }
 */

export const HOUSEHOLD_COST = 60;

export function createFamily() {
    return { harmony: 70, motherHealth: 2, spouseLeft: false };
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Short status lines shown at the top of the evening screen
export function familyStatus(family) {
    const h = family.harmony;
    const spouse = family.spouseLeft ? 'evden ayrıldı' : h >= 60 ? 'yanında' : h >= 30 ? 'mesafeli' : 'kırgın';
    const child = h >= 60 ? 'neşeli' : h >= 30 ? 'sessiz' : 'korkuyor';
    const mother = ['ağır hasta', 'hasta', 'idare ediyor', 'iyi'][clamp(family.motherHealth, 0, 3)];
    return [
        { name: 'Deniz', role: 'eşin', status: spouse },
        { name: 'Ece', role: 'kızın, 12', status: family.spouseLeft ? 'evde değil' : child },
        { name: 'Saniye', role: 'annen', status: mother },
    ];
}

// A choice: { label, cost?, apply(state) -> result text }
const choice = (label, apply, cost = 0) => ({ label, apply, cost });

function adjust(state, { harmony = 0, conscience = 0, money = 0, health = 0 }) {
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
                text: 'Eve döndüğünde Deniz sofrayı kurmuştu. Ece senin cübbeni giymiş, aynanın karşısında hakimcilik oynuyor. Annen odasından seslendi: "İlk gün nasıldı evladım?"',
                choices: [
                    choice('"Zordu ama doğru olanı yapmaya çalıştım."', s => { adjust(s, { harmony: 5 }); return 'Annen gülümsedi: "Baban da hep böyle derdi."'; }),
                    choice('Sessizce yemeğini ye', s => { adjust(s, { harmony: -5 }); return 'Kimse bir şey sormadı. Deniz seni uzun uzun izledi.'; }),
                ],
            };

        case 2:
            return {
                text: 'Annenin kalp ilacı bitmiş. Eczane yeni kutuyu ₺120\'ye veriyor.',
                choices: [
                    choice('İlacı al (₺120)', s => { adjust(s, { money: -120, health: 1 }); return 'Annen ilacını aldı. Akşam yüzüne renk geldi.'; }, 120),
                    choice('Bu hafta idare etsin', s => { adjust(s, { health: -1, harmony: -5 }); return 'Annen "Önemli değil" dedi ama gece öksürüğünden kimse uyuyamadı.'; }),
                ],
            };

        case 3:
            return {
                text: 'Ece heyecanla koştu: "Sınıfça müzeye gidiyoruz! Gezi ücreti ₺60, yarına kadar vermem lazım."',
                choices: [
                    choice('Parayı ver (₺60)', s => { adjust(s, { money: -60, harmony: 5 }); return 'Ece boynuna sarıldı. Gece rüyasında müzeyi gördüğünü anlattı.'; }, 60),
                    choice('"Bu sefer olmaz kızım."', s => { adjust(s, { harmony: -10 }); return 'Ece bir şey demedi. Odasına kapandı ve kapıyı yavaşça kapattı.'; }),
                ],
            };

        case 4:
            if (state.flags.threatIgnored) {
                return {
                    text: 'Ece titreyerek anlattı: okuldan dönerken siyah bir araba onu sokak boyunca takip etmiş. Mahkemede aldırmadığın o tehdit aklına geldi.',
                    choices: [
                        choice('Polise bildir', s => { adjust(s, { harmony: -5 }); return 'Polis okulun önüne devriye koydu. Ece yine de pencereden dışarı bakmaya korkuyor.'; }),
                        choice('Ece\'yi okula sen götür', s => { adjust(s, { harmony: 5, conscience: 2 }); return 'Artık sabahları Ece\'yi okula sen götürüyorsun. Elini hiç bırakmıyor.'; }),
                    ],
                };
            }
            return {
                text: 'Deniz moralsiz: "Şirkette işten çıkarılacaklar listesinde adım varmış. Bakanlıkta tanıdığın var, bir telefon açsan..."',
                choices: [
                    choice('"Kimseyi arayamam."', s => { adjust(s, { harmony: -5, conscience: 3 }); return 'Deniz anlayışla başını salladı ama gece sırtını dönüp uyudu.'; }),
                    choice('Bir telefon aç', s => { adjust(s, { harmony: 10, conscience: -8 }); s.flags.owesMinistry = true; return 'Ertesi gün Deniz listeden çıkarıldı. Telefondaki ses "Bunu unutmayız Hakim Bey" dedi.'; }),
                ],
            };

        case 5:
            if (state.deathSentences > 0) {
                return {
                    text: 'Ece yatmadan önce sordu: "Okulda idam ettiğin adamı konuştular. O gerçekten çok mu kötüydü?"',
                    choices: [
                        choice('"Kanun böyle diyordu."', s => { adjust(s, { conscience: -2 }); return 'Ece başını salladı ama gözlerini kaçırdı.'; }),
                        choice('"Bilmiyorum kızım."', s => { adjust(s, { harmony: 5, conscience: 4 }); return 'Ece sana sarıldı. O gece uzun süre tavana baktın.'; }),
                    ],
                };
            }
            if (state.bribesTaken > 0) {
                return {
                    text: 'Deniz yeni gelen buzdolabına baktı, sonra sana: "Bu parayı nereden buldun?"',
                    choices: [
                        choice('"İkramiye verdiler."', s => { adjust(s, { conscience: -5 }); return 'Deniz inandı. Ya da inanmış gibi yaptı.'; }),
                        choice('Gerçeği anlat', s => { adjust(s, { harmony: -15, conscience: 8 }); return 'Deniz uzun süre konuşmadı. Sonunda "Bir daha olmasın" dedi.'; }),
                    ],
                };
            }
            return {
                text: 'Ece ödevini okudu: "En saygı duyduğum insan". Seni yazmış. "Çünkü kimseden korkmuyor ve haksızlık yapmıyor."',
                choices: [
                    choice('Ece\'ye sarıl', s => { adjust(s, { harmony: 10, conscience: 3 }); return 'O gece mahkemenin ağırlığını biraz daha hafif taşıdın.'; }),
                ],
            };

        case 6:
            if (f.motherHealth <= 1) {
                return {
                    text: 'Annen gece fenalaştı, ambulansla hastaneye kaldırıldı. Özel hastane hemen müdahale için ₺250 istiyor.',
                    choices: [
                        choice('Öde (₺250)', s => { adjust(s, { money: -250, health: 2 }); return 'Annen kurtuldu. Doktor ilaçlarını bir daha aksatmamanızı söyledi.'; }, 250),
                        choice('Devlet hastanesinde sıra bekle', s => { adjust(s, { health: -1, harmony: -15 }); return 'Annen koridorda sabahladı. Durumu ağır.'; }),
                    ],
                };
            }
            return {
                text: 'Annen bahçede çay demlemiş, yanına çağırdı: "Seni izliyorum evladım. Zor bir işin var. Kararların seni yemesin."',
                choices: [
                    choice('Annenle çay iç', s => { adjust(s, { harmony: 5, conscience: 5 }); return 'Uzun zamandır ilk kez içinde bir sükunet hissettin.'; }),
                ],
            };

        case 7:
            return {
                text: 'Ev sahibi kapıya geldi: "Kirayı artırıyorum. Bu ay fazladan ₺100 istiyorum, yoksa evi boşaltın."',
                choices: [
                    choice('Farkı öde (₺100)', s => { adjust(s, { money: -100 }); return 'Ev sahibi parayı sayıp gitti. Deniz derin bir nefes aldı.'; }, 100),
                    choice('Daha küçük bir eve taşınmayı konuş', s => { adjust(s, { harmony: -10 }); return 'Ece arkadaşlarından ayrılmak istemiyor. Ev bir süre sessizliğe gömüldü.'; }),
                ],
            };

        case 8:
            if (state.conscience < 40 || f.harmony < 25) {
                return {
                    text: 'Deniz bavulunu hazırlamış: "Seni tanıyamıyorum artık. Bir süre annemde kalacağım. Ece de benimle geliyor."',
                    choices: [
                        choice('Kapıya kadar geçir', s => { s.family.spouseLeft = true; adjust(s, { harmony: -25, conscience: -5 }); return 'Kapı kapandı. Ev, mahkeme salonundan daha sessiz.'; }),
                    ],
                };
            }
            return {
                text: 'Deniz yorgun gözlerle baktı: "Bu iş seni değiştiriyor mu?"',
                choices: [
                    choice('"Hayır, hâlâ aynı insanım."', s => { adjust(s, { harmony: 5 }); return 'Deniz gülümsedi ama inanmak istediği belliydi.'; }),
                    choice('"Bilmiyorum."', s => { adjust(s, { harmony: 10, conscience: 3 }); return 'Deniz elini tuttu: "Bilmemen iyi. Sorgulamaya devam et."'; }),
                ],
            };

        default: {
            // Day 9: the night before the last day
            const lines = [];
            if (f.spouseLeft) lines.push('Ev sessiz; Ece\'nin odası boş.');
            else lines.push('Ece yatmadan önce kapında durdu: "Yarın son günün, değil mi? Ne olacak?"');
            if (state.flags.owesMinistry) lines.push('Gece telefon çaldı. Bakanlıktan aynı ses: "Deniz\'in işini kurtarmıştık. Yarın siz de bizi kurtarırsınız, değil mi?"');
            if (state.flags.kayaAlly) lines.push('Müfettiş Kaya\'nın sözleri aklında: "Ben kanunun yanındayım."');
            return {
                text: lines.join(' '),
                choices: [choice('Uyumaya çalış', () => 'Sabaha kadar yarınki davayı düşündün.')],
            };
        }
    }
}

// One paragraph about the family for the ending screen
export function familyEpilogue(state) {
    const f = state.family;
    if (f.motherHealth === 0) return 'Annen hastaneden hiç çıkamadı. Son kararlarını onun yatağının başında düşündün.';
    if (f.spouseLeft) return 'Deniz ve Ece hâlâ evde değil. Akşamları boş masaya iki tabak koymayı unutamıyorsun.';
    if (f.harmony >= 70) return 'Evde seni sıcak bir sofra ve "Nasıldı bugün?" diye soran üç ses bekliyor.';
    if (f.harmony >= 40) return 'Evde hayat sürüyor; ama sofralar eskisinden daha sessiz.';
    return 'Aynı evde yaşıyorsunuz, ama artık birbirinizle pek konuşmuyorsunuz.';
}
