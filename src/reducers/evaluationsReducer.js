import { 
  SUBMIT_PROMPT, 
  EVALUATION_SUCCESS, 
  EVALUATION_ERROR 
} from '../actions/types';

const initialState = {
  loading: false,
  error: null,
  currentEvaluation: null,
  validationErrors: []
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  
  switch (type) {
    case SUBMIT_PROMPT:
      return {
        ...state,
        loading: true,
        error: null,
        validationErrors: [],
        currentEvaluation: null
      };
      
    case EVALUATION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        validationErrors: [],
        currentEvaluation: payload
      };
      
    case EVALUATION_ERROR:
      // Check if error message contains multiple validation errors
      const validationErrors = payload.includes('\n') ? 
        payload.split('\n') : 
        [payload];
        
      return {
        ...state,
        loading: false,
        error: payload,
        validationErrors,
        currentEvaluation: null
      };
      
    default:
      return state;
  }
} 