import React, { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import api from "./api";
import Navbar from "./Header/Navbar";
import Footer from "./Home/Footer";
import bgImage from "./assets/exam.png";

/* ===================== DUMMY DATA ===================== */

// const dummyData = [
//   {
//     session_id: 1,
//     assignment: "Operating System Fundamentals",
//     topic: "Introduction to OS",
//     score: 22,
//     total_marks: 28,
//     questions_attempted: 10,
//     percentage: 78.57,
//   },
//   {
//     session_id: 2,
//     assignment: "Operating System Fundamentals",
//     topic: "Process Management",
//     score: 25,
//     total_marks: 30,
//     questions_attempted: 10,
//     percentage: 83.33,
//   },
//   {
//     session_id: 3,
//     assignment: "Database Management Systems",
//     topic: "Normalization",
//     score: 24,
//     total_marks: 30,
//     questions_attempted: 10,
//     percentage: 80.0,
//   },
//   {
//     session_id: 4,
//     assignment: "Computer Networks",
//     topic: "OSI Model",
//     score: 19,
//     total_marks: 25,
//     questions_attempted: 10,
//     percentage: 76.0,
//   },
// ];

const COLORS = [
  "#d75f5f",
  "#6fb3d5",
  "#2ecc71",
  "#3498db",
  "#f1c40f",
  "#e74c3c",
];

const AssessmentDashboard = ({ onLogout }) => {
  const [assessmentData, setAssessmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssessmentResults();
  }, []);

  const fetchAssessmentResults = async () => {
    try {
      setLoading(true);

      /* ===================== ACTUAL BACKEND CODE ===================== */

       const response = await api.get("/dashboard/results/");
       setAssessmentData(response.data || []);

      /* ===================== DUMMY DATA ===================== */

  //     setAssessmentData(dummyData);

    } catch (err) {
      console.error("Error fetching results:", err);
      setError("Failed to load performance data.");
    } finally {
      setLoading(false);
    }
  };



  const chartData = assessmentData.map((item) => ({
    ...item,

    shortTopic:
      item.topic && item.topic.length > 25
        ? item.topic.substring(0, 25) + "..."
        : item.topic,
  }));



  if (loading) {
    return <div style={INFO_PAGE}>Loading Analytics...</div>;
  }

 

  if (error) {
    return (
      <div style={{ ...INFO_PAGE, color: "#ff6b6b" }}>
        {error}
      </div>
    );
  }

 

  const totalScore = chartData.reduce(
    (sum, item) => sum + item.score,
    0
  );

  const totalMarks = chartData.reduce(
    (sum, item) => sum + item.total_marks,
    0
  );

  const totalQuestions = chartData.reduce(
    (sum, item) => sum + item.questions_attempted,
    0
  );

  const avgPercentage =
    chartData.length > 0
      ? (
          chartData.reduce(
            (sum, item) => sum + item.percentage,
            0
          ) / chartData.length
        ).toFixed(2)
      : 0;

  return (
    <div style={PAGE_STYLE}>

     

      <div style={BG_LAYER} />
      <div style={OVERLAY_LAYER} />


      <div style={{ position: "relative", zIndex: 10 }}>
        <Navbar onLogout={onLogout} />
      </div>

      

      <div style={CONTENT_STYLE}>

        <h1 style={TITLE_STYLE}>
          Performance Dashboard
        </h1>

        

        {assessmentData.length === 0 ? (
          <div style={GLASS_CARD}>
            <p style={{ color: "rgba(234,228,213,0.6)" }}>
              No assessment data available yet.
            </p>
          </div>
        ) : (

      

          <div style={GLASS_CARD}>

            <h2 style={SUBJECT_TITLE}>
              Overall Assessment Analytics
            </h2>

            
            <div style={STATS_GRID}>

              <div style={STAT_CARD}>
                <h2 style={STAT_VALUE}>
                  {totalScore}
                </h2>

                <p style={STAT_LABEL}>
                  Total Score
                </p>
              </div>

              <div style={STAT_CARD}>
                <h2 style={STAT_VALUE}>
                  {totalMarks}
                </h2>

                <p style={STAT_LABEL}>
                  Total Marks
                </p>
              </div>

              <div style={STAT_CARD}>
                <h2 style={STAT_VALUE}>
                  {totalQuestions}
                </h2>

                <p style={STAT_LABEL}>
                  Questions Attempted
                </p>
              </div>

              <div style={STAT_CARD}>
                <h2 style={STAT_VALUE}>
                  {avgPercentage}%
                </h2>

                <p style={STAT_LABEL}>
                  Average Percentage
                </p>
              </div>
            </div>

           

            <div style={TABLE_CONTAINER}>

              <h3 style={CHART_SUBTITLE}>
                Assessment Details
              </h3>

              <table style={TABLE_STYLE}>

                <thead>
                  <tr>
                    <th style={TH_STYLE}>Session ID</th>
                    <th style={TH_STYLE}>Assignment</th>
                    <th style={TH_STYLE}>Topic</th>
                    <th style={TH_STYLE}>Score</th>
                    <th style={TH_STYLE}>Total Marks</th>
                    <th style={TH_STYLE}>Questions</th>
                    <th style={TH_STYLE}>Percentage</th>
                  </tr>
                </thead>

                <tbody>

                  {chartData.map((item) => (
                    <tr key={item.session_id}>

                      <td style={TD_STYLE}>
                        {item.session_id}
                      </td>

                      <td style={TD_STYLE}>
                        {item.assignment}
                      </td>

                      <td style={TD_STYLE}>
                        {item.topic}
                      </td>

                      <td style={TD_STYLE}>
                        {item.score}
                      </td>

                      <td style={TD_STYLE}>
                        {item.total_marks}
                      </td>

                      <td style={TD_STYLE}>
                        {item.questions_attempted}
                      </td>

                      <td style={TD_STYLE}>
                        {item.percentage}%
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>
            </div>

           

            <div style={CHART_GRID}>

           

              <div style={CHART_BOX}>

                <h3 style={CHART_SUBTITLE}>
                  Proficiency by Topic (%)
                </h3>

                <ResponsiveContainer width="100%" height={320}>

                  <BarChart
                    data={chartData}
                    margin={{ bottom: 50 }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="shortTopic"
                      stroke="rgba(234,228,213,0.5)"
                      fontSize={10}
                      angle={-20}
                      textAnchor="end"
                      interval={0}
                    />

                    <YAxis
                      stroke="rgba(234,228,213,0.5)"
                      unit="%"
                    />

                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                    />

                    <Bar
                      dataKey="percentage"
                      fill="#7174aa"
                      radius={[6, 6, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>
              </div>

             

              <div style={CHART_BOX}>

                <h3 style={CHART_SUBTITLE}>
                  Score Distribution
                </h3>

                <ResponsiveContainer width="100%" height={320}>

                  <PieChart>

                    <Pie
                      data={chartData}
                      dataKey="score"
                      nameKey="topic"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                    >

                      {chartData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={
                            COLORS[index % COLORS.length]
                          }
                          stroke="none"
                        />
                      ))}

                    </Pie>

                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                    />

                    <Legend
                      wrapperStyle={{
                        color:
                          "rgba(234,228,213,0.6)",
                        fontSize: "11px",
                      }}
                    />

                  </PieChart>

                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

     

      <Footer />
    </div>
  );
};



const PAGE_STYLE = {
  minHeight: "100vh",
  width: "100%",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#0a0b1e",
  overflowX: "hidden",
};

const BG_LAYER = {
  position: "fixed",
  inset: 0,
  backgroundImage: `url(${bgImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  zIndex: 0,
};

const OVERLAY_LAYER = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(10,11,30,0.85)",
  zIndex: 1,
};

const CONTENT_STYLE = {
  position: "relative",
  zIndex: 2,
  padding: "120px 20px 60px",
  maxWidth: "1300px",
  margin: "0 auto",
  width: "100%",
};

const TITLE_STYLE = {
  fontSize: "2.7rem",
  color: "rgb(244, 243, 240)",
  textAlign: "center",
  marginBottom: "50px",
};

const GLASS_CARD = {
  background: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(15px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "24px",
  padding: "30px",
  marginBottom: "40px",
};

const SUBJECT_TITLE = {
  color: "#aaaaaa",
  marginBottom: "30px",
  borderBottom: "1px solid rgba(113,116,170,0.3)",
  paddingBottom: "15px",
};

const STATS_GRID = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px",
  marginBottom: "40px",
};

const STAT_CARD = {
  background: "#b28787",
  borderRadius: "18px",
  padding: "25px",
  textAlign: "center",
};

const STAT_VALUE = {
  color: "#f2f4f9",
  fontSize: "2rem",
};

const STAT_LABEL = {
  color: "rgba(253, 253, 254, 0.6)",
};

const TABLE_CONTAINER = {
  overflowX: "auto",
  marginBottom: "50px",
};

const TABLE_STYLE = {
  width: "100%",
  borderCollapse: "collapse",
};

const TH_STYLE = {
  color: "#aaaaaa",
  padding: "15px",
  textAlign: "left",
};

const TD_STYLE = {
  color: "rgba(110, 154, 219, 0.8)",
  padding: "14px",
};

const CHART_GRID = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
  gap: "40px",
};

const CHART_BOX = {
  textAlign: "center",
};

const CHART_SUBTITLE = {
  color: "#aaaaaa",
  marginBottom: "20px",
};

const INFO_PAGE = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#0a0b1e",
  color: "white",
};

const TOOLTIP_STYLE = {
  backgroundColor: "#181a3c",
  border: "1px solid #151c92",
  borderRadius: "10px",
  color: "#fff",
};

export default AssessmentDashboard;