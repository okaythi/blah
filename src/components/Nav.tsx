import { Link, useLocation } from "react-router-dom";
import { Search, List } from "lucide-react";

export const Nav = () => {
  const loc = useLocation();
  const isSearch = loc.pathname === "/";

  return (
    <div className="nav-wrap">
      <div className="nav-pill">
        <Link to="/" className={`nav-item ${isSearch ? "nav-item--active" : ""}`}>
          <Search size={16} />
          <span>Opzoeken</span>
        </Link>
        <Link to="/woordenlijst" className={`nav-item ${!isSearch ? "nav-item--active" : ""}`}>
          <List size={16} />
          <span>Woordenlijst</span>
        </Link>
      </div>
    </div>
  );
};
