import { EMPTY_TOAST } from '../../AppToast/ToastMessage';
import { UserStore } from './types';

const store: UserStore = {
  message: EMPTY_TOAST,
  toastLoading: false,
  silentLoading: false,
  tour: false,
};

export default store;
