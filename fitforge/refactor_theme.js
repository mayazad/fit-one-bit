const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function refactorFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Global Backgrounds & Typography
    content = content.replace(/bg-slate-950/g, 'bg-zinc-950');
    content = content.replace(/bg-slate-900\/50/g, 'bg-zinc-900/50');
    content = content.replace(/bg-slate-900/g, 'bg-zinc-900');

    // Specific headers/text
    content = content.replace(/text-white/g, 'text-zinc-50');
    content = content.replace(/text-slate-400/g, 'text-zinc-400');
    content = content.replace(/text-slate-500/g, 'text-zinc-400');
    content = content.replace(/border-slate-[0-9]+/g, 'border-zinc-800');

    // Cards & Glassmorphism
    content = content.replace(/bg-white\/\[0\.0[0-9]+\]/g, 'bg-zinc-900/50');
    content = content.replace(/bg-white\/[0-9]+/g, 'bg-zinc-900/50');
    content = content.replace(/backdrop-blur-[a-z]+/g, 'backdrop-blur-md');
    // if missing backdrop-blur-md, we might need to add it manually but most have it or don't need it.
    content = content.replace(/border-white\/\[0\.0[0-9]+\]/g, 'border-zinc-800/50');
    content = content.replace(/border-white\/[0-9]+/g, 'border-zinc-800/50');

    // Remove strong drop-shadows
    content = content.replace(/shadow-lg/g, '');
    content = content.replace(/shadow-2xl/g, '');
    content = content.replace(/shadow-\w+-\d+\/\d+/g, '');
    content = content.replace(/drop-shadow-\[.*?\]/g, '');

    // Strip Neon colors and replace with Forge Ember
    const neonClasses = [
        'purple-500', 'purple-400', 'purple-600',
        'teal-500', 'teal-400', 'teal-600',
        'violet-500', 'violet-400', 'violet-600',
        'cyan-500', 'cyan-400', 'cyan-600',
        'fuchsia-500', 'fuchsia-400', 'fuchsia-600',
        'amber-500', 'amber-400', 'amber-600'
    ];

    // However, there are exceptions (Water tracker is blue, completed is emerald, destructive is red)
    // Let's globally map all these generic neon accents to orange
    for (const neon of neonClasses) {
        const base = neon.split('-')[0];
        const weight = neon.split('-')[1];
        content = content.replace(new RegExp(`bg-${base}-${weight}`, 'g'), `bg-orange-${weight}`);
        content = content.replace(new RegExp(`text-${base}-${weight}`, 'g'), `text-orange-${weight}`);
        content = content.replace(new RegExp(`border-${base}-${weight}`, 'g'), `border-orange-${weight}`);
        content = content.replace(new RegExp(`ring-${base}-${weight}`, 'g'), `ring-orange-${weight}`);
        content = content.replace(new RegExp(`from-${base}-${weight}`, 'g'), `from-orange-${weight}`);
        content = content.replace(new RegExp(`to-${base}-${weight}`, 'g'), `to-orange-${weight}`);
        content = content.replace(new RegExp(`via-${base}-${weight}`, 'g'), `via-orange-${weight}`);
    }

    // Handle gradient generic classes -> solid buttons or orange gradients
    content = content.replace(/bg-gradient-to-r from-orange-[0-9]+ to-orange-[0-9]+/g, 'bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all');
    content = content.replace(/bg-gradient-to-br from-orange-[0-9]+(?:\/.*?)? to-orange-[0-9]+(?:\/.*?)?/g, 'bg-zinc-900 border border-zinc-800');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
    }
}

walkDir('./src/app', refactorFile);
walkDir('./src/components', refactorFile);

console.log('Global obsidian replacements complete');
