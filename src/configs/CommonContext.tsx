import { createContext, useReducer } from 'react';
import reducer from './store/reducer';
import store from './store/store';
import { StoreAction, UserStore } from './store/types';

type ContextType = {
  state: UserStore;
  dispatch: React.Dispatch<StoreAction>;
};

const CommonContext = createContext<ContextType>({} as ContextType);

export function CommonProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, store);

  return (
    <CommonContext.Provider value={{ state, dispatch }}>
      {children}
    </CommonContext.Provider>
  );
}

export default CommonContext;
