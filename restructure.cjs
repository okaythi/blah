const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'src');

const mkdir = p => !fs.existsSync(p) && fs.mkdirSync(p, { recursive: true });

mkdir(path.join(src, 'app'));
mkdir(path.join(src, 'features', 'dictionary', 'api'));
mkdir(path.join(src, 'features', 'admin', 'components'));

const move = (from, to) => {
  if (fs.existsSync(path.join(src, from))) {
    fs.renameSync(path.join(src, from), path.join(src, to));
  }
};

// Phase 4: Folder Restructure
move('App.tsx', 'app/App.tsx');
move('main.tsx', 'app/main.tsx');
move('pages/S.tsx', 'pages/SearchPage.tsx');
move('pages/I.tsx', 'pages/IndexPage.tsx');
move('pages/A.tsx', 'pages/AdminPage.tsx');
move('components/EF.tsx', 'features/admin/components/EF.tsx');

// Note: I will use a global search-replace (sed-like) script to fix imports next.
console.log('Folders restructured.');
