import axios from 'axios';
// use axiosInstance instead
import ProfileActionTypes from './actionTypes'

const { REACT_APP_API_DOMAIN } = process.env;

const sitterProfileURL = (id) => `${REACT_APP_API_DOMAIN}/sitter/profile/${id}`;
const ownerProfileURL = (id) => `${REACT_APP_API_DOMAIN}/owner/profile/${id}`;

export function getSitterProfile(id) {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(sitterProfileURL(id));
      console.log({ data });
      dispatch({ type: ProfileActionTypes.GET_PROFILE, payload: data });
    } catch (e) {
      console.log({ e });
    }
  };
}

export function getOwnerProfile(id) {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(ownerProfileURL(id));
      dispatch({ type: ProfileActionTypes.GET_PROFILE, payload: data });
    } catch (e) {
      console.log({ e });
    }
  };
}