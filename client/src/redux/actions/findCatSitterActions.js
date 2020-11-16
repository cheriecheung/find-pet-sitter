import axios from 'axios';

const { REACT_APP_API_DOMAIN } = process.env;

const sittersURL = `${REACT_APP_API_DOMAIN}/sitter`;
const sitterInBoundsURL = ({ neLat, neLng, swLat, swLng, currentPage }) => `${REACT_APP_API_DOMAIN}/sitter?neLat=${neLat}&neLng=${neLng}&swLat=${swLat}&swLng=${swLng}&currentPage=${currentPage}`;
const filterByDateURL = `${REACT_APP_API_DOMAIN}/sitter/availability`;

// include page number in params
export function getSittersInBounds(bounds, currentPage) {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(sitterInBoundsURL({ ...bounds, currentPage }));
      dispatch({ type: 'GET_SITTERS_IN_BOUNDS', payload: data });
    } catch (e) {
      console.log({ e });
    }
  };
}

export function filterByDate() {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(filterByDateURL);
      dispatch({ type: 'GET_ALL_SITTERS', payload: data });
    } catch (e) {
      console.log({ e });
    }
  };
}

export function sortSitters(sortType) {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${sittersURL}?sort=${sortType}`);
      dispatch({ type: 'GET_ALL_SITTERS', payload: data });
    } catch (e) {
      console.log({ e });
    }
  };
}
