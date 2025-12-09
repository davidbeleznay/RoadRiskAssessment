import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';
import RoadRiskForm from '../pages/RoadRiskForm';
import CulvertSizingForm from '../pages/CulvertSizingForm';
import HistoryPage from '../pages/HistoryPage';
import Dashboard from '../pages/Dashboard';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/road-risk" element={<RoadRiskForm />} />
        <Route path="/road-risk/edit/:id" element={<RoadRiskForm />} />
        <Route path="/culvert" element={<CulvertSizingForm />} />
        <Route path="/culvert/edit/:id" element={<CulvertSizingForm />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;