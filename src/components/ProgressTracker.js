import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const TrackerContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 20px;
`;

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const PhaseCard = styled.div`
  padding: 20px;
  background: ${props => props.isActive ? '#e8f4ff' : '#f8f9fa'};
  border-radius: 6px;
  border: 1px solid ${props => props.isActive ? '#b8daff' : '#dee2e6'};
  position: relative;
  
  ${props => props.isLocked && `
    opacity: 0.7;
    &:after {
      content: '🔒';
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 20px;
    }
  `}
`;

const PhaseName = styled.h3`
  margin: 0 0 10px 0;
  color: ${props => props.isActive ? '#0056b3' : '#212529'};
`;

const ProgressBar = styled.div`
  height: 10px;
  background: #e9ecef;
  border-radius: 5px;
  margin: 10px 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background: ${props => {
    if (props.percentage >= 90) return '#28a745';
    if (props.percentage >= 60) return '#ffc107';
    return '#dc3545';
  }};
  transition: width 0.3s ease;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 15px;
`;

const Stat = styled.div`
  text-align: center;
  padding: 10px;
  background: white;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  position: relative;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #6c757d;
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #007bff;
`;

const CompletionBadge = styled.div`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background: ${props => props.completed ? '#28a745' : '#6c757d'};
  margin-top: 10px;
`;

const InfoIcon = styled.span`
  display: inline-block;
  margin-left: 5px;
  width: 14px;
  height: 14px;
  background: #6c757d;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 14px;
  font-size: 10px;
  cursor: help;
`;

const ProgressTracker = () => {
  const { currentPhase, phaseProgress } = useSelector(state => state.progress);
  const { phases } = useSelector(state => state.phases);

  const calculateProgress = (phase) => {
    const progress = phaseProgress[phase];
    if (!progress) return 0;
    return (progress.bestScore / 10) * 100;
  };

  return (
    <TrackerContainer className="progress-tracker">
      <h2>Learning Progress</h2>
      <ProgressGrid>
        {Object.entries(phases).map(([phase, data]) => {
          const progress = phaseProgress[phase] || {};
          const progressPercentage = calculateProgress(phase);
          
          return (
            <PhaseCard 
              key={phase}
              isActive={currentPhase === phase}
              isLocked={progress.locked}
            >
              <PhaseName isActive={currentPhase === phase}>
                {data.name}
              </PhaseName>
              
              <ProgressBar>
                <ProgressFill percentage={progressPercentage} />
              </ProgressBar>
              
              <StatGrid>
                <Stat>
                  <StatLabel>
                    Best Score
                    <InfoIcon 
                      data-tooltip-id={`best-score-tooltip-${phase}`}
                      data-tooltip-content="Your highest evaluation score in this phase. Score 9.0+ to unlock the next phase."
                    >
                      i
                    </InfoIcon>
                    <Tooltip id={`best-score-tooltip-${phase}`} place="top" effect="solid" />
                  </StatLabel>
                  <StatValue>{progress.bestScore?.toFixed(1) || '0.0'}/10</StatValue>
                </Stat>
                <Stat>
                  <StatLabel>
                    Attempts
                    <InfoIcon 
                      data-tooltip-id={`attempts-tooltip-${phase}`}
                      data-tooltip-content="Number of prompts you've submitted in this phase"
                    >
                      i
                    </InfoIcon>
                    <Tooltip id={`attempts-tooltip-${phase}`} place="top" effect="solid" />
                  </StatLabel>
                  <StatValue>{progress.attempts || 0}</StatValue>
                </Stat>
              </StatGrid>
              
              <CompletionBadge completed={progress.completed}>
                {progress.completed ? 'Completed' : 'In Progress'}
              </CompletionBadge>
            </PhaseCard>
          );
        })}
      </ProgressGrid>
    </TrackerContainer>
  );
};

export default ProgressTracker; 