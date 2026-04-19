import { types, UserStore } from './types';

function reducer(state: UserStore, action: any): UserStore {
  switch (action.type) {
    case types.MESSAGE:
      return {
        ...state,
        message: action.payload,
      };
    case types.TOAST_LOADING:
      if (typeof action.payload === 'boolean') {
        return {
          ...state,
          toastLoading: action.payload,
          toastLoadingText: undefined,
        };
      }
      return {
        ...state,
        toastLoading: action.payload.loading,
        toastLoadingText: action.payload.text,
      };
    case types.SILENT_LOADING:
      return {
        ...state,
        silentLoading: action.payload,
      };
    case types.TOUR:
      return {
        ...state,
        tour: action.payload,
      };
    default:
      return state;
  }
}

export default reducer;
