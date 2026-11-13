// Quick checks of game rules that the random playthroughs cannot pin down.
// Run with npm test (before the playthroughs).
import { createFamily, conscienceFamilyChange, CONSCIENCE_RETURN } from '../scripts/family.js';

const problems = [];
const expect = (label, actual, wanted) => {
    if (actual !== wanted) problems.push(`${label}: "${actual}", beklenen "${wanted}"`);
};

// Conscience at 0: Deniz leaves; back at CONSCIENCE_RETURN; stays away below it
{
    const s = { conscience: 0, family: createFamily() };
    expect('vicdan 0 → eş gider', conscienceFamilyChange(s), 'leave');
    expect('eş evde değil', s.family.spouseLeft, true);
    expect('ikinci akşam yine 0 → değişiklik yok', conscienceFamilyChange(s), null);
    s.conscience = CONSCIENCE_RETURN - 1;
    expect(`vicdan ${CONSCIENCE_RETURN - 1} → dönmez`, conscienceFamilyChange(s), null);
    s.conscience = CONSCIENCE_RETURN;
    expect(`vicdan ${CONSCIENCE_RETURN} → eş döner`, conscienceFamilyChange(s), 'return');
    expect('eş evde', s.family.spouseLeft, false);
}

// Leaving after a family quarrel is not undone by a good conscience
{
    const s = { conscience: 90, family: { ...createFamily(), spouseLeft: true } };
    expect('kavga yüzünden giden eş vicdanla dönmez', conscienceFamilyChange(s), null);
    expect('eş hâlâ evde değil', s.family.spouseLeft, true);
}

if (problems.length) {
    console.log('✗ Kural kontrolleri:\n  ' + problems.join('\n  '));
    process.exit(1);
}
console.log('✓ Kural kontrolleri geçti');
