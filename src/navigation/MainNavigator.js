// src/navigation/MainNavigator.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';
import CulvertToolNavigator from './CulvertToolNavigator';
import RoadRiskForm from '../pages/RoadRiskForm';
import HistoryPage from '../pages/HistoryPage';

const MainNavigator = () => {
  return (
    <div className="main-navigator">
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/culvert/*" element={<CulvertToolNavigator />} />
        <Route path="/road-risk" element={<RoadRiskForm />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </div>
  );
};

export default MainNavigator;