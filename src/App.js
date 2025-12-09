import React from 'react';
import AppRouter from './navigation/AppRouter';
import './styles/index.css';
import './styles/home.css';
import './styles/RoadRiskForm.css';
import './styles/form-elements.css';
import './styles/form-sections.css';
import './styles/info-components.css';
import './styles/progress-steps.css';

function App() {
  return (
    <div className="app-container">
      <AppRouter />
    </div>
  );
}

export default App;
