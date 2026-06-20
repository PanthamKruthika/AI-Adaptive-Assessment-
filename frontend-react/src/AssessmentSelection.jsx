import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Header/Navbar";
import Footer from "./Home/Footer";
import subjBg from "./assets/2.png";
import  api  from "./api";
import "./AssessmentSelection.css";

const NAV_ITEMS = [
  { label: "HOME", path: "/" },
  { label: "SUBJECTS", path: "/subjects" },
];

const FlipCard = ({ topic, index, starting, onStart }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={`flip-card${flipped ? " flipped" : ""}`}>
      <div className="flip-card-inner">
        <div
          className="flip-card-front"
          onClick={() => setFlipped(true)}
        >
          
          <p className="card-topic-name">{topic.name}</p>
          <span className="card-hint">tap to reveal →</span>
        </div>

        <div className="flip-card-back">
          <span className="card-back-label">Assessment</span>
         

          <button
            type="button"
            className="start-btn"
            disabled={starting === topic.id}
            onClick={() => onStart(topic.id)}
          >
            {starting === topic.id ? "Starting..." : "Start Assessment"}
          </button>

          <button
            type="button"
            className="back-link"
            onClick={() => setFlipped(false)}
          >
            ← flip back
          </button>
        </div>
      </div>
    </div>
  );
};

const AssessmentSelection = ({ onLogout }) => {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(null);
  const [error, setError] = useState(null);

  const isStartingRef = useRef(false);

  // ---------------- FETCH TOPICS ----------------
  const fetchTopics = useCallback(() => {
    if (!subjectId) {
      setError("Invalid subject. Please go back.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let cancelled = false;

    api
      .get(`/topics/${subjectId}`)
      .then((res) => {
        if (cancelled) return;

        const data = Array.isArray(res.data) ? res.data : [];
        setTopics(data);
        setSelectedTopic(data.length ? data[0].id : null);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load topics. Please try again.");
          setTopics([]);
          setSelectedTopic(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [subjectId]);

  useEffect(() => {
    setTopics([]);
    setSelectedTopic(null);
    setError(null);
    const cleanup = fetchTopics();
    return () => cleanup?.();
  }, [fetchTopics]);

  // ---------------- START ASSESSMENT ----------------
  const handleStart = async (topicId) => {
    if (isStartingRef.current) return;

    isStartingRef.current = true;
    setStarting(topicId);
    setError(null);

    try {
      const res = await api.post("/start/", {
        topic_id: topicId,
      });

      navigate(`/assessment/${subjectId}`, {
        state: {
          session_id: res.data.session_id,
          question: res.data.question,
          options: res.data.options,
          question_id: res.data.question_id,
        },
      });
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError("Could not start assessment. Please try again.");
      }
    } finally {
      isStartingRef.current = false;
      setStarting(null);
    }
  };

  const visibleTopics = selectedTopic
    ? topics.filter((t) => t.id === selectedTopic)
    : topics;

  return (
    <div className="assessment-selection-page">
      <div
        className="assessment-selection-bg"
        style={{ backgroundImage: `url(${subjBg})` }}
      />
      <div className="assessment-selection-overlay" />

      <Navbar items={NAV_ITEMS} onLogout={onLogout} />

      <div className="assessment-selection-content">
        <h2 className="assessment-selection-title">Select Assessment</h2>

        {error && (
          <div className="error-box">
            <span>{error}</span>
            <button
              type="button"
              className="retry-btn"
              onClick={fetchTopics}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <p className="info-text">Loading topics...</p>
        ) : topics.length === 0 ? (
          <p className="info-text">No topics found.</p>
        ) : (
          <div className="topic-row">
            {topics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className={`topic-pill ${
                  selectedTopic === topic.id ? "active" : ""
                }`}
                onClick={() => setSelectedTopic(topic.id)}
              >
                {topic.name}
              </button>
            ))}
          </div>
        )}

        {!loading && visibleTopics.length > 0 && (
          <div className="cards-grid">
            {visibleTopics.map((topic, i) => (
              <FlipCard
                key={topic.id}
                topic={topic}
                index={i}
                starting={starting}
                onStart={handleStart}
              />
            ))}
          </div>
        )}

        {!loading && visibleTopics.length === 0 && !error && (
          <p className="info-text">
            No assessments available for this topic.
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AssessmentSelection;