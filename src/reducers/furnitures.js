const initialState = [];

export default function furnitures(state = initialState, action) {
  if (action.type === 'CREATE_FURNITURE') {
    return [
      ...state,
      action.payload
    ];
  }
  return state;
}