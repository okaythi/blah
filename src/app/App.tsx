import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { S } from '../pages/SearchPage';
import { A } from '../pages/AdminPage';
import { I } from '../pages/IndexPage';
import { CulturePage } from '../pages/CulturePage';
import { Footer } from '../components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<S />} />
          <Route path="/woordenlijst" element={<I />} />
          <Route path="/admin" element={<A />} />
          <Route path="/cultuur" element={<CulturePage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
