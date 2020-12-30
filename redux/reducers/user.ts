const initialState = {
  currentUser: null,
};

export const user = (state = initialState, action: any) => {
  return {
    ...state,
    currentUser: action.currentUser,
  };
};
