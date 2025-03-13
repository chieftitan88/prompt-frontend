import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getPhases } from '../../actions/phase';

const PhaseContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const PhaseCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  ${props => props.locked && `
    &:after {
      content: 'Locked';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.5rem;
      font-weight: bold;
    }
  `}
`;

const PhaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PhaseTitle = styled.h3`
  color: #333;
  margin: 0;
`;

const PhaseStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  background: ${props => props.completed ? 'var(--success-color)' : 'var(--primary-color)'};
  color: white;
`;

const PhaseDescription = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const PhaseObjectives = styled.ul`
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
`;

const PhaseObjective = styled.li`
  margin-bottom: 0.5rem;
  color: #555;
`;

const PhaseButton = styled(Link)`
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s ease;
  
  &:hover {
    background: var(--dark-color);
    color: white;
  }
`;

const PhaseSelector = ({ getPhases, phase: { phases, loading }, auth: { user } }) => {
  useEffect(() => {
    getPhases();
  }, [getPhases]);

  if (loading) {
    return <div>Loading phases...</div>;
  }

  // Check which phases are unlocked for the user
  const isPhaseUnlocked = (phaseName) => {
    if (!user) return false;
    if (phaseName === 'detail') return true; // First phase is always unlocked
    if (user.completedPhases && user.completedPhases.includes(phaseName)) return true;
    
    // Check if previous phase is completed
    const phaseOrder = ['detail', 'concise', 'creative'];
    const currentPhaseIndex = phaseOrder.indexOf(phaseName);
    const previousPhase = phaseOrder[currentPhaseIndex - 1];
    
    return user.completedPhases && user.completedPhases.includes(previousPhase);
  };

  return (
    <div>
      <h2>Select a Learning Phase</h2>
      <p>Each phase focuses on different aspects of prompt engineering. Complete one phase to unlock the next.</p>
      
      <PhaseContainer>
        {phases.map(phase => (
          <PhaseCard key={phase._id} locked={!isPhaseUnlocked(phase.name)}>
            <PhaseHeader>
              <PhaseTitle>{phase.displayName}</PhaseTitle>
              {user && user.completedPhases && user.completedPhases.includes(phase.name) ? (
                <PhaseStatus completed>Completed</PhaseStatus>
              ) : (
                <PhaseStatus>In Progress</PhaseStatus>
              )}
            </PhaseHeader>
            
            <PhaseDescription>{phase.description}</PhaseDescription>
            
            <h4>Objectives:</h4>
            <PhaseObjectives>
              {phase.objectives.map((objective, index) => (
                <PhaseObjective key={index}>{objective}</PhaseObjective>
              ))}
            </PhaseObjectives>
            
            {isPhaseUnlocked(phase.name) ? (
              <PhaseButton to={`/phases/${phase.name}`}>
                {user && user.completedPhases && user.completedPhases.includes(phase.name) 
                  ? 'Review Phase' 
                  : 'Start Phase'}
              </PhaseButton>
            ) : (
              <p>Complete previous phase to unlock</p>
            )}
          </PhaseCard>
        ))}
      </PhaseContainer>
    </div>
  );
};

PhaseSelector.propTypes = {
  getPhases: PropTypes.func.isRequired,
  phase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  phase: state.phase,
  auth: state.auth
});

export default connect(mapStateToProps, { getPhases })(PhaseSelector); 