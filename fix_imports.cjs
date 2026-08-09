const fs = require('fs');
const path = require('path');

const repl = (file, search, replace) => {
  const p = path.join(__dirname, 'src', file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(p, content);
  }
};

// Fix App.tsx
repl('app/App.tsx', "import { S } from './pages/S';", "import { S } from '../pages/SearchPage';");
repl('app/App.tsx', "import { A } from './pages/A';", "import { A } from '../pages/AdminPage';");
repl('app/App.tsx', "import { I } from './pages/I';", "import { I } from '../pages/IndexPage';");

// Fix main.tsx
repl('app/main.tsx', "import App from './App.tsx'", "import App from './App.tsx'"); // actually already in app/
repl('app/main.tsx', "import './index.css'", "import '../index.css'");

// Fix index.html
const indexHtml = path.join(__dirname, 'index.html');
if (fs.existsSync(indexHtml)) {
  let content = fs.readFileSync(indexHtml, 'utf8');
  content = content.replace('src="/src/main.tsx"', 'src="/src/app/main.tsx"');
  fs.writeFileSync(indexHtml, content);
}

// AdminPage needs EF from features/admin
repl('pages/AdminPage.tsx', 'import { EF } from "../components/EF";', 'import { EF } from "../features/admin/components/EF";');

console.log('Imports fixed.');
