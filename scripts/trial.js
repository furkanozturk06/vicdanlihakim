/**
 * Act 1 (TURKISH): the Ayla Öğretmen trial
 *
 * A drunk driver kills the teacher Ayla Demirtaş at a crossing and flees; the car
 * belongs to the Minister of Justice and his son Kerem is the suspect. The trial
 * runs through the whole first act: three hearings (days 4, 9, 13), three cases
 * tied to it (days 3, 6, 12) and pressure on the judge's family. What the judge
 * secures along the way decides what is in the file on day 15:
 *
 *   state.trial.arrested     day 4: Kerem held in custody (true) or released (false)
 *   state.trial.footageCopy  day 3: the police officer was questioned and gave up his copy
 *   state.trial.paidWitness  day 6: the false witness was questioned and named the ministry
 *   state.trial.witness      day 9: 'kept' (Defne's testimony stays) or 'lost'
 *   state.trial.footage      day 13: 'accepted', 'rejected' or 'none'
 *
 * If neither the witness nor the footage survives, nobody can prove who was driving
 * and the law requires an acquittal: the minister wins without lifting a finger.
 */

import { L } from './i18n.js';
import { adjust } from './family.js';

const proven = (t) => t.witness === 'kept' || t.footage === 'accepted';

export const ACT1 = {
    beats: {
        1: () => ({
            icon: '📰', title: L('Yaya Geçidinde Ölüm'),
            text: L('Sabah gazetesinin manşeti: "Öğretmen Ayla Demirtaş yaya geçidinde can verdi; sürücü kaçtı." Araç, Adalet Bakanı adına kayıtlı. Şüpheli, bakanın oğlu Kerem B.\n\nAdliyeye vardığında dosya masandaydı. Kâtip yavaşça söyledi: "Dava size verildi, hakim bey. İlk duruşma dört gün sonra."'),
            choices: [{ label: L('Dosyayı aç'), value: true }],
        }),
        4: () => ({
            icon: '⚖️', title: L('Birinci Duruşma: Tutuklama'),
            text: L('Salon tıklım tıklım. Ayla Öğretmen\'in öğrencileri en arkada. Savcı Kerem B.\'nin tutuklanmasını istiyor: "Kaçma ve delilleri karartma şüphesi var." Avukat itiraz ediyor: "Müvekkilim saygın bir ailenin çocuğu; adli kontrol yeterli."\n\nKerem sana bakıp gülümsüyor.'),
            choices: [{ label: L('Tutuklanmasına karar ver'), value: 'arrest' }, { label: L('Adli kontrolle serbest bırak'), value: 'release' }],
            onChoice: (st, v) => {
                st.trial.arrested = v === 'arrest';
                if (v === 'arrest') adjust(st, { conscience: 3 });
                else adjust(st, { conscience: -4 });
            },
        }),
        5: (s) => (s.trial.arrested
            ? {
                icon: '✉️', title: L('Kapının Altından Bir Zarf'),
                text: L('Sabah kapının altında imzasız bir not vardı: "Tutukladığın çocuğun babası unutmaz. Ece\'nin okulu saat üçte dağılıyor, değil mi?" Deniz notu okuyunca elleri titredi.'),
                choices: [{ label: L('Polise bildir'), value: 'police' }, { label: L('Deniz\'i sakinleştir, kimseye söyleme'), value: 'quiet' }],
                onChoice: (st, v) => adjust(st, v === 'police' ? { harmony: -4 } : { harmony: -8, conscience: -2 }),
            }
            : {
                icon: '📸', title: L('Gece Kulübünde Bir Fotoğraf'),
                text: L('Gazetelerde Kerem B.\'nin dün gece bir kulüpte şampanya patlattığı fotoğraflar var. Aynı gece görgü tanığı Defne\'nin evinin önünde saatlerce bekleyen siyah bir araç görülmüş.'),
                choices: [{ label: L('Devam'), value: true }],
                onChoice: (st) => adjust(st, { conscience: -2 }),
            }),
        9: (s) => (s.trial.arrested
            ? {
                icon: '⚖️', title: L('İkinci Duruşma: Tanık'),
                text: L('Ayla Öğretmen\'in öğrencisi Defne (17) kürsüde: "Kerem\'i tanıyorum, aynı mahalledeyiz. Arabayı o kullanıyordu. Hocam yere düşünce bir an durdu, sonra gaza bastı."\n\nAvukat ayağa kalkıyor: "Reşit olmayan, öğretmenine duygusal olarak bağlı bir tanık. İfadesinin dosyadan çıkarılmasını talep ediyoruz."'),
                choices: [{ label: L('İtirazı reddet, ifade dosyada kalsın'), value: 'kept' }, { label: L('İtirazı kabul et'), value: 'lost' }],
                onChoice: (st, v) => { st.trial.witness = v; adjust(st, v === 'kept' ? { conscience: 3 } : { conscience: -5 }); },
            }
            : {
                icon: '⚖️', title: L('İkinci Duruşma: Tanık'),
                text: L('Defne (17) kürsüye titreyerek çıktı: "Ben... ifademi geri çekmek istiyorum. Emin değilim." Sonra sesini alçalttı: "Bir haftadır evimizin önünde siyah bir araba bekliyor. Annem işten çıkarıldı."\n\nKerem B. tutuksuz yargılandığı için salonda, ön sırada oturuyor.'),
                choices: [{ label: L('Tanık koruma kararı ver, ifade dosyada kalsın'), value: 'kept' }, { label: L('İfadesini geri çekmesine izin ver'), value: 'lost' }],
                onChoice: (st, v) => { st.trial.witness = v; adjust(st, v === 'kept' ? { conscience: 4, harmony: -5 } : { conscience: -6 }); },
            }),
        10: () => ({
            icon: '🏥', title: L('Bakanlıktan Bir İyilik'),
            text: L('Annen için aylardır sıra beklediğiniz kalp ameliyatı birden "uygun görülmüş". Hastaneden arayan memur ekledi: "Bakanlığın özel talimatıyla, hakim bey. Bakan Bey geçmiş olsun dedi."\n\nİyiliğin bedeli söylenmedi. Söylenmesine gerek yoktu.'),
            choices: [{ label: L('Kabul et; annen ameliyat olsun'), value: 'accept' }, { label: L('Reddet; sıranı bekle'), value: 'refuse' }],
            onChoice: (st, v) => {
                if (v === 'accept') { st.flags.owesMinistry = true; adjust(st, { health: 2, harmony: 6, conscience: -8 }); } else adjust(st, { conscience: 5, harmony: -6 });
            },
        }),
        13: (s) => (s.trial.footageCopy
            ? {
                icon: '⚖️', title: L('Üçüncü Duruşma: Kamera Kaydı'),
                text: L('Polis Murat S.\'nin sakladığı kopya kayıt oynatıldı. Görüntü net: arabayı Kerem B. kullanıyor, çarpmadan sonra duruyor, sonra hızla uzaklaşıyor. Salonda biri ağlamaya başladı.\n\nAvukat: "Bu kayıt kurallara aykırı biçimde kopyalanmıştır. Hukuka aykırı delil kullanılamaz!"'),
                choices: [{ label: L('Kaydı delil olarak kabul et'), value: 'accepted' }, { label: L('Kaydı dosyadan çıkar'), value: 'rejected' }],
                onChoice: (st, v) => { st.trial.footage = v; adjust(st, v === 'accepted' ? { conscience: 3 } : { conscience: -6 }); },
            }
            : {
                icon: '⚖️', title: L('Üçüncü Duruşma: Kamera Kaydı'),
                text: L('Savcı kavşak kamerasının kaydını istedi. Emniyetin cevabı tek satır: "İlgili kayıt teknik bir arıza nedeniyle silinmiştir." Kaydın bir kopyası olup olmadığını bilen tek kişi, onu silen polisti.'),
                choices: [{ label: L('Devam'), value: true }],
                onChoice: (st) => { st.trial.footage = 'none'; },
            }),
    },

    // Cases tied to the trial, each the first case of its day
    specials: [
        {
            day: 3, position: 'first', key: 'murat', crimeType: 'corruption', name: L('Murat S.'), age: 38, gender: 'm',
            statement: {
                text: L('Emir yukarıdan geldi. Silmezsem çocuklarımın okulunu bile değiştirecekler dediler.'), emotion: 'panicked', sympathy: true, law: 'coerced',
                detail: L('Silinen kamera kaydı'),
                summary: L('Trafik polisi. Ayla Demirtaş\'ın öldüğü kavşağın kamera kaydını, kazadan bir saat sonra sistemden sildi.'),
                evidence: [L('Silme işlemi Murat S.\'nin şifresiyle yapılmış; hesabına para girişi yok.'), L('Amiri, silme emrinin "yukarıdan" geldiğini tutanağa geçirmiş.')],
                question: L('Kaydın başka bir kopyası var mı?'), answer: L('Var... Silmeden önce kendi bilgisayarıma kopyaladım. Vicdanım el vermedi.'),
            },
            onVerdict: (st, c) => { if (c.asked) st.trial.footageCopy = true; },
        },
        {
            day: 6, position: 'first', key: 'orhan', crimeType: 'perjury', name: L('Orhan K.'), age: 47, gender: 'm',
            statement: {
                text: L('Kadın birden yola atladı, sürücünün hiçbir suçu yoktu. Ne gördüysem onu söyledim.'), emotion: 'defiant', sympathy: false, law: 'base',
                detail: L('Kazanın savunma tanığı'),
                summary: L('Ayla Demirtaş\'ın aniden yola fırladığını söyleyen tek tanık. Olay saatinde başka bir ilçede olduğu baz kayıtlarıyla ortaya çıktı.'),
                evidence: [L('Telefonunun baz kaydı, kaza saatinde 40 km uzakta olduğunu gösteriyor.'), L('İfadeden iki gün sonra hesabına ₺50.000 yatırılmış; gönderen bir paravan şirket.')],
                question: L('Bu ifade için sana kim para verdi?'), answer: L('Bakanlıktan biri... Adını bilmiyorum. "Sadece gördüğünü söyle" dediler; ne göreceğimi de onlar söyledi.'),
            },
            onVerdict: (st, c) => { if (c.asked) st.trial.paidWitness = true; },
        },
        {
            day: 12, position: 'first', key: 'baris', crimeType: 'vandalism', name: L('Barış A.'), age: 19, gender: 'm',
            statement: {
                text: L('Ayla Hoca benim öğretmenimdi! Katili serbest kalacak diye o camı kırdım.'), emotion: 'remorseful', sympathy: true, law: 'public',
                detail: L('"Ayla Öğretmen için adalet" eylemi'),
                summary: L('Adliye önündeki "Ayla Öğretmen için adalet" eyleminde adliyenin camlarını taşla kırdı.'),
                evidence: [L('Kırılan üç camın bedeli ₺9.000.'), L('Kamera kayıtlarına göre olaylar, Kerem B.\'nin arkadaşlarının arabayla öğrencilerin üstüne sürmesiyle başlamış.')],
                question: L('Olayları kim başlattı?'), answer: L('Kerem\'in arkadaşları arabayla üstümüze sürdü. Biz sadece bağırıyorduk... Taşı sonra attım, özür dilerim.'),
            },
        },
    ],
};

