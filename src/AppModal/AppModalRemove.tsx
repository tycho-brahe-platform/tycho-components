import { Box, Modal } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from 'tycho-storybook';
import './style.scss';
import { attachCloseToEscape, stopEventPropagation } from './AppModalUtils';

type Props = {
  title: string;
  subtitle: string;
  onClose: () => void;
  onConfirm: () => void;
  disableClose?: boolean;
  disableEscapeClose?: boolean;
};

export default function AppModalRemove({
  title,
  subtitle,
  onClose,
  onConfirm,
  disableClose,
  disableEscapeClose,
}: Props) {
  const { t } = useTranslation('common');

  useEffect(() => {
    if (disableEscapeClose) return;
    return attachCloseToEscape(onClose);
  }, [onClose, disableEscapeClose]);

  return (
    <Modal
      open
      disableEscapeKeyDown={!!disableEscapeClose}
      onClose={(event) => {
        stopEventPropagation(event);
        if (disableClose) return;
        onClose();
      }}
    >
      <Box className="modal-container modal-remove" sx={modalRemoveStyle}>
        <div className="body">
          <Icon name="warning" size="large" filled />
          <div className="texts">
            <span className="title">{title}</span>
            <span className="subtitle">{subtitle}</span>
          </div>
        </div>

        <div className="footer">
          <Button
            onClick={(e) => {
              stopEventPropagation(e);
              onClose();
            }}
            text={t('button.cancel')}
            mode="tonal"
          />
          <Button onClick={onConfirm} text={t('button.confirm')} />
        </div>
      </Box>
    </Modal>
  );
}

export const modalRemoveStyle = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30%',
  maxWidth: '580px',
  borderRadius: 'var(--radius-200)',
  boxShadow: 24,
  bgcolor: 'var(--background-default)',
};
