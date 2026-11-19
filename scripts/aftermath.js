/**
 * What became of them (TURKISH)
 *
 * Some verdicts come back two mornings later as a short note: a letter from someone
 * the judge acquitted, a family reunited, victims who felt heard, or the price of a
 * sentence that was too harsh. Story cases (finale, Selin, special cases) and
 * verdicts that already come back another way (appeals, returning offenders) are
 * left out. At most two notes are shown in one morning. Each kind of note has a few
 * wordings, so the mornings do not read the same.
 */

import { L } from './i18n.js';
import { caseWho } from './story.js';

const CHANCE = 0.45;

const any = list => list[Math.floor(Math.random() * list.length)];

// -> { day, text, conscience, reputation } or null
export function aftermathFor(c, verdict, result, day) {
    if (c.finale || c.selinCase || c.specialKey || c.returning) return null;
    // `about` names the case, so the note can say which one it was
    const pick = (text, conscience = 0, reputation = 0) => ({
        day: day + 2, text, conscience, reputation,
        about: { day, name: c.name, crime: c.crime, detail: c.detail },
    });
    const name = c.name;
    // what the case was, told in a few words ("yasak bölgede avlanan"), when the summary allows it;
    // otherwise the summary's first sentence is told first
    const who = caseWho(c.summary);
    const told = (c.summary || '').split(/(?<=[.!?])\s/)[0];

    if (verdict === 'death') {
        if (!result.correct) return pick(L('Avukatlar yeni bir delil sundu: idam edilen {0} masum olabilir. Gazeteler adınızı manşete taşıdı.', name), -8, -5);
        if (Math.random() < CHANCE) {
            return pick(any([
                L('{0} için verdiğiniz idam kararı infaz edildi. Ailesi cenazeyi sessizce kaldırdı.', name),
                L('İdam edilen {0} son mektubunu ailesine yazmış; mektup bir gazetede yayımlandı.', name),
                L('{0} için verilen idam kararı infaz edildi. Adliyenin önünde ne alkış vardı ne yuh; sadece sessizlik.', name),
            ]), -2);
        }
        return null;
    }
    if (Math.random() >= CHANCE) return null;

    if (result.correct && !result.partial) {
        if (verdict === 'release' && c.sympathy) {
            return pick(any([
                L('Beraat ettirdiğiniz sanıktan bir mektup var. {0} yazmış: "Bana inandınız. Hayatımı yeniden kuruyorum."', name),
                L('Beraat ettirdiğiniz {0} bir işe girdiğini haber verdi: "Bana ikinci bir şans verdiniz. Boşa harcamayacağım."', name),
                L('Beraat ettirdiğiniz {0} adliyenin önünden geçerken durdu ve pencerenize doğru başıyla selam verdi.', name),
            ]), 3, 1);
        }
        if (c.sympathy && !verdict.startsWith('jail')) {
            const home = who
                ? L('{0} {1} ailesine kavuştu.', who, name)
                : L('{0} Sanık {1} ailesine kavuştu.', told, name);
            return pick(`${home} ${any([
                L('Mahallede kararınız konuşuluyor.'),
                L('Komşuları kapısına "Hoş geldin" yazılı bir pankart asmış.'),
                L('Çocukları okul çıkışında onu kapıda bekliyordu.'),
                L('Ailesi adliyeye bir kutu kurabiye bıraktı; kartta sadece "Teşekkürler" yazıyor.'),
            ])}`, 1, 2);
        }
        if (!c.sympathy && verdict.startsWith('jail')) {
            const sent = who
                ? L('{0} {1} cezaevine gönderildi.', who, name)
                : L('{0} Sanık {1} cezaevine gönderildi.', told, name);
            return pick(`${sent} ${any([
                L('Mağdurlar adliyeye bir teşekkür mektubu bıraktı: "Sesimizi duydunuz."'),
                L('Mağdurlardan biri adliye kapısında sizi bekleyip elinizi sıktı.'),
                L('Mahallenin muhtarı uğradı: "İnsanlar artık sokağa rahat çıkıyor."'),
                L('Mağdurlardan biri yerel gazeteye "Adalet geç de olsa geldi" dedi.'),
            ])}`, 2, 1);
        }
        return null;
    }
    if (result.tooHarsh && c.sympathy) {
        return pick(any([
            L('{0} kanunun istediğinden ağır bir ceza aldı. Ailesi adliye önünde bekliyor; fotoğrafları gazetelerde.', name),
            L('{0} hakkında verdiğiniz ağır cezaya baro tepki gösterdi: "Suçla ceza orantısız."', name),
            L('Mahallede {0} için imza toplanıyor: "Bu kadarını hak etmedi."', name),
        ]), -4, -2);
    }
    return null;
}
