import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';
import RoadRiskForm from '../pages/RoadRiskForm';
import LMHRiskForm from '../pages/LMHRiskForm';
import HistoryPage from '../pages/HistoryPage';
import Dashboard from '../pages/Dashboard';
import EnhancedDashboard from '../pages/EnhancedDashboard';
import AssessmentDetailPage from '../pages/AssessmentDetailPage';
import ProfessionalReferences from '../components/ProfessionalReferences';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/dashboard" element={<EnhancedDashboard />} />
        <Route path="/dashboard-old" element={<Dashboard />} />
        <Route path="/road-risk" element={<RoadRiskForm />} />
        <Route path="/lmh-risk" element={<LMHRiskForm />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/assessment/:id" element={<AssessmentDetailPage />} />
        <Route path="/references" element={<ProfessionalReferences />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
