import { useTranslation } from "react-i18next";
import { Button } from "tycho-storybook";
import AppModal from "../../AppModal/AppModal";
import Storage from "../../configs/Storage";
import { useTourUtils } from "../../configs/useTourUtils";
import { HelpAction } from "./HelpButton";
import "./style.scss";

type Props = {
  onClose: () => void;
  helpActions?: HelpAction[];
};

export default function HelpModal({ onClose, helpActions = [] }: Props) {
  const { t } = useTranslation("help");
  const { turnOn, turnOff, status } = useTourUtils();

  const isTourActive = status();
  const isAutoOpenEnabled = Storage.getTourAutoOpen();

  const handleTutorials = () => {
    window.open("https://www.tycho.iel.unicamp.br/home/tutorials", "_blank");
    onClose();
  };

  const handleTourToggle = () => {
    if (isTourActive) {
      turnOff();
    } else {
      turnOn();
    }
    onClose();
  };

  const handleCustomAction = (item: HelpAction) => {
    item.action();
    onClose();
  };

  const handleAutoOpenToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    Storage.setTourAutoOpen(event.target.checked);
  };

  return (
    <AppModal
      title={t("modal.title") || "Help Center"}
      close={onClose}
      hideFooter
      className="help-modal"
    >
      <div className="item">
        <div className="title">{t("title.tutorials")}</div>
        <div className="desc">{t("description.tutorials")}</div>
        <Button
          text={t("button.open", { title: t("title.tutorials") })}
          size="small"
          mode="outlined"
          icon="keyboard_arrow_right"
          onClick={handleTutorials}
        />
      </div>

      <div className="item">
        <div className="title">{t("title.tour")}</div>
        <div className="desc">{t("description.tour")}</div>
        <label className="help-checkbox-label">
          <input
            type="checkbox"
            checked={isAutoOpenEnabled}
            onChange={handleAutoOpenToggle}
            className="help-checkbox"
          />
          <span>{t("checkbox.autoOpen")}</span>
        </label>
        <Button
          text={t("button.open", { title: t("title.tour") })}
          size="small"
          mode="outlined"
          icon="keyboard_arrow_right"
          onClick={handleTourToggle}
        />
      </div>
      {helpActions.map((item, idx) => (
        <div className="item" key={idx}>
          <div className="title">{item.title}</div>
          <div className="desc">{item.desc}</div>
          <Button
            text={t("button.open", { title: item.title })}
            size="small"
            mode="outlined"
            icon="keyboard_arrow_right"
            onClick={() => handleCustomAction(item)}
          />
        </div>
      ))}
    </AppModal>
  );
}
