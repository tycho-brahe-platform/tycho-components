import { Box, Fade, Modal } from '@mui/material';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from 'tycho-storybook';
import './style.scss';
import { useEffect } from 'react';
import { attachCloseToEscape, stopEventPropagation } from './AppModalUtils';

type Props = {
  children: React.ReactNode;
  title: string;
  close: () => void;
  confirm?: () => void;
  cancel?: () => void;
  subtitle?: string;
  className?: string;
  disableConfirm?: boolean;
  hideFooter?: boolean;
  disableCancel?: boolean;
  disableClose?: boolean;
  disableEscapeClose?: boolean;
  confirmLabel?: string;
  closeLabel?: string;
  onEntered?: () => void;
  alternativeButton?: {
    title: string;
    action: () => void;
  };
  alternativeOptions?: React.ReactNode;
  hideBackdrop?: boolean;
  disableBackdropClose?: boolean;
};

export default function AppModal({
  children,
  title,
  subtitle,
  className,
  close,
  confirm,
  disableConfirm,
  hideFooter,
  disableClose,
  disableEscapeClose,
  disableCancel,
  confirmLabel,
  closeLabel,
  cancel,
  onEntered,
  alternativeButton,
  hideBackdrop,
  alternativeOptions,
  disableBackdropClose,
}: Props) {
  const { t } = useTranslation('common');

  const getClassNames = cx('modal-container', className);

  useEffect(() => {
    if (disableEscapeClose) return;
    return attachCloseToEscape(close);
  }, [close, disableEscapeClose]);

  return (
    <Modal
      open
      disableEnforceFocus
      disableAutoFocus
      disableRestoreFocus
      hideBackdrop={hideBackdrop}
      disableEscapeKeyDown={!!disableEscapeClose}
      onClose={(event, reason) => {
        stopEventPropagation(event);
        if (disableBackdropClose && reason === 'backdropClick') return;
        if (disableClose) return;
        close();
      }}
    >
      <Fade in onEntered={() => onEntered && onEntered()}>
        <Box className={getClassNames} sx={style}>
          <div className="header">
            <div className="titles">
              <span className="title">{title}</span>
              {subtitle && <span className="subtitle">{subtitle}</span>}
            </div>
            {!disableClose && (
              <Icon
                name="close"
                onClick={(e) => {
                  stopEventPropagation(e);
                  close();
                }}
                className="pointer"
              />
            )}
          </div>
          <div className="body">{children}</div>
          {!hideFooter ? (
            <div className="footer">
              {alternativeOptions && alternativeOptions}
              {alternativeButton && (
                <Button
                  className="alternative"
                  color="white"
                  onClick={alternativeButton.action}
                  text={alternativeButton.title}
                />
              )}
              {!disableCancel && (
                <Button
                  onClick={(e) => {
                    stopEventPropagation(e);
                    (cancel || close)();
                  }}
                  text={closeLabel || t('button.cancel')}
                  color="danger"
                />
              )}
              {confirm && (
                <Button
                  onClick={confirm}
                  disabled={disableConfirm}
                  text={confirmLabel || t('button.confirm')}
                />
              )}
            </div>
          ) : null}
        </Box>
      </Fade>
    </Modal>
  );
}

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  maxWidth: '1080px',
  borderRadius: 'var(--radius-200)',
  boxShadow: 24,
  bgcolor: 'var(--background-default)',
};
