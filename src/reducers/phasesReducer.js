import { GET_PHASES, PHASES_ERROR } from '../actions/types';

const initialState = {
  phases: {},
  loading: false,
  error: null
};

const phasesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PHASES:
      return {
        ...state,
        phases: action.payload,
        loading: false
      };
    case PHASES_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export default phasesReducer; 