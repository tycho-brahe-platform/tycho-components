import ToastMessage from '../../AppToast/ToastMessage';

export type UserStore = {
  message: ToastMessage;
  toastLoading: boolean;
  toastLoadingText?: string;
  silentLoading: boolean;
  tour: boolean;
};

export type StoreAction = {
  type: string;
  payload?: ToastMessage | boolean | { loading: boolean; text?: string };
};

export const types = {
  MESSAGE: 'MESSAGE',
  TOAST_LOADING: 'TOAST_LOADING',
  SILENT_LOADING: 'SILENT_LOADING',
  TOUR: 'TOUR',
};
