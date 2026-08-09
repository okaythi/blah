import { Link, useLocation } from "react-router-dom";
import { Search, List, Landmark } from "lucide-react";

export const Nav = () => {
  const loc = useLocation();
  const isSearch = loc.pathname === "/";

  return (
    <div className="nav-wrap">
      <div className="nav-pill">
        <Link to="/" className={`nav-item ${loc.pathname === "/" ? "nav-item--active" : ""}`}>
          <Search size={16} />
          <span>Opzoeken</span>
        </Link>
        <Link to="/woordenlijst" className={`nav-item ${loc.pathname === "/woordenlijst" ? "nav-item--active" : ""}`}>
          <List size={16} />
          <span>Woordenlijst</span>
        </Link>
        <Link to="/cultuur" className={`nav-item ${loc.pathname === "/cultuur" ? "nav-item--active" : ""}`}>
          <Landmark size={16} />
          <span>Cultuur</span>
        </Link>
      </div>
    </div>
  );
};
