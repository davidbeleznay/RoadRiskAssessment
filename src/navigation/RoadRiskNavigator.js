import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RoadRiskInputScreen from '../screens/roadRisk/InputScreen';
import RoadRiskEditScreen from '../screens/roadRisk/EditScreen';

const RoadRiskNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<RoadRiskInputScreen />} />
      <Route path="/edit/:id" element={<RoadRiskEditScreen />} />
    </Routes>
  );
};

export default RoadRiskNavigator;
