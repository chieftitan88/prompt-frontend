import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { clearEvaluation } from '../../actions/evaluation';

const EvaluationContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  animation: fadeIn 0.5s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const EvaluationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
`;

const EvaluationTitle = styled.h2`
  margin: 0;
  color: #333;
`;

const OverallScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScoreValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => {
    if (props.score >= 9) return 'var(--success-color)';
    if (props.score >= 7) return '#74b816';
    if (props.score >= 5) return '#f59f00';
    return 'var(--danger-color)';
  }};
`;

const ScoreLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ScoresGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ScoreCard = styled.div`
  background: var(--light-color);
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
`;

const ScoreCardValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${props => {
    if (props.score >= 9) return 'var(--success-color)';
    if (props.score >= 7) return '#74b816';
    if (props.score >= 5) return '#f59f00';
    return 'var(--danger-color)';
  }};
`;

const ScoreCardLabel = styled.div`
  font-size: 0.9rem;
  color: #555;
  margin-top: 0.5rem;
`;

const FeedbackSection = styled.div`
  margin-bottom: 2rem;
`;

const FeedbackTitle = styled.h3`
  margin-bottom: 1rem;
  color: #333;
`;

const FeedbackText = styled.p`
  color: #555;
  line-height: 1.6;
  white-space: pre-line;
`;

const SuggestionsSection = styled.div`
  margin-bottom: 2rem;
`;

const SuggestionsList = styled.ul`
  padding-left: 1.5rem;
`;

const SuggestionItem = styled.li`
  margin-bottom: 0.5rem;
  color: #555;
`;

const ActionButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: var(--dark-color);
  }
`;

const PromptPreview = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--primary-color);
`;

const PromptPreviewTitle = styled.h4`
  margin-bottom: 0.5rem;
  color: #333;
`;

const PromptPreviewText = styled.p`
  color: #555;
  font-style: italic;
`;

const UnlockMessage = styled.div`
  background: var(--success-color);
  color: white;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1.5rem;
  text-align: center;
  font-weight: bold;
`;

const EvaluationDisplay = ({ 
  evaluation: { current, loading },
  clearEvaluation,
  phase: { currentPhase }
}) => {
  if (loading || !current) {
    return null;
  }

  const { scores, overallScore, feedback, suggestions } = current;
  const hasUnlockedNextPhase = overallScore >= 9.0;

  return (
    <EvaluationContainer>
      <EvaluationHeader>
        <EvaluationTitle>Prompt Evaluation Results</EvaluationTitle>
        <OverallScore>
          <ScoreValue score={overallScore}>{overallScore.toFixed(1)}</ScoreValue>
          <ScoreLabel>Overall Score</ScoreLabel>
        </OverallScore>
      </EvaluationHeader>
      
      <PromptPreview>
        <PromptPreviewTitle>Your Prompt:</PromptPreviewTitle>
        <PromptPreviewText>{current.promptText}</PromptPreviewText>
      </PromptPreview>
      
      <ScoresGrid>
        <ScoreCard>
          <ScoreCardValue score={scores.taskClarity}>{scores.taskClarity.toFixed(1)}</ScoreCardValue>
          <ScoreCardLabel>Task Clarity</ScoreCardLabel>
        </ScoreCard>
        <ScoreCard>
          <ScoreCardValue score={scores.subjectSpecificity}>{scores.subjectSpecificity.toFixed(1)}</ScoreCardValue>
          <ScoreCardLabel>Subject Specificity</ScoreCardLabel>
        </ScoreCard>
        <ScoreCard>
          <ScoreCardValue score={scores.completeness}>{scores.completeness.toFixed(1)}</ScoreCardValue>
          <ScoreCardLabel>Completeness</ScoreCardLabel>
        </ScoreCard>
        <ScoreCard>
          <ScoreCardValue score={scores.context}>{scores.context.toFixed(1)}</ScoreCardValue>
          <ScoreCardLabel>Context</ScoreCardLabel>
        </ScoreCard>
      </ScoresGrid>
      
      <FeedbackSection>
        <FeedbackTitle>Feedback</FeedbackTitle>
        <FeedbackText>{feedback}</FeedbackText>
      </FeedbackSection>
      
      {suggestions && suggestions.length > 0 && (
        <SuggestionsSection>
          <FeedbackTitle>Suggestions for Improvement</FeedbackTitle>
          <SuggestionsList>
            {suggestions.map((suggestion, index) => (
              <SuggestionItem key={index}>{suggestion}</SuggestionItem>
            ))}
          </SuggestionsList>
        </SuggestionsSection>
      )}
      
      {hasUnlockedNextPhase && currentPhase && currentPhase.name !== 'creative' && (
        <UnlockMessage>
          Congratulations! You've scored high enough to unlock the next phase!
        </UnlockMessage>
      )}
      
      <ActionButton onClick={() => clearEvaluation()}>
        Try Another Prompt
      </ActionButton>
    </EvaluationContainer>
  );
};

EvaluationDisplay.propTypes = {
  evaluation: PropTypes.object.isRequired,
  clearEvaluation: PropTypes.func.isRequired,
  phase: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  evaluation: state.evaluation,
  phase: state.phase
});

export default connect(mapStateToProps, { clearEvaluation })(EvaluationDisplay); 