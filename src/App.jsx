// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import TrackExpense from "./TrackExpense";
import GeneratePlan from "./GeneratePlan";
import PreviousPlans from "./PreviousPlans";
import Login from "./Login";
import Profile from "./Profile";
// We no longer need ProtectedRoute, so the import is removed.
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app-content">
        <Routes>
          {/* All routes are now public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/track-expense" element={<TrackExpense />} />
          <Route path="/generate-plan" element={<GeneratePlan />} />
          <Route path="/previous-plans" element={<PreviousPlans />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}