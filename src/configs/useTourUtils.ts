import { useContext } from 'react';
import CommonContext from './CommonContext';
import { tour } from './store/actions';

export const useTourUtils = () => {
  const { state, dispatch } = useContext(CommonContext);

  const turnOn = () => {
    dispatch(tour(true));
  };

  const turnOff = () => {
    dispatch(tour(false));
  };

  const status = () => {
    return state.tour;
  };

  return {
    turnOn,
    turnOff,
    status,
  };
};
