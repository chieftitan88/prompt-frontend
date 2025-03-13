import axios from 'axios';
import { 
  GET_PROGRESS, 
  CHANGE_PHASE, 
  PHASE_CHANGED, 
  PROGRESS_ERROR,
  COMPLETE_ONBOARDING,
  UPDATE_PROGRESS_AFTER_EVALUATION
} from './types';
import { setAlert } from './alertActions';

export const fetchProgress = () => async dispatch => {
  try {
    console.log('Fetching user progress...');
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/progress`);
    console.log('Progress data received:', res.data);
    dispatch({ type: GET_PROGRESS, payload: res.data });
  } catch (err) {
    console.error('Error fetching progress:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data
    });
    dispatch({ 
      type: PROGRESS_ERROR, 
      payload: err.response?.data?.error || 'Failed to fetch progress' 
    });
  }
};

export const changePhase = (phase) => async dispatch => {
  try {
    console.log('Changing phase to:', phase);
    dispatch({ type: CHANGE_PHASE });
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/progress/phase`, 
      { phase }
    );
    console.log('Phase changed successfully:', res.data);
    dispatch({ type: PHASE_CHANGED, payload: res.data.currentPhase });
  } catch (err) {
    let errorMessage = 'Failed to change phase';
    console.error('Error changing phase:', {
      phase,
      message: err.message,
      status: err.response?.status,
      data: err.response?.data
    });
    
    if (err.response?.status === 403) {
      errorMessage = 'This phase is currently locked. Complete the previous phase first.';
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    }
    dispatch({ type: PROGRESS_ERROR, payload: errorMessage });
  }
};

export const completeOnboarding = () => async dispatch => {
  try {
    console.log('Completing onboarding...');
    // Dispatch action to mark onboarding as completed
    dispatch({ type: COMPLETE_ONBOARDING });
    
    // Save to backend
    const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/progress/onboarding-complete`);
    console.log('Onboarding completed successfully:', res.data);
    
    // Store in localStorage to persist between sessions
    localStorage.setItem('onboardingCompleted', 'true');
  } catch (err) {
    console.error('Error completing onboarding:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data
    });
    dispatch({ 
      type: PROGRESS_ERROR, 
      payload: 'Failed to complete onboarding' 
    });
  }
};

// Update progress after evaluation
export const updateProgressAfterEvaluation = (phase, score) => async dispatch => {
  try {
    console.log('Updating progress after evaluation:', { phase, score });
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/progress/update-after-evaluation`, 
      { phase, score }
    );
    console.log('Progress updated successfully:', res.data);

    dispatch({
      type: UPDATE_PROGRESS_AFTER_EVALUATION,
      payload: res.data
    });

    // If the next phase was unlocked, show an alert
    if (res.data.phaseUnlocked) {
      console.log(`New phase unlocked: ${res.data.phaseUnlocked}`);
      dispatch(setAlert(`Congratulations! You've unlocked the ${res.data.phaseUnlocked} phase!`, 'success'));
    }
    
    return res.data; // Return data for promise chaining
  } catch (err) {
    console.error('Error updating progress after evaluation:', {
      phase,
      score,
      message: err.message,
      status: err.response?.status,
      data: err.response?.data
    });
    
    dispatch({
      type: PROGRESS_ERROR,
      payload: { msg: err.response?.data.msg || 'Error updating progress', status: err.response?.status }
    });
    
    throw err; // Re-throw for promise chaining
  }
}; 