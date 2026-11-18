/**
 * The faces of the story's people. Defendants of everyday cases look different
 * every time; the people of the story always look like this, in every game and
 * every time they come in (Kerem B. at his hearing and at his trial, the lawyer
 * who speaks at two hearings...). Keyed by their name as shown in the game.
 */
import { L } from './i18n.js';

const look = (gender, skin, hair, hairStyle, facialHair, glasses, age, clothing, outfit, earrings = false) =>
    ({ gender, skin, hair, hairStyle, facialHair, glasses, age, clothing, outfit, earrings });

const PEOPLE = {
    // Act 1: the Ayla Öğretmen trial
    [L('Kerem B.')]: look('m', '#e8beac', '#1a1a1a', 'side', 'none', false, '', '#1a365d', 'suit'),
    [L('Selin Aydın')]: look('f', '#d4a574', '#4a3728', 'bob', 'none', true, '', '#2f4858', 'shirt', true),
    [L('Murat S.')]: look('m', '#c68642', '#2c1810', 'short', 'mustache', false, '', '#2d3748', 'shirt'),
    [L('Orhan K.')]: look('m', '#e8beac', '#4a3728', 'side', 'beard', false, '', '#553c2e', 'sweater'),
    [L('Barış A.')]: look('m', '#f5d0c5', '#8b6914', 'curly', 'none', false, '', '#2f4a32', 'hoodie'),
    [L('Defne')]: look('f', '#e8beac', '#2c1810', 'long', 'none', false, '', '#5a2a2a', 'sweater'),

    // Act 2, exile: Karaçam and the Hikmet Foundation
    [L('Kenan Yıldız')]: look('m', '#d4a574', '#8f8f8f', 'side', 'mustache', true, '', '#553c2e', 'suit'),
    [L('Hasan Ulu')]: look('m', '#c68642', '#2c1810', 'curly', 'beard', true, '', '#2f4a32', 'sweater'),
    [L('Necmi Aksoy')]: look('m', '#e8beac', '#b8b8b8', 'bald', 'mustache', false, '', '#4a3728', 'suit'),
    [L('Rüstem Kaya')]: look('m', '#c68642', '#1a1a1a', 'short', 'beard', false, '', '#5a2a2a', 'hoodie'),
    [L('Hacı Rıza Karaca')]: look('m', '#d4a574', '#d9d9d9', 'bald', 'beard', false, 'old', '#2f4a32', 'suit'),
    [L('Vakfın avukatı')]: look('m', '#d4a574', '#b8b8b8', 'side', 'mustache', true, '', '#2d3748', 'suit'),
    [L('Ali Demir')]: look('m', '#c68642', '#1a1a1a', 'bald', 'beard', false, '', '#2d3748', 'suit'),
    [L('Leyla Tan')]: look('f', '#f5d0c5', '#6b2d12', 'bun', 'none', true, '', '#4a5568', 'shirt'),

    // Act 2, debt: the capital and Selami Kuru
    [L('Ferit Ekinci')]: look('m', '#e8beac', '#8f8f8f', 'side', 'none', true, '', '#1a365d', 'suit'),
    [L('Elif Demir')]: look('f', '#e8beac', '#1a1a1a', 'bun', 'none', false, '', '#2d3748', 'shirt', true),
    [L('Nermin Saygın')]: look('f', '#d4a574', '#6b2d12', 'bob', 'none', true, '', '#5a2a2a', 'sweater', true),
    [L('Cahit Ural')]: look('m', '#f5d0c5', '#b8b8b8', 'side', 'mustache', true, 'old', '#4a5568', 'suit'),
    [L('Selami Kuru')]: look('m', '#e8beac', '#d9d9d9', 'short', 'mustache', false, 'old', '#1a365d', 'suit'),
    [L('Selami\'nin avukatı')]: look('m', '#e8beac', '#4a3728', 'side', 'none', false, '', '#1a365d', 'shirt'),
    [L('Şirketin eski çalışanı')]: look('m', '#f5d0c5', '#a8742a', 'short', 'beard', true, '', '#4a5568', 'shirt'),
};

// The fixed look of a story person, or null for anyone else
export function storyLook(name) {
    return PEOPLE[name] || null;
}
