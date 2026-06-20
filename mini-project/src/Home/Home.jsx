import React, { useEffect, useRef } from "react";
import Footer from "./Footer";

const useFadeInOnScroll = () => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.15 }
    );

    const children = ref.current?.querySelectorAll(".fade-card");
    children?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
};

const Home = ({ onStart, isLoggedIn }) => {
  const howItWorksRef = useFadeInOnScroll();
  const featuresRef = useFadeInOnScroll();

  const howItWorks = [
    {
      id: 1,
      title: "Analyze",
      desc: "We evaluate your skill level using adaptive AI.",
    },
    {
      id: 2,
      title: "Adapt",
      desc: "Dynamically adjust question difficulty in real time based on learner responses.",
    },
    {
      id: 3,
      title: "Track Performance",
      desc: "Visualize scores and analytics through interactive dashboards.",
    },
  ];

  const features = [
    {
      id: "realtime",
      title: "Real-time Difficulty Adjustment",
      desc: "AI evaluates your level and shifts question complexity instantly.",
    },
    {
      id: "reports",
      title: "Personalized Performance Reports",
      desc: "Detailed breakdown of your strengths and areas for growth.",
    },
    {
      id: "insights",
      title: "Data-driven Insights",
      desc: "Actionable analytics to track your learning progress over time.",
    },
    {
      id: "skillgap",
      title: "Skill Gap Identification",
      desc: "Pinpoint exactly which concepts need more focus and practice.",
    },
    {
      id: "secure",
      title: "Secure and Scalable System",
      desc: "Built for high performance with robust data protection.",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes lineReveal {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255,255,255,0.08);
          transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, background 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .glass-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
        }

        .glass-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(113, 116, 170, 0.5);
          box-shadow:
            0 20px 56px rgba(0, 0, 0, 0.5),
            0 0 28px rgba(113, 116, 170, 0.3),
            inset 0 1px 0 rgba(255,255,255,0.14);
        }

        .glass-btn {
          padding: 13px 36px;
          font-size: 1.1rem;
          cursor: pointer;
          margin-top: 40px;
          background: rgba(113, 116, 170, 0.2);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          color: white;
          border: 1px solid rgba(113, 116, 170, 0.45);
          border-radius: 12px;
          font-weight: bold;
          letter-spacing: 0.03em;
          box-shadow: 0 4px 20px rgba(113, 116, 170, 0.25), inset 0 1px 0 rgba(255,255,255,0.12);
          transition: transform 0.2s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
          position: relative;
          overflow: hidden;
        }

        .glass-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        }

        .glass-btn:hover {
          transform: scale(1.05);
          background: rgba(113, 116, 170, 0.4);
          border-color: rgba(113, 116, 170, 0.75);
          box-shadow: 0 8px 32px rgba(113, 116, 170, 0.5), inset 0 1px 0 rgba(255,255,255,0.2);
        }

        .glass-btn:active {
          transform: scale(0.97);
        }

        .step-number {
          font-size: 3rem;
          font-weight: bold;
          color: rgba(160, 163, 210, 0.8);
          margin-bottom: 15px;
          transition: color 0.3s ease, text-shadow 0.3s ease;
        }

        .glass-card:hover .step-number {
          color: rgba(190, 193, 240, 1);
          text-shadow: 0 0 22px rgba(113, 116, 170, 0.8);
        }

        .feature-title {
          color: rgba(160, 163, 210, 0.9);
          margin-bottom: 15px;
          font-size: 1.4rem;
          transition: color 0.3s ease, text-shadow 0.3s ease;
        }

        .glass-card:hover .feature-title {
          color: rgba(190, 193, 240, 1);
          text-shadow: 0 0 14px rgba(113, 116, 170, 0.5);
        }
      `}</style>

      {!isLoggedIn ? (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            color: "white",
            padding: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(3rem, 10vw, 5.5rem)",
              marginBottom: "20px",
              color: "rgb(234, 228, 213)",
              fontWeight: "bolder",
              fontFamily: "fangsong",
              textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
              lineHeight: "1.2",
              animation: "heroFadeUp 0.8s ease forwards",
            }}
          >
            AI ADAPTIVE ASSESSMENT
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 3vw, 1.4rem)",
              maxWidth: "700px",
              color: "rgb(182, 176, 159)",
              fontFamily: "math",
              textShadow: "1px 1px 5px rgba(0,0,0,0.8)",
              animation: "heroFadeUp 0.8s ease 0.2s forwards",
            }}
          >
            Personalized Evaluations Designed to Understand and Elevate Every
            Learner.
          </p>

          <button className="glass-btn" onClick={() => onStart("/login")}>
            Get Started
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            width: "100%",
            backgroundColor: "transparent",
          }}
        >
          <div style={{ position: "relative", flex: "1 0 auto", width: "100%" }}>
            <div
              style={{
                position: "relative",
                zIndex: 1,
                textAlign: "center",
                padding:
                  "clamp(250px, 25vw, 280px) clamp(20px, 5vw, 50px) 80px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <h1
                style={{
                  fontSize: "clamp(3.5rem, 10vw, 6rem)",
                  marginBottom: "30px",
                  color: "rgb(234, 228, 213)",
                  fontWeight: "bolder",
                  fontFamily: "fangsong",
                  textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
                  lineHeight: "1.2",
                  animation: "heroFadeUp 0.8s ease forwards",
                }}
              >
                AI ADAPTIVE ASSESSMENT
              </h1>

              <p
                style={{
                  fontSize: "clamp(1rem, 3vw, 1.5rem)",
                  maxWidth: "750px",
                  color: "rgb(182, 176, 159)",
                  fontFamily: "math",
                  textShadow: "1px 1px 5px rgba(0,0,0,0.8)",
                  padding: "0 10px",
                  animation: "heroFadeUp 0.8s ease 0.2s forwards",
                }}
              >
                Personalized Evaluations Designed to Understand and Elevate Every
                Learner.
              </p>

              <div style={{ marginBottom: "80px", marginTop: "50px" }}>
                <button className="glass-btn" onClick={() => onStart("/subjects")}>
                  Start Assessment
                </button>
              </div>

              <div
                style={{ width: "100%", maxWidth: "1100px", marginBottom: "80px" }}
              >
                <div style={{ textAlign: "center", marginBottom: "50px" }}>
                  <h2 style={sectionTitleStyle}>
                    How It Works
                    <span style={underlineStyle} />
                  </h2>
                </div>

                <div ref={howItWorksRef} style={gridStyle}>
                  {howItWorks.map((step, index) => (
                    <div
                      key={step.id}
                      className="glass-card fade-card"
                      style={{
                        flex: "1 1 280px",
                        maxWidth: "350px",
                        padding: "35px",
                        opacity: 0,
                        transform: "translateY(28px)",
                        transition: "opacity 0.6s ease, transform 0.6s ease",
                        transitionDelay: `${index * 0.12}s`,
                      }}
                    >
                      <div className="step-number">{step.id}</div>
                      <h3
                        style={{
                          marginBottom: "12px",
                          fontSize: "1.6rem",
                          color: "rgb(220, 215, 200)",
                        }}
                      >
                        {step.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "1.1rem",
                          opacity: 0.75,
                          lineHeight: "1.6",
                          color: "rgb(190, 185, 170)",
                        }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ width: "100%", maxWidth: "1200px" }}>
                <div style={{ textAlign: "center", marginBottom: "50px" }}>
                  <h2 style={sectionTitleStyle}>
                    Key Features
                    <span style={underlineStyle} />
                  </h2>
                </div>

                <div ref={featuresRef} style={gridStyle}>
                  {features.map((feature, index) => (
                    <div
                      key={feature.id}
                      className="glass-card fade-card"
                      style={{
                        flex: "1 1 320px",
                        maxWidth: "400px",
                        padding: "30px",
                        textAlign: "left",
                        opacity: 0,
                        transform: "translateY(28px)",
                        transition: "opacity 0.6s ease, transform 0.6s ease",
                        transitionDelay: `${index * 0.1}s`,
                      }}
                    >
                      <h3 className="feature-title">{feature.title}</h3>
                      <p
                        style={{
                          fontSize: "1.05rem",
                          opacity: 0.75,
                          lineHeight: "1.6",
                          color: "rgb(190, 185, 170)",
                        }}
                      >
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      )}
    </>
  );
};

const sectionTitleStyle = {
  fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
  color: "rgb(234, 228, 213)",
  fontFamily: "fangsong",
  marginBottom: "0",
  position: "relative",
  display: "inline-block",
};

const underlineStyle = {
  display: "block",
  height: "1px",
  background:
    "linear-gradient(90deg, transparent, rgba(113, 116, 170, 0.7), transparent)",
  marginTop: "10px",
  animation: "lineReveal 0.8s ease forwards",
  transformOrigin: "left",
};

const gridStyle = {
  display: "flex",
  gap: "25px",
  flexWrap: "wrap",
  justifyContent: "center",
};

export default Home;