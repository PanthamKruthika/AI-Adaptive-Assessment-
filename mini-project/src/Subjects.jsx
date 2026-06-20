import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import subjBg from "./assets/3.png";
import Footer from "./Home/Footer";

const Subjects = () => {
  const navigate = useNavigate();

  const [subjectList, setSubjectList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/subjects/");
        const data = Array.isArray(res.data) ? res.data : [];

        setSubjectList(data);
      } catch (err) {
        console.error("Failed to load subjects", err);
        setError("Failed to load subjects. Please try again.");
        setSubjectList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleCardClick = (subjectId) => {
    navigate(`/assessment-selection/${subjectId}`);
  };

  const handleViewAssessment = (e, subjectId) => {
    e.stopPropagation();
    navigate(`/assessment-selection/${subjectId}`);
  };

  return (
    <div style={pageStyle}>
      {/* Background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url(${subjBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div style={contentStyle}>
        <h2 style={titleStyle}>Choose a subject</h2>

        {loading ? (
          <p style={infoTextStyle}>Loading subjects...</p>
        ) : subjectList.length === 0 ? (
          <p style={infoTextStyle}>
            {error || "No subjects available."}
          </p>
        ) : (
          <>
            {error && <p style={errorTextStyle}>{error}</p>}

            <div style={gridStyle}>
              {subjectList.map((sub) => (
                <div
                  key={sub.id}
                  style={cardStyle}
                  onClick={() => handleCardClick(sub.id)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <h3 style={subjectNameStyle}>{sub.name}</h3>

                  <button
                    type="button"
                    style={selectBtnStyle}
                    onClick={(e) => handleViewAssessment(e, sub.id)}
                  >
                    View Assessment
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ marginTop: "auto", width: "100%" }}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Subjects;

//////////////////////////////////////////////////////
// STYLES
//////////////////////////////////////////////////////

const pageStyle = {
  minHeight: "100vh",
  width: "100%",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  overflowX: "hidden",
  backgroundColor: "#0a0b1e",
};

const contentStyle = {
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "140px 0 0",
};

const titleStyle = {
  fontSize: "3rem",
  marginBottom: "50px",
  color: "rgb(234, 228, 213)",
  fontFamily: "fangsong",
  textShadow: "2px 2px 10px rgba(0,0,0,0.8)",
};

const gridStyle = {
  display: "flex",
  gap: "25px",
  flexWrap: "wrap",
  justifyContent: "center",
  maxWidth: "1200px",
  width: "100%",
  padding: "0 10px",
};

const cardStyle = {
  flex: "1 1 260px",
  maxWidth: "280px",
  padding: "40px 20px",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))",
  borderRadius: "24px",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.15)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
};

const subjectNameStyle = {
  fontSize: "1.5rem",
  marginBottom: "20px",
  color: "rgb(234, 228, 213)",
};

const selectBtnStyle = {
  padding: "12px 20px",
  backgroundColor: "#7174aa",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
};

const infoTextStyle = {
  color: "rgba(234, 228, 213, 0.8)",
  fontSize: "1.1rem",
};

const errorTextStyle = {
  color: "#ff7c7c",
  fontSize: "1.1rem",
  marginBottom: "20px",
};