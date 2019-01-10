const initialState = [];

export default function furnitures(state = initialState, action) {
  if (action.type === 'CREATE_TABLE') {
    return [
      ...state,
      action.payload
    ];
  }
  return state;
}