// The day-15 case: what is in the file depends on the trial so far
export function finaleStatement(trial) {
    const t = trial || {};
    const lines = [];
    lines.push(t.witness === 'kept'
        ? L('Görgü tanığı Defne Y., arabayı Kerem B.\'nin kullandığını teşhis etti.')
        : L('Görgü tanığı ifadesini geri çekti; dosyada yok.'));
    lines.push(t.footage === 'accepted'
        ? L('Kavşak kamerasının kaydı delil olarak kabul edildi: sürücü Kerem B.')
        : L('Kavşak kamerasının kaydı dosyada yok.'));
    if (t.paidWitness) lines.push(L('Savunma tanığının bakanlıkla bağlantılı bir şirketten para aldığı ortaya çıktı.'));

    if (proven(t)) {
        return {
            text: L('Babamın kim olduğunu biliyor musunuz? Bu dava burada kapanır.'), emotion: 'proud', sympathy: false, law: 'flee', tags: ['alcohol'],
            detail: L('Bakanın oğlu'),
            summary: L('Gece alkollü araç kullanırken yaya geçidinde öğretmen Ayla Demirtaş\'a çarpıp kaçtı. Duruşmalarda: {0}', lines.join(' ')),
            evidence: [
                L('Kandaki alkol: 1,9 promil; araç olay yerinden 3 km ötede terk edilmiş bulundu.'),
                L('Araç Adalet Bakanı adına kayıtlı.'),
            ],
            question: L('Neden durmadın?'), answer: L('Durmama gerek yoktu. Babam halleder, siz de bilirsiniz.'),
        };
    }
    return {
        text: L('Söylemiştim. Arabayı ben kullanmadım; kimse de aksini kanıtlayamaz.'), emotion: 'proud', sympathy: false, law: 'innocent',
        detail: L('Bakanın oğlu'),
        summary: L('Öğretmen Ayla Demirtaş yaya geçidinde öldü; araç Adalet Bakanı\'na ait. Duruşmalarda: {0} Sürücünün kim olduğu kanıtlanamadı.', lines.join(' ')),
        evidence: [
            L('Araç Adalet Bakanı adına kayıtlı; o gece kimin kullandığını gösteren delil kalmadı.'),
            L('Kanuna göre suçu kanıtlanamayan sanık beraat eder.'),
        ],
        question: L('O gece arabayı kim kullanıyordu?'), answer: L('Bilmiyorum. Babamın şoförü olabilir. Sorun ona.'),
    };
}
