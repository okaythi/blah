import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { S } from '../pages/SearchPage';
import { A } from '../pages/AdminPage';
import { I } from '../pages/IndexPage';

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
