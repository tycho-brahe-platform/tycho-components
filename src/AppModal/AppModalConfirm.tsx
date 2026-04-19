import { Box, Modal } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Icon } from "tycho-storybook";
import "./style.scss";
import { attachCloseToEscape, stopEventPropagation } from "./AppModalUtils";

type Props = {
  title: string;
  subtitle: string | React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  closeLabel?: string;
  confirmLabel?: string;
  disableClose?: boolean;
  disableEscapeClose?: boolean;
  confirmDisabled?: boolean;
};

export default function AppModalConfirm({
  title,
  subtitle,
  onClose,
  onConfirm,
  closeLabel,
  confirmLabel,
  confirmDisabled,
  disableClose,
  disableEscapeClose,
}: Props) {
  const { t } = useTranslation("common");

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
      <Box className="modal-container modal-confirm" sx={style}>
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
            text={closeLabel || t("button.cancel")}
            mode="tonal"
          />
          <Button
            onClick={onConfirm}
            text={confirmLabel || t("button.confirm")}
            disabled={confirmDisabled}
          />
        </div>
      </Box>
    </Modal>
  );
}

const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  maxWidth: "580px",
  borderRadius: "var(--radius-200)",
  boxShadow: 24,
  bgcolor: "var(--background-default)",
};
