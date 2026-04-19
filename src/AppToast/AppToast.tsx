import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonContext from '../configs/CommonContext';
import { message } from '../configs/store/actions';
import { EMPTY_TOAST } from './ToastMessage';

export default function AppToast() {
  const { t } = useTranslation('common');
  const { dispatch, state } = useContext(CommonContext);

  const handleClose = () => {
    toast.dismiss();
    dispatch(message(EMPTY_TOAST));
  };

  const handleClipboard = () => {
    navigator.clipboard.writeText(state.message.value);
  };

  const getLoading = () => (
    <div className="d-flex">
      <ReactLoading
        type="spinningBubbles"
        color="blue"
        height={24}
        width={24}
      />
      <span className="ms-3">
        {state.toastLoadingText ?? t('generic.loading')}
      </span>
    </div>
  );

  const attachCloseToEscape = () => {
    const closeOnEscape = (e: any) => {
      if (e.keyCode === 27) handleClose();
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  };

  useEffect(() => {
    attachCloseToEscape();
  }, []);

  useEffect(() => {
    if (state.toastLoading) {
      toast(getLoading(), {
        toastId: 'loading',
        position: 'top-right',
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'light',
      });
    } else {
      toast.dismiss();
    }
  }, [state.toastLoading, state.toastLoadingText]);

  useEffect(() => {
    if (state.message && state.message.value !== '') {
      switch (state.message.type) {
        case 'error':
          toast.error(state.message.value, {
            onClose: () => handleClose(),
            onClick: () => handleClipboard(),
          });
          break;
        case 'warning':
          toast.warning(state.message.value, {
            onClose: () => handleClose(),
          });
          break;
        case 'success':
          toast.success(state.message.value, {
            onClose: () => handleClose(),
          });
          break;
        default:
          toast(state.message.value, {
            onClose: () => handleClose(),
          });
          break;
      }
    } else {
      dispatch(message(EMPTY_TOAST));
    }
  }, [state.message]);

  return <ToastContainer closeOnClick />;
}
