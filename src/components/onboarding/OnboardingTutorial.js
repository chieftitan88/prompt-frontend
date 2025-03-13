import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Joyride, { STATUS } from 'react-joyride';
import styled from 'styled-components';
import { completeOnboarding } from '../../actions/progressActions';

const OnboardingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  
  &:hover {
    background: var(--dark-color);
  }
`;

const OnboardingTutorial = () => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const dispatch = useDispatch();
  const { onboardingCompleted } = useSelector(state => state.progress);

  useEffect(() => {
    // Auto-start onboarding for new users
    if (!onboardingCompleted) {
      setRun(true);
    }
  }, [onboardingCompleted]);

  const handleJoyrideCallback = (data) => {
    const { status, index } = data;
    
    // Update step index
    setStepIndex(index);
    
    // Handle tour completion
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      
      // Mark onboarding as completed
      if (!onboardingCompleted) {
        dispatch(completeOnboarding());
      }
    }
  };

  const startTour = () => {
    setStepIndex(0);
    setRun(true);
  };

  // Define the tour steps
  const steps = [
    {
      target: '.phase-selector',
      content: 'Welcome to the Prompt Engineering Challenge! Start by selecting a learning phase. You\'ll begin with the Detail Phase and unlock others as you progress.',
      placement: 'bottom',
      disableBeacon: true,
      title: 'Learning Phases'
    },
    {
      target: '.prompt-input',
      content: 'Create your prompts here. Each phase has different requirements for what makes a good prompt. Pay attention to the validation rules!',
      placement: 'top',
      title: 'Prompt Creation'
    },
    {
      target: '.evaluation-display',
      content: 'After submitting a prompt, you\'ll see your evaluation here. The system scores your prompt on four criteria and provides detailed feedback to help you improve.',
      placement: 'top',
      title: 'Prompt Evaluation'
    },
    {
      target: '.progress-tracker',
      content: 'Track your progress across all phases here. You need to score at least 9.0/10 in a phase to unlock the next one.',
      placement: 'top',
      title: 'Progress Tracking'
    },
    {
      target: '.help-section',
      content: 'Need help? Check out the Help section for detailed information about each phase, scoring criteria, and examples of effective prompts.',
      placement: 'top',
      title: 'Help & Resources'
    }
  ];

  return (
    <>
      <Joyride
        steps={steps}
        run={run}
        continuous
        showProgress
        showSkipButton
        stepIndex={stepIndex}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#007bff',
            zIndex: 1000,
          },
          tooltip: {
            fontSize: '14px',
          },
          buttonNext: {
            backgroundColor: '#007bff',
          },
          buttonBack: {
            color: '#007bff',
          }
        }}
      />
      
      {!run && (
        <OnboardingButton onClick={startTour} title="Start Tutorial">
          ?
        </OnboardingButton>
      )}
    </>
  );
};

export default OnboardingTutorial; 