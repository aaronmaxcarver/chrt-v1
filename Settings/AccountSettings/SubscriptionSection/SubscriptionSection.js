import { Fragment } from "react";

import Typography from "@mui/material/Typography";

import {
  MAIN_SX,
  DIVIDER_SX,
  BOLD_SX,
  BOLD_ITALIC_SX,
  BOLD_UNDERLINE_SX,
  USER_DATA_BOX_SX,
  GREY_BOX_SX,
  INPUT_AND_BUTTON_SX,
  CENTER_SX,
} from "../../SettingsSX";

export default function SubscriptionSection(props) {
  //-- Props --//
  const {
    //-- Data --//
  } = props;

  return (
    <Fragment>
      <Typography sx={BOLD_SX} variant={"h4"}>
        Subscription
      </Typography>
      {/* CURRENT SUBSCRIPTION */}
      <Typography sx={BOLD_UNDERLINE_SX}>Current Subscription</Typography>

      {/* CHANGE SUBSCRIPTION */}
      <Typography sx={BOLD_UNDERLINE_SX}>Change Subscription</Typography>

      {/* BILLING METHOD */}
      <Typography sx={BOLD_UNDERLINE_SX}>Billing Method</Typography>
    </Fragment>
  );
}
