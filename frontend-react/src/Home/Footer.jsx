import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const FONT = "'Cormorant Garamond', fangsong, STFangsong, Georgia, serif";

// ---------------------------------------------------------------------------
// Routes for pages that already exist
// ---------------------------------------------------------------------------
const ROUTES = {
  "How It Works": "/how-it-works",
  "Subjects":     "/subjects",
  "Assessments":  "/assessments",
};

// ---------------------------------------------------------------------------
// Static styles
// ---------------------------------------------------------------------------
const FOOTER_STYLE = {
  width:         "100%",
  marginTop:     "auto",
  padding:       "28px 20px 12px",
  background:    "rgba(91, 107, 127, 0.86)",
  color:         "rgb(182, 176, 159)",
  fontFamily:    FONT,
  display:       "flex",
  flexDirection: "column",
  alignItems:    "center",
  boxSizing:     "border-box",
  position:      "relative",
};

const COLUMNS_STYLE = {
  display:        "flex",
  justifyContent: "center",
  width:          "100%",
  maxWidth:       "860px",
  flexWrap:       "wrap",
  gap:            "40px",
  textAlign:      "center",
};

const COL_BRAND_STYLE = {
  flex:     "1 1 200px",
  maxWidth: "240px",
};

const COL_STYLE = {
  flex: "1 1 130px",
};

const BRAND_HEADING_STYLE = {
  color:         "rgb(234, 228, 213)",
  fontFamily:    FONT,
  marginBottom:  "6px",
  fontSize:      "0.97rem",
  letterSpacing: "0.04em",
};

const BRAND_TEXT_STYLE = {
  fontSize:   "0.70rem",
  lineHeight: "1.5",
};

const COL_HEADING_STYLE = {
  color:        "rgb(234, 228, 213)",
  fontFamily:   FONT,
  marginBottom: "6px",
  fontSize:     "0.88rem",
  fontWeight:   "600",
};

const LIST_STYLE = {
  listStyle:  "none",
  padding:    0,
  margin:     0,
  fontSize:   "0.75rem",
  lineHeight: "1.8",
};

const LINK_STYLE = {
  cursor:     "pointer",
  transition: "color 0.2s",
  color:      "inherit",
  background: "none",
  border:     "none",
  padding:    0,
  fontFamily: FONT,
  fontSize:   "0.75rem",
};

const DIVIDER_STYLE = {
  borderTop:  "1px solid rgba(56, 40, 40, 0.1)",
  width:      "100%",
  textAlign:  "center",
  marginTop:  "18px",
  paddingTop: "8px",
  fontSize:   "0.68rem",
  opacity:    0.55,
};

// Toast shown for pages not yet built
const TOAST_STYLE = {
  position:     "absolute",
  bottom:       "60px",
  left:         "50%",
  transform:    "translateX(-50%)",
  background:   "rgba(121, 124, 179, 0.92)",
  color:        "white",
  padding:      "8px 20px",
  borderRadius: "999px",
  fontSize:     "0.78rem",
  fontFamily:   FONT,
  whiteSpace:   "nowrap",
  pointerEvents:"none",
  animation:    "footerFadeIn 0.2s ease",
  zIndex:       100,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const Footer = () => {
  const navigate  = useNavigate();
  const year      = new Date().getFullYear();
  const [toast, setToast] = useState(null);

  const handleLink = useCallback((label) => {
    if (ROUTES[label]) {
      navigate(ROUTES[label]);
    } else {
      // Page not built yet — show a brief toast instead of a broken route
      setToast(`${label} — coming soon`);
      setTimeout(() => setToast(null), 2000);
    }
  }, [navigate]);

  const LinkItem = ({ label }) => (
    <li>
      <button
        style={LINK_STYLE}
        onClick={() => handleLink(label)}
        onMouseEnter={e => e.currentTarget.style.color = "rgb(234, 228, 213)"}
        onMouseLeave={e => e.currentTarget.style.color = "inherit"}
      >
        {label}
      </button>
    </li>
  );

  return (
    <footer style={FOOTER_STYLE}>

      {/* Coming-soon toast */}
      {toast && (
        <>
          <style>{`@keyframes footerFadeIn { from { opacity:0; transform:translateX(-50%) translateY(6px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
          <div style={TOAST_STYLE}>{toast}</div>
        </>
      )}

      <div style={COLUMNS_STYLE}>

        {/* Brand */}
        <div style={COL_BRAND_STYLE}>
          <h3 style={BRAND_HEADING_STYLE}>AI ADAPTIVE ASSESSMENT</h3>
          <p style={BRAND_TEXT_STYLE}>
            Intelligent, real-time difficulty adjustment and personalised feedback
            for every learner.
          </p>
        </div>

        {/* Platform — How It Works, Subjects, Assessments exist */}
        <div style={COL_STYLE}>
          <h4 style={COL_HEADING_STYLE}>Platform</h4>
          <ul style={LIST_STYLE}>
            <LinkItem label="How It Works" />
            <LinkItem label="Subjects" />
            <LinkItem label="Assessments" />
          </ul>
        </div>

      

      </div>

      <div style={DIVIDER_STYLE}>
        © {year} AI Adaptive Assessment System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;