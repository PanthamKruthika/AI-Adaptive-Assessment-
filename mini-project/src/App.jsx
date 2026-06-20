import React, { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Home from "./Home/Home";
import Login from "./Login";
import Navbar from "./Header/Navbar";
import Subjects from "./Subjects";
import AssessmentSelection from "./AssessmentSelection";
import Assessment from "./Assessment";
import AssessmentDashboard from "./AssessmentDashboard";

import bgImage from "./assets/home.png";



const NAV_ITEMS = [
  { label: "HOME", path: "/" },
  { label: "SUBJECTS", path: "/subjects" },
  { label: "DASHBOARD", path: "/dashboard" },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("access_token")
  );

  const navigate = useNavigate();
  const location = useLocation();

  

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate("/");
  };



  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setIsLoggedIn(false);

    navigate("/", { replace: true });
  };

  
  const isAssessmentPage =
    location.pathname.startsWith("/assessment/") ||
    location.pathname === "/assessment";

  
  const showNavbar = isLoggedIn && !isAssessmentPage;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        backgroundColor: "#000",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      

      {!isAssessmentPage && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          />
        </div>
      )}

      

      {showNavbar && (
        <Navbar
          items={NAV_ITEMS}
          onLogout={handleLogout}
        />
      )}

    

      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
        }}
      >
        <Routes>

          {/* HOME */}

          <Route
            path="/"
            element={
              <Home
                isLoggedIn={isLoggedIn}
                onStart={(path = "/login") =>
                  navigate(path)
                }
              />
            }
          />

      

          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Login
                  onLoginSuccess={handleLoginSuccess}
                  onBack={() => navigate("/")}
                />
              )
            }
          />

          

          <Route
            path="/subjects"
            element={
              isLoggedIn ? (
                <Subjects />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          

          <Route
            path="/assessment-selection/:subjectId"
            element={
              isLoggedIn ? (
                <AssessmentSelection
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

         

          <Route
            path="/assessment/:subjectId"
            element={
              isLoggedIn ? (
                <Assessment
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

         

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <AssessmentDashboard
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

        

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;