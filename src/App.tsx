import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { S } from './pages/S';
import { A } from './pages/A';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<S />} />
        <Route path="/admin" element={<A />} />
      </Routes>
    </BrowserRouter>
  );
}
