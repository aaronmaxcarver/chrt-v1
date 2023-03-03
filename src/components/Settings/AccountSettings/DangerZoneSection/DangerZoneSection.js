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

export default function DangerZoneSection(props) {
  // const {} = props;

  return (
    <Fragment>
      <Typography sx={BOLD_SX} variant={"h4"}>
        Danger Zone
      </Typography>
      {/* ACCOUNT DELETION */}
      <Typography sx={BOLD_UNDERLINE_SX}>Account Deletion</Typography>
    </Fragment>
  );
}
