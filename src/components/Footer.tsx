export const Footer = () => {
  return (
    <footer style={{
      position: "relative",
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
        <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/vlaams-brabant.svg" alt="Provincie Vlaams-Brabant" style={{ maxWidth: "100%", maxHeight: "100%", filter: "saturate(0.85) brightness(0.9)" }} />
        </div>
        <div>
          <span style={{ opacity: 0.65 }}>Provincie Vlaams-Brabant</span>
        </div>
      </div>
      
      <div className="footer-center" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
        <p>&copy; {new Date().getFullYear()} Alle rechten voorbehouden.</p>
      </div>

      <div className="footer-right" style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "flex-end" }}>
        <div>
          <span style={{ opacity: 0.65 }}>Stad Landen</span>
        </div>
        <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/landen.svg" alt="Stad Landen" style={{ maxWidth: "100%", maxHeight: "100%", filter: "saturate(0.85) brightness(0.9)" }} />
        </div>
      </div>
    </footer>
  );
};
