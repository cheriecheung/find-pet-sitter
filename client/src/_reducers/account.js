export function account(state = {}, action) {
  switch (action.type) {
    case 'GET_PROFILE':
      return { data: action.payload };
    case 'GET_USER':
      return { data: action.payload };
    default:
      return state;
  }
}
