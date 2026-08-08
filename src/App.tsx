import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { S } from './pages/S';
import { A } from './pages/A';
import { I } from './pages/I';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<S />} />
        <Route path="/woordenlijst" element={<I />} />
        <Route path="/admin" element={<A />} />
      </Routes>
    </BrowserRouter>
  );
}
