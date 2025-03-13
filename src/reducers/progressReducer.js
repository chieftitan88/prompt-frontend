import {
  GET_PROGRESS,
  CHANGE_PHASE,
  PHASE_CHANGED,
  PROGRESS_ERROR,
  COMPLETE_ONBOARDING,
  UPDATE_PROGRESS_AFTER_EVALUATION
} from '../actions/types';

const initialState = {
  currentPhase: 'detail',
  phaseProgress: {
    detail: { bestScore: 0, completed: false, attempts: 0, locked: false },
    concise: { bestScore: 0, completed: false, attempts: 0, locked: true },
    creative: { bestScore: 0, completed: false, attempts: 0, locked: true }
  },
  onboardingCompleted: false,
  loading: false,
  changingPhase: false,
  error: null
};

const progressReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PROGRESS:
      return {
        ...state,
        currentPhase: payload.currentPhase,
        phaseProgress: payload.phaseProgress,
        onboardingCompleted: payload.onboardingCompleted || false,
        loading: false
      };
    case CHANGE_PHASE:
      return {
        ...state,
        currentPhase: payload,
        loading: false
      };
    case PHASE_CHANGED:
      return {
        ...state,
        currentPhase: payload,
        changingPhase: false
      };
    case COMPLETE_ONBOARDING:
      return {
        ...state,
        onboardingCompleted: true,
        loading: false
      };
    case UPDATE_PROGRESS_AFTER_EVALUATION:
      // If a new phase was unlocked, update that phase's locked status
      const updatedPhaseProgress = { ...state.phaseProgress };
      
      // Update the current phase progress
      updatedPhaseProgress[payload.phase] = {
        ...updatedPhaseProgress[payload.phase],
        attempts: payload.attempts,
        bestScore: payload.bestScore,
        completed: payload.completed
      };
      
      // If a new phase was unlocked, update its locked status
      if (payload.phaseUnlocked) {
        updatedPhaseProgress[payload.phaseUnlocked] = {
          ...updatedPhaseProgress[payload.phaseUnlocked],
          locked: false
        };
      }
      
      return {
        ...state,
        phaseProgress: updatedPhaseProgress,
        loading: false
      };
    case PROGRESS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        changingPhase: false
      };
    default:
      return state;
  }
};

export default progressReducer; 