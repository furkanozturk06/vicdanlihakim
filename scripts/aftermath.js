/**
 * What became of them (TURKISH)
 *
 * Some verdicts come back two mornings later as a short note: a letter from someone
 * the judge acquitted, a family reunited, victims who felt heard, or the price of a
 * sentence that was too harsh. Story cases (finale, Selin, special cases) and
 * verdicts that already come back another way (appeals, returning offenders) are
 * left out. At most two notes are shown in one morning.
 */

import { L } from './i18n.js';

const CHANCE = 0.45;

// -> { day, text, conscience, reputation } or null
export function aftermathFor(c, verdict, result, day) {
    if (c.finale || c.selinCase || c.specialKey || c.returning) return null;
    // `about` names the case, so the note can say which one it was
    const pick = (text, conscience = 0, reputation = 0) => ({
        day: day + 2, text, conscience, reputation,
        about: { day, name: c.name, crime: c.crime, detail: c.detail },
    });
    const name = c.name;

    if (verdict === 'death') {
        if (!result.correct) return pick(L('Avukatlar yeni bir delil sundu: idam edilen {0} masum olabilir. Gazeteler adınızı manşete taşıdı.', name), -8, -5);
        if (Math.random() < CHANCE) return pick(L('{0} için verdiğiniz idam kararı infaz edildi. Ailesi cenazeyi sessizce kaldırdı.', name), -2);
        return null;
    }
    if (Math.random() >= CHANCE) return null;

    if (result.correct && !result.partial) {
        if (verdict === 'release' && c.sympathy) {
            return pick(L('Beraat ettirdiğiniz sanıktan bir mektup var. {0} yazmış: "Bana inandınız. Hayatımı yeniden kuruyorum."', name), 3, 1);
        }
        if (c.sympathy && !verdict.startsWith('jail')) {
            return pick(L('"{0}" davasının sanığı {1} ailesine kavuştu. Mahallede kararınız konuşuluyor.', c.detail, name), 1, 2);
        }
        if (!c.sympathy && verdict.startsWith('jail')) {
            return pick(L('"{0}" davasının mağdurları adliyeye bir teşekkür mektubu bıraktı: "Sesimizi duydunuz."', c.detail), 2, 1);
        }
        return null;
    }
    if (result.tooHarsh && c.sympathy) {
        return pick(L('{0} kanunun istediğinden ağır bir ceza aldı. Ailesi adliye önünde bekliyor; fotoğrafları gazetelerde.', name), -4, -2);
    }
    return null;
}
