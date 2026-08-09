export const Footer = () => {
  return (
    <footer style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "24px",
      marginTop: "auto",
      borderTop: "1px solid var(--gls-br)",
      background: "var(--bg)",
      color: "var(--fg2)",
      fontSize: "0.9rem"
    }}>
      <div className="footer-left" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Wapen_van_Vlaams-Brabant.svg Placeholder */}
        <div style={{ width: "40px", height: "40px", background: "var(--gls2)", borderRadius: "var(--br-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span>VB</span>
        </div>
        <div>
          <strong>Provincie Vlaams-Brabant</strong>
        </div>
      </div>
      
      <div className="footer-center" style={{ textAlign: "center", flex: 1 }}>
        <p>&copy; {new Date().getFullYear()} 't Lanes Woordenboek. Alle rechten voorbehouden.</p>
      </div>

      <div className="footer-right" style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "flex-end" }}>
        <div>
          <strong>Stad Landen</strong>
        </div>
        {/* Landen Gemeentewapen SVG Placeholder */}
        <div style={{ width: "40px", height: "40px", background: "var(--gls2)", borderRadius: "var(--br-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span>LA</span>
        </div>
      </div>
    </footer>
  );
};
