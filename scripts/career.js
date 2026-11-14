/**
 * Career across all games (TURKISH): judge's titles and achievements
 *
 * Kept in the settings (not in a saved game), so they survive new games; only
 * "İlerlemeyi Sıfırla" clears them.
 *   settings.career       = { lawful, questioned }   lifetime counts
 *   settings.achievements = { id: true }
 *   settings.endingsSeen  = ['town', 'retired', 'executed']
 */

import { L } from './i18n.js';

// Titles by lifetime lawful verdicts (a story game gives about 130)
export const RANKS = [
    { at: 0, title: L('Genç Hakim') },
    { at: 50, title: L('Hakim') },
    { at: 150, title: L('Kıdemli Hakim') },
    { at: 300, title: L('Ağır Ceza Başkanı') },
    { at: 600, title: L('Yargıtay Üyesi') },
    { at: 1000, title: L('Adaletin Simgesi') },
];

export function rankFor(lawful) {
    let i = 0;
    while (i + 1 < RANKS.length && lawful >= RANKS[i + 1].at) i++;
    return { index: i, title: RANKS[i].title, from: RANKS[i].at, next: RANKS[i + 1] || null };
}

export const ACHIEVEMENTS = [
    { id: 'first', icon: '⚖️', title: L('İlk Hüküm'), text: L('İlk kanuna uygun kararını ver.') },
    { id: 'perfectDay', icon: '✨', title: L('Kusursuz Gün'), text: L('Bir günü hiç hatasız bitir.') },
    { id: 'interrogator', icon: '🔎', title: L('Sorgu Ustası'), text: L('Toplam 100 sanığı sorgula.') },
    { id: 'objection', icon: '🛡️', title: L('Haksız İtiraz'), text: L('Doğru kararını bozmaya çalışan bir itirazı reddet.') },
    { id: 'ayla', icon: '🍎', title: L('Ayla Öğretmen İçin'), text: L('Bakanın oğlunu mahkûm et.') },
    { id: 'cleanHands', icon: '🤲', title: L('Temiz Eller'), text: L('Hikâyeyi hiç rüşvet almadan bitir.') },
    { id: 'mercy', icon: '🕊️', title: L('Merhamet'), text: L('Hikâyeyi hiç idam kararı vermeden bitir.') },
    { id: 'family', icon: '🏠', title: L('Sıcak Yuva'), text: L('Hikâyeyi ailen yanındayken ve aranız iyiyken bitir.') },
    { id: 'redemption', icon: '🚪', title: L('İkinci Şans'), text: L('Seni terk eden eşini geri kazan.') },
    { id: 'town', icon: '🏛️', title: L('Kasabanın Hakimi'), text: L('"Kasabanın Hakimi" sonunu gör.') },
    { id: 'retired', icon: '🪑', title: L('Emekli'), text: L('"Emekli" sonunu gör.') },
    { id: 'executed', icon: '🪢', title: L('İdam'), text: L('"İdam" sonunu gör.') },
    { id: 'allEndings', icon: '📚', title: L('Bütün Yollar'), text: L('Hikâyenin üç sonunu da gör.') },
    { id: 'endless30', icon: '⏳', title: L('Yılmaz Hakim'), text: L('Sonsuz modda 30 gün dayan.') },
];

export const achievement = (id) => ACHIEVEMENTS.find(a => a.id === id);
