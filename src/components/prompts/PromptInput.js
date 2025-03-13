import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { submitPrompt } from '../../actions/prompt';
import { getPhase } from '../../actions/phase';

const PromptContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const PromptHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const PromptTitle = styled.h2`
  margin-bottom: 0.5rem;
  color: #333;
`;

const PromptDescription = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const PromptForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const PromptTextarea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  margin-bottom: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.2);
  }
`;

const PromptButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  align-self: flex-end;
  transition: background 0.3s ease;
  
  &:hover {
    background: var(--dark-color);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CriteriaList = styled.ul`
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
`;

const CriteriaItem = styled.li`
  margin-bottom: 0.5rem;
  color: #555;
`;

const TipsContainer = styled.div`
  background: var(--light-color);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

const TipsTitle = styled.h4`
  margin-bottom: 0.5rem;
  color: var(--dark-color);
`;

const TipsList = styled.ul`
  padding-left: 1.5rem;
`;

const TipsItem = styled.li`
  margin-bottom: 0.5rem;
  color: #555;
`;

const CharacterCount = styled.div`
  text-align: right;
  margin-bottom: 0.5rem;
  color: ${props => props.isLimit ? 'var(--danger-color)' : '#666'};
  font-size: 0.9rem;
`;

const PromptInput = ({ 
  submitPrompt, 
  getPhase,
  phase: { currentPhase, loading },
  evaluation: { loading: evalLoading }
}) => {
  const [promptText, setPromptText] = useState('');
  const { phaseId } = useParams();
  
  useEffect(() => {
    if (phaseId) {
      getPhase(phaseId);
    }
  }, [getPhase, phaseId]);
  
  const handleSubmit = e => {
    e.preventDefault();
    submitPrompt(promptText, currentPhase.name);
    // Don't clear the prompt text immediately so user can see what they submitted
  };
  
  const isCharacterLimit = promptText.length > 500;
  
  if (loading) {
    return <div>Loading phase information...</div>;
  }
  
  if (!currentPhase) {
    return <div>Phase not found</div>;
  }

  return (
    <PromptContainer>
      <PromptHeader>
        <PromptTitle>Create a {currentPhase.displayName} Prompt</PromptTitle>
        <PromptDescription>{currentPhase.description}</PromptDescription>
      </PromptHeader>
      
      <h3>Evaluation Criteria</h3>
      <CriteriaList>
        {currentPhase.evaluationCriteria.map((criteria, index) => (
          <CriteriaItem key={index}>
            <strong>{criteria.name}:</strong> {criteria.description}
          </CriteriaItem>
        ))}
      </CriteriaList>
      
      {currentPhase.tips && currentPhase.tips.length > 0 && (
        <TipsContainer>
          <TipsTitle>Tips for this phase:</TipsTitle>
          <TipsList>
            {currentPhase.tips.map((tip, index) => (
              <TipsItem key={index}>{tip}</TipsItem>
            ))}
          </TipsList>
        </TipsContainer>
      )}
      
      <PromptForm onSubmit={handleSubmit}>
        <CharacterCount isLimit={isCharacterLimit}>
          {promptText.length}/500 characters {isCharacterLimit && '(limit exceeded)'}
        </CharacterCount>
        <PromptTextarea
          value={promptText}
          onChange={e => setPromptText(e.target.value)}
          placeholder={`Write your ${currentPhase.displayName.toLowerCase()} prompt here...`}
        />
        <PromptButton 
          type="submit" 
          disabled={promptText.trim() === '' || isCharacterLimit || evalLoading}
        >
          {evalLoading ? 'Evaluating...' : 'Submit for Evaluation'}
        </PromptButton>
      </PromptForm>
    </PromptContainer>
  );
};

PromptInput.propTypes = {
  submitPrompt: PropTypes.func.isRequired,
  getPhase: PropTypes.func.isRequired,
  phase: PropTypes.object.isRequired,
  evaluation: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  phase: state.phase,
  evaluation: state.evaluation
});

export default connect(mapStateToProps, { submitPrompt, getPhase })(PromptInput); 