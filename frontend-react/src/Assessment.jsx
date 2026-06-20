import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "./api";
import Navbar from "./Header/Navbar";
import "./Assessment.css";
import eduBG from "./assets/exam.png";

const NAV_ITEMS = [
  { label: "HOME", path: "/" },
  { label: "SUBJECTS", path: "/subjects" },
];

const BG_STYLE = {
  backgroundImage: `linear-gradient(rgba(10,11,30,0.85), rgba(10,11,30,0.85)), url(${eduBG})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  minHeight: "100vh",
  width: "100%",
};

const getScorePercent = (score, total) =>
  total ? Math.round((score / total) * 100) : null;

const Assessment = ({ onLogout }) => {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const location = useLocation();

  const sessionId = location.state?.session_id;
  const initialQuestion = location.state?.question;
  const initialOptions = location.state?.options;
  const initialQuestionId = location.state?.question_id;

  const [questionData, setQuestionData] = useState(() =>
    sessionId && initialQuestion && Array.isArray(initialOptions)
      ? {
          question: initialQuestion,
          options: initialOptions,
          question_id: initialQuestionId,
        }
      : null
  );

  const [currentNum, setCurrentNum] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const isSubmitting = useRef(false);
  const abortRef = useRef(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!sessionId) {
      navigate(`/assessment-selection/${subjectId}`, { replace: true });
    }
  }, [sessionId, subjectId, navigate]);

  const handleAxiosError = (err) => {
    if (err.name === "AbortError" || err.code === "ERR_CANCELED") return;

    if (err.code === "ECONNABORTED") {
      setError("Request timed out. Check your connection.");
    } else if (err.response?.status === 401) {
      setError("Session expired. Please start again.");
      setTimeout(() => {
        navigate(`/assessment-selection/${subjectId}`, { replace: true });
      }, 1200);
    } else if (err.response) {
      setError(
        `Server error ${err.response.status}: ${
          err.response.data?.detail || "Unknown error"
        }`
      );
    } else if (err.request) {
      setError("No response from server.");
    } else {
      setError("Unexpected error.");
    }
  };

  const handleSubmit = async () => {
    if (selectedOption == null || !questionData || isSubmitting.current) return;

    if (!sessionId) {
      setError("Session is missing. Please restart.");
      return;
    }

    if (questionData.question_id == null) {
      setError("Question data is incomplete. Please restart.");
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("User not authenticated. Please log in again.");
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    isSubmitting.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post(
        "/submit/",
        {
          session_id: sessionId,
          question_id: questionData.question_id,
          selected_option: selectedOption,
        },
        {
          signal: abortRef.current.signal,
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const {
        completed,
        question,
        options,
        question_id,
        score,
        total_questions,
      } = res.data;

      if (completed) {
        setResult({
          score: score ?? 0,
          total_questions: total_questions ?? null,
        });
        setIsComplete(true);
      } else if (question && Array.isArray(options) && question_id != null) {
        setQuestionData({ question, options, question_id });
        setCurrentNum((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setIsLoading(false);
      isSubmitting.current = false;
    }
  };

  if (isComplete && result) {
    const percent = getScorePercent(result.score, result.total_questions);

    return (
      <div className="assessment-page assessment-page--centered" style={BG_STYLE}>
        <Navbar items={NAV_ITEMS} onLogout={onLogout} />

        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "18px",
            padding: "40px 30px",
            width: "min(90%, 420px)",
            textAlign: "center",
            color: "white",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            marginTop: "100px",
          }}
        >
          <h1 style={{ marginBottom: "10px", fontSize: "2rem" }}>
            Congratulations!
          </h1>

          <p style={{ marginBottom: "25px", color: "rgba(255,255,255,0.8)" }}>
            You completed the assessment.
          </p>

          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "1rem",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              Your Score
            </p>

            <h2 style={{ margin: "10px 0 0", fontSize: "3rem", color: "#fff" }}>
              {result.score}
            </h2>

            {result.total_questions != null && (
              <p style={{ marginTop: "8px", color: "rgba(255,255,255,0.75)" }}>
                out of {result.total_questions}
              </p>
            )}

            {percent != null && (
              <p style={{ marginTop: "8px", color: "rgba(255,255,255,0.75)" }}>
                {percent}%
              </p>
            )}
          </div>

          <button
            onClick={() => navigate(`/assessment-selection/${subjectId}`)}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              background: "#7174aa",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!questionData) {
    return (
      <div className="assessment-page assessment-page--centered" style={BG_STYLE}>
        <div className="assessment-container">
          <p style={{ color: "white", fontSize: "1.1rem" }}>
            Loading assessment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-page assessment-page--top" style={BG_STYLE}>
      <div className="assessment-container">
        <div className="assessment-header">
          <div className="question-counter">Question {currentNum}</div>
        </div>

        {error && (
          <div className="error-banner" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <div className="question-card" aria-live="polite">
          <h2 className="question-text">{questionData.question}</h2>

          <div className="options-grid">
            {questionData.options.map((option, index) => (
              <button
                key={`${index}-${option}`}
                className={`option-btn ${selectedOption === option ? "selected" : ""}`}
                onClick={() => setSelectedOption(option)}
                disabled={isLoading}
                aria-pressed={selectedOption === option}
              >
                <span className="option-label" aria-hidden="true">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="assessment-footer assessment-footer--end">
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={isLoading || selectedOption == null}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;