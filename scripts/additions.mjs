import fs from 'node:fs';

// Merge additions into glossary, deduping and sorting by term

const base = JSON.parse(fs.readFileSync('data/glossary.json', 'utf8'));
const adds = JSON.parse(fs.readFileSync('data/additions.json', 'utf8'));

const byTerm = new Map();
[...base, ...adds].forEach(x => {
    if (!x?.term || !x?.def) return;
    byTerm.set(x.term.trim(), { ...byTerm.get(x.term.trim()), ...x });
});

const merged = [...byTerm.values()].sort((a, b) => a.term.localeCompare(b.term));
fs.writeFileSync('data/glossary.json', JSON.stringify(merged, null, 2));
// console.log(JSON.stringify(Object.values(merged[0]), null, 2));
console.log(`Merged ${base.length} + ${adds.length} → ${merged.length} unique terms.`);
