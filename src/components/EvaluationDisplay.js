import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const EvaluationContainer = styled.div`
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 20px;
`;

const ValidationError = styled.div`
  color: #d32f2f;
  background: #ffebee;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 12px;
  font-size: 0.9rem;
`;

const ValidationErrorList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ValidationErrorItem = styled.li`
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const ScoreDisplay = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => {
    if (props.score >= 90) return '#2e7d32';
    if (props.score >= 70) return '#f57c00';
    return '#d32f2f';
  }};
  margin-bottom: 16px;
`;

const FeedbackSection = styled.div`
  margin-bottom: 16px;
  
  h4 {
    margin: 0 0 8px 0;
    color: #333;
  }
  
  p {
    margin: 0;
    color: #666;
    line-height: 1.5;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 20px;
`;

const EvaluationDisplay = () => {
  const { currentEvaluation, loading, error, validationErrors } = useSelector(state => state.evaluations);

  if (loading) {
    return <LoadingMessage>Evaluating your prompt...</LoadingMessage>;
  }

  if (validationErrors.length > 0) {
    return (
      <EvaluationContainer>
        <ValidationError>
          <ValidationErrorList>
            {validationErrors.map((error, index) => (
              <ValidationErrorItem key={index}>{error}</ValidationErrorItem>
            ))}
          </ValidationErrorList>
        </ValidationError>
      </EvaluationContainer>
    );
  }

  if (error) {
    return (
      <EvaluationContainer>
        <ValidationError>{error}</ValidationError>
      </EvaluationContainer>
    );
  }

  if (!currentEvaluation) {
    return null;
  }

  const { score, feedback, strengths, improvements } = currentEvaluation;

  return (
    <EvaluationContainer>
      <ScoreDisplay score={score}>Score: {score}/100</ScoreDisplay>
      
      <FeedbackSection>
        <h4>Overall Feedback</h4>
        <p>{feedback}</p>
      </FeedbackSection>
      
      <FeedbackSection>
        <h4>Strengths</h4>
        <p>{strengths}</p>
      </FeedbackSection>
      
      <FeedbackSection>
        <h4>Areas for Improvement</h4>
        <p>{improvements}</p>
      </FeedbackSection>
    </EvaluationContainer>
  );
};

export default EvaluationDisplay; 