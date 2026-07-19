import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const getEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
};

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Interactive Checklist States
  const [completedIngredients, setCompletedIngredients] = useState(new Set());
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  // Cooking Focus Mode States
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [currentFocusStep, setCurrentFocusStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const parseTimeFromStep = (stepText) => {
    if (!stepText) return null;
    const match = stepText.match(/(\d+)\s*(?:-|to)?\s*(\d+)?\s*(?:min|mins|minute|minutes)/i);
    if (match) {
      const minutes = Number(match[2] || match[1]);
      return minutes * 60;
    }
    return null;
  };

  const speakStep = (text) => {
    if (window.speechSynthesis) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = "sine";
        oscillator.frequency.value = 880;
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 1.2);
      } catch (e) {
        console.warn("Could not play sound:", e);
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentFocusStep, isFocusMode]);

  const toggleIngredient = (idx) => {
    setCompletedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const resetProgress = () => {
    setCompletedSteps(new Set());
    setCompletedIngredients(new Set());
    setCurrentFocusStep(0);
  };

  const markStepComplete = (idx, complete = true) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (complete) {
        next.add(idx);
      } else {
        next.delete(idx);
      }
      return next;
    });
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${recipe.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/recipes/${recipe._id}`);
      navigate("/app", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete recipe.");
    }
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/recipes/${id}`);
        setRecipe(response.data);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "Recipe not found."
            : "Failed to load recipe."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <div className="spinner" />
          Loading recipe...
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container">
        <div className="empty-state">{error || "Recipe not found."}</div>
        <button className="btn btn-secondary" onClick={() => navigate("/app")}>
          Back to Home
        </button>
      </div>
    );
  }

  const totalStepsCount = recipe.steps?.length || 0;
  const completedStepsCount = completedSteps.size;
  const progressPercentage = totalStepsCount > 0 
    ? Math.round((completedStepsCount / totalStepsCount) * 100) 
    : 0;

  const totalIngredientsCount = recipe.ingredients?.length || 0;
  const completedIngredientsCount = completedIngredients.size;
  const allIngredientsChecked = totalIngredientsCount > 0 && completedIngredientsCount === totalIngredientsCount;

  return (
    <div className="recipe-details-container">
      {/* Top Header bar with Back button and Admin controls */}
      <div className="details-page-header">
        <button className="back-btn-link" onClick={() => navigate("/app")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Recipes
        </button>

        {user?.role === "admin" && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate(`/app/admin/edit/${recipe._id}`)}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path>
              </svg>
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="recipe-grid-layout">
        {/* Left Column: Image, Stats, Video, Ingredients */}
        <div className="recipe-left-col">
          {/* Hero Card */}
          <div className="recipe-hero-card">
            <div className="recipe-hero-image-wrapper">
              <img
                src={recipe.image}
                alt={recipe.name}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800";
                }}
              />
              <span className="recipe-image-badge">{recipe.category}</span>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="recipe-stats-strip">
            <div className="stat-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className="stat-value">{recipe.cookTime || "30 mins"}</span>
              <span className="stat-label">Cook Time</span>
            </div>
            <div className="stat-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="stat-value">{recipe.ingredients?.length || 0}</span>
              <span className="stat-label">Ingredients</span>
            </div>
            <div className="stat-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              <span className="stat-value">{recipe.steps?.length || 0}</span>
              <span className="stat-label">Steps</span>
            </div>
            <div className="stat-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span className="stat-value" style={{ textTransform: "capitalize" }}>{recipe.cuisine || "Indian"}</span>
              <span className="stat-label">Cuisine</span>
            </div>
          </div>

          {/* Ingredients Checklist */}
          <div className="ingredients-card">
            <h2>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2c3.038 0 5.5 2.462 5.5 5.5a5.5 5.5 0 0 1-3.5 5.09v6.91a2.5 2.5 0 0 1-5 0v-6.91A5.5 5.5 0 0 1 6.5 7.5C6.5 4.462 8.962 2 12 2z"></path>
              </svg>
              Ingredients
            </h2>
            <div className="ingredients-checklist">
              {recipe.ingredients?.map((ing, idx) => (
                <div
                  key={idx}
                  className={`ingredient-item ${completedIngredients.has(idx) ? "completed" : ""}`}
                  onClick={() => toggleIngredient(idx)}
                >
                  <div className="ingredient-checkbox-custom">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="ingredient-name">{ing}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Title Section, Progress Tracker, Steps, Video (if exists) */}
        <div className="recipe-right-col">
          {/* Recipe Title & Meta */}
          <div className="recipe-title-section">
            <span className="eyebrow">{recipe.category}</span>
            <h1>{recipe.name}</h1>
          </div>

          {/* Dynamic Progress Tracker */}
          <div className="progress-tracker">
            <div className="progress-info">
              <span>Cooking Progress</span>
              <span className="progress-percentage">{progressPercentage}% Completed</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="progress-info" style={{ fontSize: "0.8rem", fontWeight: "normal", margin: 0 }}>
                  <span><strong>{completedStepsCount}</strong> of <strong>{totalStepsCount}</strong> steps</span>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  {(completedStepsCount > 0 || completedIngredients.size > 0) && (
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={resetProgress}
                      style={{ borderRadius: "8px", padding: "6px 12px", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      Reset
                    </button>
                  )}
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={() => {
                      if (allIngredientsChecked) {
                        setCurrentFocusStep(0);
                        setIsFocusMode(true);
                      }
                    }}
                    disabled={!allIngredientsChecked}
                    style={{ 
                      borderRadius: "8px", 
                      padding: "6px 12px", 
                      fontSize: "0.8rem", 
                      display: "inline-flex", 
                      alignItems: "center", 
                      gap: "6px",
                      opacity: allIngredientsChecked ? 1 : 0.5,
                      cursor: allIngredientsChecked ? "pointer" : "not-allowed",
                      backgroundColor: allIngredientsChecked ? "var(--accent)" : "#edd9c8",
                      color: allIngredientsChecked ? "#fff" : "var(--muted)",
                      border: allIngredientsChecked ? "none" : "1px solid var(--line)"
                    }}
                    title={allIngredientsChecked ? "Start cooking" : "Check off all ingredients to start cooking"}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Start Cooking
                  </button>
                </div>
              </div>
              {!allIngredientsChecked && (
                <div style={{ textAlign: "right", fontSize: "0.75rem", color: "var(--muted)", fontStyle: "italic" }}>
                  Please check off all ingredients to start cooking.
                </div>
              )}
            </div>
          </div>

          {/* Celebratory Banner when progress is 100% */}
          {progressPercentage === 100 && (
            <div className="celebration-banner">
              <span style={{ fontSize: "2rem" }}>🎉</span>
              <h3 className="celebration-title">Master Chef Mode Active!</h3>
              <p className="celebration-desc">You've completed all the steps for cooking <strong>{recipe.name}</strong>. Time to serve and enjoy!</p>
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button className="btn btn-primary btn-sm" onClick={resetProgress}>
                  Cook Again
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate("/app")}>
                  Browse More Recipes
                </button>
              </div>
            </div>
          )}

          {/* Timeline / Preparation Steps */}
          <div className="steps-section">
            <h2 className="steps-section-header" style={{ marginBottom: "18px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 14 14"></polyline>
              </svg>
              Preparation Steps
            </h2>
            <div className="steps-timeline">
              {recipe.steps?.map((step, idx) => (
                <div
                  key={idx}
                  className={`step-card ${completedSteps.has(idx) ? "completed" : ""}`}
                >
                  <div className="step-number-badge">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </div>
                  <div className="step-content">
                    <span className="step-title">Step {idx + 1}</span>
                    <span className="step-desc">{step}</span>
                  </div>
                  <div className="step-status-indicator">
                    {completedSteps.has(idx) ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="9 11 11 13 15 9"></polyline>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Tutorial if exists */}
          {recipe.youtubeUrl && getEmbedUrl(recipe.youtubeUrl) && (
            <div className="video-section" style={{ marginTop: "12px" }}>
              <h2 className="steps-section-header" style={{ marginBottom: "14px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 7a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7z"></path>
                  <polygon points="10 11 10 15 14 13 10 11"></polygon>
                </svg>
                Video Tutorial
              </h2>
              <div className="video-container" style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "16px", boxShadow: "var(--shadow)", border: "1px solid var(--line)" }}>
                <iframe
                  src={getEmbedUrl(recipe.youtubeUrl)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Focus Mode Overlay Modal */}
      {isFocusMode && (
        <div className="focus-mode-overlay">
          <div className="focus-mode-card">
            {/* Left side: Step content */}
            <div className="focus-main-content">
              <div className="focus-header">
                <span className="focus-recipe-name">{recipe.name}</span>
                <button className="focus-close-btn" onClick={() => setIsFocusMode(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div>
                <span className="focus-step-indicator">Step {currentFocusStep + 1} of {totalStepsCount}</span>
                <h2 className="focus-step-text">
                  {recipe.steps[currentFocusStep]}
                </h2>
                
                {/* Voice & Smart Assistant Actions */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px", marginBottom: "10px" }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => speakStep(recipe.steps[currentFocusStep])}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "12px", padding: "8px 14px", fontSize: "0.82rem" }}
                  >
                    {isSpeaking ? (
                      <>
                        <div style={{ display: "flex", gap: "2px", alignItems: "center", height: "14px", marginRight: "4px" }}>
                          <span className="audio-wave-bar" style={{ animationDelay: "0.1s" }}></span>
                          <span className="audio-wave-bar" style={{ animationDelay: "0.3s" }}></span>
                          <span className="audio-wave-bar" style={{ animationDelay: "0.5s" }}></span>
                        </div>
                        Stop Reading
                      </>
                    ) : (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                        Read Step Aloud
                      </>
                    )}
                  </button>

                  {/* Parse time from step text */}
                  {(() => {
                    const parsedSecs = parseTimeFromStep(recipe.steps[currentFocusStep]);
                    if (parsedSecs) {
                      return (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setTimerSeconds(parsedSecs);
                            setTimerActive(true);
                          }}
                          style={{ display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "12px", padding: "8px 14px", fontSize: "0.82rem", borderColor: "var(--accent)", color: "var(--accent)" }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          Start Step Timer ({Math.floor(parsedSecs / 60)}m)
                        </button>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>

              <div className="focus-actions">
                <button 
                  className="btn btn-secondary" 
                  disabled={currentFocusStep === 0}
                  onClick={() => setCurrentFocusStep(prev => prev - 1)}
                  style={{ opacity: currentFocusStep === 0 ? 0.5 : 1, cursor: currentFocusStep === 0 ? "not-allowed" : "pointer" }}
                >
                  Previous
                </button>
                {currentFocusStep < totalStepsCount - 1 ? (
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      markStepComplete(currentFocusStep, true);
                      setCurrentFocusStep(prev => prev + 1);
                    }}
                  >
                    Done & Next
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      markStepComplete(currentFocusStep, true);
                      setIsFocusMode(false);
                    }}
                    style={{ backgroundColor: "var(--success)" }}
                  >
                    Finish Cooking 🎉
                  </button>
                )}
              </div>
            </div>

            {/* Right side: Quick references (Ingredients checklist) */}
            <div className="focus-sidebar">
              <h3>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2c3.038 0 5.5 2.462 5.5 5.5a5.5 5.5 0 0 1-3.5 5.09v6.91a2.5 2.5 0 0 1-5 0v-6.91A5.5 5.5 0 0 1 6.5 7.5C6.5 4.462 8.962 2 12 2z"></path>
                </svg>
                Ingredients Needed
              </h3>
              <div className="focus-ingredients-list">
                {recipe.ingredients?.map((ing, idx) => (
                  <div 
                    key={idx} 
                    className="focus-ingredient-item"
                    style={{ 
                      textDecoration: completedIngredients.has(idx) ? "line-through" : "none",
                      opacity: completedIngredients.has(idx) ? 0.6 : 1,
                      cursor: "pointer"
                    }}
                    onClick={() => toggleIngredient(idx)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={completedIngredients.has(idx) ? "var(--success)" : "currentColor"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      {completedIngredients.has(idx) ? (
                        <polyline points="20 6 9 17 4 12"></polyline>
                      ) : (
                        <circle cx="12" cy="12" r="10"></circle>
                      )}
                    </svg>
                    <span>{ing}</span>
                  </div>
                ))}
              </div>
              
              {/* Kitchen Timer Widget */}
              <div className="focus-timer-section" style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(237, 217, 200, 0.4)" }}>
                <h3 style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.95rem" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Kitchen Timer
                </h3>

                {timerSeconds > 0 || timerActive ? (
                  <div className="active-timer-widget" style={{ background: "#fdfaf7", border: "1px solid var(--line)", borderRadius: "16px", padding: "16px", textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: "700", fontFamily: "monospace", color: timerSeconds < 10 && timerActive ? "var(--danger)" : "var(--ink)", letterSpacing: "1px", marginBottom: "8px" }}>
                      {formatTime(timerSeconds)}
                    </div>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setTimerActive(!timerActive)}
                        style={{ borderRadius: "8px", padding: "6px 12px", fontSize: "0.78rem" }}
                      >
                        {timerActive ? "Pause" : "Resume"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setTimerActive(false);
                          setTimerSeconds(0);
                        }}
                        style={{ borderRadius: "8px", padding: "6px 12px", color: "var(--danger)", fontSize: "0.78rem" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {/* Quick timer presets */}
                    <div style={{ display: "flex", gap: "6px" }}>
                      {[1, 3, 5, 10].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setTimerSeconds(mins * 60);
                            setTimerActive(true);
                          }}
                          style={{ flex: 1, padding: "6px 0", borderRadius: "8px", fontSize: "0.75rem" }}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                    
                    {/* Custom Timer Selector */}
                    <div style={{ display: "flex", gap: "6px" }}>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Mins"
                        min="1"
                        max="180"
                        id="custom-timer-input"
                        style={{ flex: 1, padding: "6px 10px", fontSize: "0.8rem", borderRadius: "8px", height: "32px", border: "1px solid var(--line)" }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.target.value) {
                            const mins = Number(e.target.value);
                            setTimerSeconds(mins * 60);
                            setTimerActive(true);
                            e.target.value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          const el = document.getElementById("custom-timer-input");
                          if (el && el.value) {
                            const mins = Number(el.value);
                            setTimerSeconds(mins * 60);
                            setTimerActive(true);
                            el.value = "";
                          }
                        }}
                        style={{ borderRadius: "8px", padding: "0 12px", height: "32px", fontSize: "0.75rem" }}
                      >
                        Set
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
