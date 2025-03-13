import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

// Components
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import PhaseSelector from './components/phases/PhaseSelector';
import DetailPhase from './components/phases/DetailPhase';
import ConcisePhase from './components/phases/ConcisePhase';
import CreativePhase from './components/phases/CreativePhase';
import PromptInput from './components/prompts/PromptInput';
import EvaluationDisplay from './components/evaluations/EvaluationDisplay';
import ProgressTracker from './components/progress/ProgressTracker';
import OnboardingTutorial from './components/onboarding/OnboardingTutorial';
import HelpSection from './components/help/HelpSection';
import NotFound from './components/layout/NotFound';
import PrivateRoute from './components/routing/PrivateRoute';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';

// Check for token in localStorage
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  useEffect(() => {
    // Load user on app mount
    store.dispatch(loadUser());
    
    // Check if this is the user's first visit
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setShowOnboarding(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);
  
  const closeOnboarding = () => {
    setShowOnboarding(false);
  };

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Alert />
        <AppContainer>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Dashboard */}
            <Route 
              path="/dashboard" 
              element={<PrivateRoute component={Dashboard} />} 
            />
            
            {/* Phase Routes */}
            <Route 
              path="/phases" 
              element={<PrivateRoute component={PhaseSelector} />} 
            />
            <Route 
              path="/phases/detail" 
              element={<PrivateRoute component={DetailPhase} />} 
            />
            <Route 
              path="/phases/concise" 
              element={<PrivateRoute component={ConcisePhase} />} 
            />
            <Route 
              path="/phases/creative" 
              element={<PrivateRoute component={CreativePhase} />} 
            />
            
            {/* Prompt Routes */}
            <Route 
              path="/prompt/:phaseId" 
              element={
                <PrivateRoute 
                  component={() => (
                    <>
                      <PromptInput />
                      <EvaluationDisplay />
                    </>
                  )} 
                />
              } 
            />
            
            {/* Progress Route */}
            <Route 
              path="/progress" 
              element={<PrivateRoute component={ProgressTracker} />} 
            />
            
            {/* Help Route */}
            <Route 
              path="/help" 
              element={<PrivateRoute component={HelpSection} />} 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppContainer>
        
        {/* Onboarding Tutorial - Always available */}
        <OnboardingTutorial />
      </Router>
    </Provider>
  );
};

export default App; 