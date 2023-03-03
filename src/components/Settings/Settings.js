import { Outlet, useNavigate, useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PortraitIcon from "@mui/icons-material/Portrait";
import PaletteIcon from "@mui/icons-material/Palette";
import EmailIcon from "@mui/icons-material/Email";

const GRID_SX = {
  display: "grid",
  height: "100%",
  width: "100%",
  gridTemplateRows: "1fr",
  gridTemplateColumns: "225px 1fr minmax(300px, 1284px) 1fr",
  gridTemplateAreas: `"leftSidebar leftMargin outlet rightMargin"`,
};
const LEFT_SIDEBAR_SX = {
  gridArea: "leftSidebar",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
};
const OUTLET_SX = {
  gridArea: "outlet",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  borderRadius: "12px",
  marginBottom: "12px",
};
const ICON_SX = {
  // color: "inherit",
  color: "#212121",
};

export default function Settings() {
  const location = useLocation();
  let navigate = useNavigate();

  return (
    <Box sx={GRID_SX}>
      {/* Left sidebar - list of sections */}
      <Box sx={LEFT_SIDEBAR_SX}>
        <List>
          <ListItemButton
            selected={
              location.pathname === "/settings" ||
              location.pathname === "/settings/account"
            }
            onClick={() => {
              navigate("/settings/account");
            }}
          >
            <ListItemIcon sx={ICON_SX}>
              <ManageAccountsIcon />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItemButton>
          <ListItemButton
            selected={location.pathname === "/settings/profile"}
            onClick={() => {
              navigate("/settings/profile");
            }}
          >
            <ListItemIcon sx={ICON_SX}>
              <PortraitIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
          <ListItemButton
            selected={location.pathname === "/settings/themes"}
            onClick={() => {
              navigate("/settings/themes");
            }}
          >
            <ListItemIcon sx={ICON_SX}>
              <PaletteIcon />
            </ListItemIcon>
            <ListItemText primary="Themes" />
          </ListItemButton>
          <ListItemButton
            selected={location.pathname === "/settings/communication"}
            onClick={() => {
              navigate("/settings/communication");
            }}
          >
            <ListItemIcon sx={ICON_SX}>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText primary="Communication" />
          </ListItemButton>
        </List>
      </Box>

      {/* Outlet for each section's content */}
      <Box sx={OUTLET_SX}>
        <Outlet />
      </Box>
    </Box>
  );
}
