import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TrackExpense from "./TrackExpense";
import GeneratePlan from "./GeneratePlan";
import PreviousPlans from "./PreviousPlans";
import Login from "./Login";

const navItems = [
  { path: "/track-expense", imgSrc: "/images/track.jpeg", alt: "Track Expense" },
  { path: "/generate-plan", imgSrc: "/images/plan.jpeg", alt: "Generate Plan" },
  { path: "/previous-plans", imgSrc: "/images/previous.png", alt: "Previous Plans" },
  { path: "/login", imgSrc: "/images/login.jpeg", alt: "Login" },
];

const Home = () => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 100,
      flexWrap: "wrap",
      padding: 70,
      textAlign: "center",
      boxSizing: "border-box",
    }}
  >
    {navItems.map(({ path, imgSrc, alt }) => (
      <Link
        to={path}
        key={path}
        style={{ textAlign: "center", textDecoration: "none", color: "#FF6600" }}
      >
        <img
          src={imgSrc}
          alt={alt}
          style={{
            width: 260,
            height: 160,
            borderRadius: 12,
            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
            cursor: "pointer",
            transition: "transform 0.3s ease",
            objectFit: "contain",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        />
        <div
          style={{
            marginTop: 12,
            fontSize: 18,
            fontWeight: 600,
            userSelect: "none",
            color: "#FF6600",
          }}
        >
          {alt}
        </div>
      </Link>
    ))}
  </div>
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/track-expense" element={<TrackExpense />} />
        <Route path="/generate-plan" element={<GeneratePlan />} />
        <Route path="/previous-plans" element={<PreviousPlans />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
