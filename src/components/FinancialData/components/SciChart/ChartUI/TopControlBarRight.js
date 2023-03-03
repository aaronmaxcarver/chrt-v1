import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import SettingsIcon from "@mui/icons-material/Settings";

export default function TopControlBarRight(props) {
  // let {} = props

  return (
    <Stack direction="row" spacing={0.5}>
      <Typography>OVERLAYS</Typography>
      <Tooltip title={"Overlays Settings"}>
        <IconButton
          onClick={() => {
            console.log("TODO - open Overlays Menu");
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
