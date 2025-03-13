import axios from 'axios';
import { SUBMIT_PROMPT, EVALUATION_SUCCESS, EVALUATION_ERROR } from './types';

export const submitPrompt = (prompt) => async (dispatch, getState) => {
  try {
    const { currentPhase } = getState().progress;
    console.log('Submitting prompt for evaluation:', { prompt, phase: currentPhase });
    
    dispatch({ type: SUBMIT_PROMPT });
    
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/evaluate`, 
      { prompt, phase: currentPhase }
    );
    
    console.log('Evaluation successful:', res.data);
    dispatch({ type: EVALUATION_SUCCESS, payload: res.data });
    return res.data; // Return data for promise chaining
  } catch (err) {
    let errorMessage = 'Failed to evaluate prompt';
    
    console.error('Evaluation error:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      phase: getState().progress.currentPhase
    });
    
    if (err.response?.data) {
      if (Array.isArray(err.response.data.details)) {
        // Join multiple validation errors into a single message
        errorMessage = err.response.data.details.join('\n');
      } else if (err.response.data.error) {
        errorMessage = err.response.data.error;
      }
    }
    
    dispatch({ type: EVALUATION_ERROR, payload: errorMessage });
    throw err; // Re-throw for promise chaining
  }
}; 