import { combineReducers } from 'redux';
import phasesReducer from './phasesReducer';
import progressReducer from './progressReducer';
import evaluationsReducer from './evaluationsReducer';

export default combineReducers({
  phases: phasesReducer,
  progress: progressReducer,
  evaluations: evaluationsReducer
}); 