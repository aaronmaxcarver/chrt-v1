import { useState } from "react";

import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

import ArchitectureIcon from "@mui/icons-material/Architecture";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import FlareIcon from "@mui/icons-material/Flare";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightIcon from "@mui/icons-material/Nightlight";
import SettingsIcon from "@mui/icons-material/Settings";

export default function BottomControlBarLeft(props) {
  let {
    chartThemeMenuOpenHandler,
    chart1Surface,
    chart2Surface,
    chart3Surface,
    chart4Surface,
    setChartTheme,
    chrtDefaultChartThemeLight1,
    chrtDefaultChartThemeLight2,
    chrtDefaultChartThemeDark1,
    chrtDefaultChartThemeDark2,
    chrtDefaultChartThemeCustom1,
  } = props;

  //-- Theming --//
  const [lightTheme1Selected, setLightTheme1Selected] = useState(false);
  const [lightTheme2Selected, setLightTheme2Selected] = useState(false);
  const [darkTheme1Selected, setDarkTheme1Selected] = useState(true);
  const [darkTheme2Selected, setDarkTheme2Selected] = useState(false);
  const [customThemeSelected, setCustomThemeSelected] = useState(false);
  const themeHandler = (theme) => {
    switch (theme) {
      case "lightTheme1":
        setChartTheme(chrtDefaultChartThemeLight1);
        chart1Surface.applyTheme(chrtDefaultChartThemeLight1);
        chart2Surface.applyTheme(chrtDefaultChartThemeLight1);
        chart3Surface.applyTheme(chrtDefaultChartThemeLight1);
        chart4Surface.applyTheme(chrtDefaultChartThemeLight1);
        setLightTheme1Selected(true);
        setLightTheme2Selected(false);
        setDarkTheme1Selected(false);
        setDarkTheme2Selected(false);
        setCustomThemeSelected(false);
        break;
      case "lightTheme2":
        setChartTheme(chrtDefaultChartThemeLight2);
        chart1Surface.applyTheme(chrtDefaultChartThemeLight2);
        chart2Surface.applyTheme(chrtDefaultChartThemeLight2);
        chart3Surface.applyTheme(chrtDefaultChartThemeLight2);
        chart4Surface.applyTheme(chrtDefaultChartThemeLight2);
        setLightTheme1Selected(false);
        setLightTheme2Selected(true);
        setDarkTheme1Selected(false);
        setDarkTheme2Selected(false);
        setCustomThemeSelected(false);
        break;
      case "darkTheme1":
        setChartTheme(chrtDefaultChartThemeDark1);
        chart1Surface.applyTheme(chrtDefaultChartThemeDark1);
        chart2Surface.applyTheme(chrtDefaultChartThemeDark1);
        chart3Surface.applyTheme(chrtDefaultChartThemeDark1);
        chart4Surface.applyTheme(chrtDefaultChartThemeDark1);
        setLightTheme1Selected(false);
        setLightTheme2Selected(false);
        setDarkTheme1Selected(true);
        setDarkTheme2Selected(false);
        setCustomThemeSelected(false);
        break;
      case "darkTheme2":
        setChartTheme(chrtDefaultChartThemeDark2);
        chart1Surface.applyTheme(chrtDefaultChartThemeDark2);
        chart2Surface.applyTheme(chrtDefaultChartThemeDark2);
        chart3Surface.applyTheme(chrtDefaultChartThemeDark2);
        chart4Surface.applyTheme(chrtDefaultChartThemeDark2);
        setLightTheme1Selected(false);
        setLightTheme2Selected(false);
        setDarkTheme1Selected(false);
        setDarkTheme2Selected(true);
        setCustomThemeSelected(false);
        break;
      case "customTheme":
        setChartTheme(chrtDefaultChartThemeCustom1);
        chart1Surface.applyTheme(chrtDefaultChartThemeCustom1);
        chart2Surface.applyTheme(chrtDefaultChartThemeCustom1);
        chart3Surface.applyTheme(chrtDefaultChartThemeCustom1);
        chart4Surface.applyTheme(chrtDefaultChartThemeCustom1);
        setLightTheme1Selected(false);
        setLightTheme2Selected(false);
        setDarkTheme1Selected(false);
        setDarkTheme2Selected(false);
        setCustomThemeSelected(true);
        break;
      default:
        console.log("Unexpected theme");
    }
  };

  return (
    <Stack direction="row" spacing={0.5}>
      {/* Theming */}
      <Tooltip
        title="Chart Theme Settings"
        placement="top"
        sx={{ marginLeft: "6px" }}
      >
        <IconButton
          onClick={chartThemeMenuOpenHandler}
          disabled={!customThemeSelected}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>

      <ButtonGroup>
        <Tooltip title="Light Theme 1" placement="top">
          <Button
            key="1"
            variant={lightTheme1Selected ? "contained" : "text"}
            onClick={() => themeHandler("lightTheme1")}
          >
            1
          </Button>
        </Tooltip>

        <Tooltip
          title="Light Theme 2"
          placement="top"
          sx={{ marginLeft: "6px" }}
        >
          <Button
            key="2"
            variant={lightTheme2Selected ? "contained" : "text"}
            onClick={() => themeHandler("lightTheme2")}
          >
            2
          </Button>
        </Tooltip>

        <Tooltip title="Dark Theme 1" placement="top">
          <Button
            key="3"
            variant={darkTheme1Selected ? "contained" : "text"}
            onClick={() => themeHandler("darkTheme1")}
          >
            3
          </Button>
        </Tooltip>
        <Tooltip title="Dark Theme 2" placement="top">
          <Button
            key="4"
            variant={darkTheme2Selected ? "contained" : "text"}
            onClick={() => themeHandler("darkTheme2")}
          >
            4
          </Button>
        </Tooltip>
        <Tooltip title="Custom Theme" placement="top">
          <Button
            key="5"
            variant={customThemeSelected ? "contained" : "text"}
            onClick={() => themeHandler("customTheme")}
          >
            5
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Stack>
  );
}
