// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './App'; // Assuming Home is in its own file now
import TrackExpense from "./TrackExpense";
import GeneratePlan from "./GeneratePlan";
import PreviousPlans from "./PreviousPlans";
import Login from "./Login";
import Profile from "./Profile";
import ProtectedRoute from "./ProtectedRoute"; // We need this back

export default function App() {
  return (
    <Router>
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* Public pages */}
          <Route path="/track-expense" element={<TrackExpense />} />
          <Route path="/generate-plan" element={<GeneratePlan />} />

          {/* Protected pages for logged-in users */}
          <Route path="/previous-plans" element={<ProtectedRoute><PreviousPlans /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}