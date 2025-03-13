import axios from 'axios';
import { GET_PHASES, PHASES_ERROR } from './types';

export const fetchPhases = () => async dispatch => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/phases`);
    dispatch({ type: GET_PHASES, payload: res.data });
  } catch (err) {
    dispatch({ 
      type: PHASES_ERROR, 
      payload: err.response?.data?.error || 'Failed to fetch phases' 
    });
  }
}; 