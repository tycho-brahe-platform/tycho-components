import ToastMessage from '../../AppToast/ToastMessage';
import { StoreAction, types } from './types';

export const message = (data: ToastMessage): StoreAction => ({
  type: types.MESSAGE,
  payload: data,
});

export const toastLoading = (
  data: boolean | { loading: boolean; text?: string }
): StoreAction => ({
  type: types.TOAST_LOADING,
  payload: data,
});

export const silentLoading = (data: boolean): StoreAction => ({
  type: types.SILENT_LOADING,
  payload: data,
});

export const tour = (data: boolean): StoreAction => ({
  type: types.TOUR,
  payload: data,
});
