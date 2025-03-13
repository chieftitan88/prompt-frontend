import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitPrompt } from '../actions/promptActions';
import { updateProgressAfterEvaluation } from '../actions/progressActions';
import styled from 'styled-components';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const InputContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const TipsContainer = styled.div`
  margin: 15px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
`;

const TipsList = styled.ul`
  margin: 10px 0;
  padding-left: 20px;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin: 10px 0;
  font-size: 16px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }
`;

const SubmitButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const Stats = styled.div`
  margin-top: 15px;
  color: #6c757d;
  font-size: 14px;
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  margin-top: 10px;
`;

const ValidationMessage = styled.div`
  margin-top: 10px;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
  ${props => props.isValid ? `
    color: #28a745;
    background: #d4edda;
    border: 1px solid #c3e6cb;
  ` : `
    color: #dc3545;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
  `}
`;

const ValidationList = styled.ul`
  margin: 10px 0;
  padding-left: 20px;
  list-style: none;

  li {
    margin: 5px 0;
    display: flex;
    align-items: center;
    
    &:before {
      content: '';
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-right: 8px;
      background-color: ${props => props.isValid ? '#28a745' : '#dc3545'};
      mask-image: url(${props => props.isValid ? 
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z'/%3E%3C/svg%3E" :
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E"
      });
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
    }
  }
`;

