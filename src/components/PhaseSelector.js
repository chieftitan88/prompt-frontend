import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPhases } from '../actions/phasesActions';
import { fetchProgress, changePhase } from '../actions/progressActions';
import styled from 'styled-components';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const PhaseContainer = styled.div`
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const PhaseList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  gap: 15px;
`;

const PhaseItem = styled.li`
  background: white;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const PhaseButton = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  background: ${props => props.isActive ? '#007bff' : props.isLocked ? '#e9ecef' : '#f8f9fa'};
  color: ${props => props.isActive ? 'white' : props.isLocked ? '#6c757d' : '#212529'};
  border-radius: 4px;
  cursor: ${props => props.isLocked ? 'not-allowed' : 'pointer'};
  font-weight: ${props => props.isActive ? 'bold' : 'normal'};
  margin-bottom: 10px;
`;

const PhaseDescription = styled.p`
  margin: 10px 0;
  color: #6c757d;
`;

const PhaseScore = styled.span`
  display: block;
  margin-top: 5px;
  color: #28a745;
  font-weight: bold;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  text-align: center;
`;

const InfoIcon = styled.span`
  display: inline-block;
  margin-left: 8px;
  width: 16px;
  height: 16px;
  background: #6c757d;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 16px;
  font-size: 12px;
  cursor: help;
`;

const PhaseSelector = () => {
  const dispatch = useDispatch();
  const { phases } = useSelector(state => state.phases);
  const { currentPhase, phaseProgress, changingPhase, error } = useSelector(state => state.progress);

  useEffect(() => {
    dispatch(fetchPhases());
    dispatch(fetchProgress());
  }, [dispatch]);

  const handlePhaseChange = (phase) => {
    if (!phaseProgress[phase]?.locked && !changingPhase) {
      dispatch(changePhase(phase));
    }
  };

  // Phase-specific tooltip content
  const getTooltipContent = (phase) => {
    switch(phase) {
      case 'detail':
        return "Detail Phase: Create comprehensive, specific prompts with explicit requirements";
      case 'concise':
        return "Concise Phase: Create brief, efficient prompts that maintain clarity";
      case 'creative':
        return "Creative Phase: Create innovative prompts that encourage unique responses";
      default:
        return "Select a learning phase";
    }
  };

  return (
    <PhaseContainer className="phase-selector">
      <h2>Learning Phases</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <PhaseList>
        {Object.entries(phases).map(([phase, data]) => (
          <PhaseItem key={phase}>
            <PhaseButton
              onClick={() => handlePhaseChange(phase)}
              disabled={phaseProgress[phase]?.locked || changingPhase}
              isActive={currentPhase === phase}
              isLocked={phaseProgress[phase]?.locked}
              data-tooltip-id={`phase-tooltip-${phase}`}
              data-tooltip-content={getTooltipContent(phase)}
            >
              {data.name}
              {phaseProgress[phase]?.locked && ' 🔒'}
              <InfoIcon>i</InfoIcon>
            </PhaseButton>
            <Tooltip id={`phase-tooltip-${phase}`} place="top" effect="solid" />
            <PhaseDescription>{data.description}</PhaseDescription>
            {!phaseProgress[phase]?.locked && (
              <PhaseScore>
                Best Score: {phaseProgress[phase]?.bestScore?.toFixed(1) || '0.0'}/10
              </PhaseScore>
            )}
          </PhaseItem>
        ))}
      </PhaseList>
    </PhaseContainer>
  );
};

export default PhaseSelector; 