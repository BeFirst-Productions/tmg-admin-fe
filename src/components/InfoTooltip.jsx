import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IconifyIcon from "./wrappers/IconifyIcon";

export const InfoTooltip = ({ text }) => (
  <OverlayTrigger
  className="info-tooltip "
    placement="right"
    overlay={<Tooltip>{text}</Tooltip>}
  >
    <span className="ms-1 text-primary" style={{ cursor: "help" }}>
      <IconifyIcon icon="mdi:information-outline" />
    </span>
  </OverlayTrigger>
);