const TooltipIcon = styled.span`
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

const PromptInput = () => {
  const [prompt, setPrompt] = useState('');
  const [validationResults, setValidationResults] = useState([]);
  const dispatch = useDispatch();
  
  const { currentPhase, phaseProgress } = useSelector(state => state.progress);
  const { loading, error, currentEvaluation } = useSelector(state => state.evaluations);
  
  // Get phase data from the current phase
  const phaseData = useSelector(state => 
    state.phases.phases.find(phase => phase.key === currentPhase) || {}
  );

  // Track word count
  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;

  const validatePrompt = () => {
    const rules = phaseData.validationRules || {};
    const results = [];
    
    // Edge Case Testing
    const testCases = {
      detailExact: "Write a comprehensive guide for students that must include detailed steps for learning effectively in class.",  // 20 words
      detailUnder: "Write a guide for students that must include steps for learning effectively in class.",  // 19 words
      conciseExact: "Write a clear and concise guide explaining the home-buying process for beginners.",  // 18 words
      conciseOver: "Write a very clear and concise guide explaining the home-buying process for all beginners.",  // 19 words
    };
    
    console.log('Testing prompt:', prompt);
    console.log('Current phase:', currentPhase);
    console.log('Word count:', wordCount);
    console.log('Is boundary case:', Object.values(testCases).includes(prompt));

    // Basic validation with improved task verb detection
    const taskVerbs = /\b(write|create|explain|describe|generate|make|develop|discuss|list|outline|prepare|design|compose|draft|present)\b/i;
    results.push({
      check: 'Task-oriented',
      isValid: taskVerbs.test(prompt),
      message: 'Prompt must request a specific action (e.g., write, create, explain)'
    });

    // Enhanced word count validation with exact boundary messaging
    if (rules.minWords) {
      const exactMin = wordCount === rules.minWords;
      results.push({
        check: 'Minimum words',
        isValid: wordCount >= rules.minWords,
        message: exactMin ? 
          `Exactly ${rules.minWords} words (minimum met)` : 
          `Must be at least ${rules.minWords} words (current: ${wordCount})`
      });
    }

    if (rules.maxWords) {
      const exactMax = wordCount === rules.maxWords;
      results.push({
        check: 'Maximum words',
        isValid: wordCount <= rules.maxWords,
        message: exactMax ? 
          `Exactly ${rules.maxWords} words (maximum met)` : 
          `Must be no more than ${rules.maxWords} words (current: ${wordCount})`
      });
    }

    // Enhanced creative validation with subtle creativity detection
    if (rules.requiresCreativeElements) {
      const creativeWords = /\b(imagine|creative|innovative|unique|original|novel|envision|inspiring|transformative|revolutionary|fresh|inventive|pioneering)\b/i;
      const subtleCreativeWords = /\b(different|new|better|improved|enhanced|advanced|modern|future|tomorrow|beyond|reimagine|rethink)\b/i;
      
      const isExplicitlyCreative = creativeWords.test(prompt);
      const isSubtlyCreative = subtleCreativeWords.test(prompt);
      
      results.push({
        check: 'Creative elements',
        isValid: isExplicitlyCreative || isSubtlyCreative,
        message: isSubtlyCreative && !isExplicitlyCreative ?
          'Subtle creativity detected (consider using more explicit creative terms)' :
          'Must include creative elements (using words like "imagine" or "innovative")'
      });
    }

    // Phase-specific validation
    if (rules.requiresConstraints) {
      results.push({
        check: 'Constraints',
        isValid: /\b(must|should|need to|has to|require)\b/i.test(prompt),
        message: 'Must include explicit constraints (using words like "must" or "should")'
      });
    }

    if (rules.singleSentence) {
      results.push({
        check: 'Single sentence',
        isValid: prompt.split(/[.!?]+/).filter(s => s.trim()).length === 1,
        message: 'Must be a single sentence'
      });
    }

    // Audience check for Detail phase
    if (currentPhase === 'detail') {
      results.push({
        check: 'Audience specification',
        isValid: /\b(for|audience|users|readers|people|students|professionals)\b/i.test(prompt),
        message: 'Must specify target audience'
      });
    }

    console.log('Validation results:', results);
    return results;
  };

  useEffect(() => {
    const results = validatePrompt();
    setValidationResults(results);
  }, [prompt, currentPhase]);

  useEffect(() => {
    if (currentEvaluation && !loading) {
      // Extract the score from the evaluation result
      const score = currentEvaluation.score || 
                   (currentEvaluation.evaluation && currentEvaluation.evaluation.totalScore) || 
                   0;
      
      console.log('Evaluation received, updating progress:', { phase: currentPhase, score });
      
      // Update progress after evaluation
      dispatch(updateProgressAfterEvaluation(currentPhase, score));
    }
  }, [currentEvaluation, loading, dispatch, currentPhase]);

  const isValid = () => validationResults.every(result => result.isValid);

  const handleSubmit = () => {
    if (isValid() && prompt.trim()) {
      console.log('Submitting prompt for evaluation:', { prompt: prompt.trim(), phase: currentPhase });
      dispatch(submitPrompt(prompt.trim()))
        .then(() => {
          console.log('Prompt evaluation completed, progress update will be triggered by useEffect');
          setPrompt('');
        })
        .catch(error => {
          console.error('Error submitting prompt:', error);
        });
    }
  };

  // Get phase-specific tooltip content
  const getPhaseTooltip = () => {
    switch(currentPhase) {
      case 'detail':
        return `Enter a prompt meeting Detail phase rules: at least 20 words, include constraints using "must" or "should", and specify your target audience.`;
      case 'concise':
        return `Enter a prompt meeting Concise phase rules: maximum 18 words, single sentence, clear and direct.`;
      case 'creative':
        return `Enter a prompt meeting Creative phase rules: include creative elements using words like "innovative", "unique", or "imagine".`;
      default:
        return "Enter your prompt here";
    }
  };

  return (
    <InputContainer className="prompt-input">
      <h2>
        {phaseData.name || 'Create Your Prompt'}
        <TooltipIcon 
          data-tooltip-id="prompt-input-tooltip" 
          data-tooltip-content={getPhaseTooltip()}
        >
          ?
        </TooltipIcon>
      </h2>
      <Tooltip id="prompt-input-tooltip" place="top" effect="solid" />
      
      <p>{phaseData.description}</p>
      
      <TipsContainer>
        <h3>Tips for this phase:</h3>
        <TipsList>
          {phaseData.tips?.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </TipsList>
      </TipsContainer>
      
      <StyledTextarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={`Enter your ${currentPhase} prompt here...`}
        disabled={loading}
      />
      
      <Stats>
        Word count: {wordCount} {phaseData.validationRules?.minWords && `(min: ${phaseData.validationRules.minWords})`} {phaseData.validationRules?.maxWords && `(max: ${phaseData.validationRules.maxWords})`}
      </Stats>
      
      {validationResults.length > 0 && (
        <ValidationMessage isValid={isValid()}>
          <strong>{isValid() ? 'Validation passed!' : 'Validation issues:'}</strong>
          <ValidationList isValid={isValid()}>
            {validationResults.map((result, index) => (
              <li key={index} style={{ color: result.isValid ? '#28a745' : '#dc3545' }}>
                {result.message}
              </li>
            ))}
          </ValidationList>
        </ValidationMessage>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <SubmitButton 
        onClick={handleSubmit} 
        disabled={!isValid() || !prompt.trim() || loading}
      >
        {loading ? 'Evaluating...' : 'Submit Prompt'}
      </SubmitButton>
    </InputContainer>
  );
};

export default PromptInput; 