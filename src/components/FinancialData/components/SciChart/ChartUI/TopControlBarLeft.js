import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";

export default function TopControlBarLeft(props) {
  let {
    setDataThemeMenuIsOpen,
    ohlcRenderableSeries,
    ema12VWRenderableSeries,
    abandsLowerRenderableSeries,
    abandsMiddleRenderableSeries,
    abandsUpperRenderableSeries,
    macdMACDRenderableSeriesChart3,
    macdSignalRenderableSeriesChart3,
    macdHistogramRenderableSeriesChart3,
    rsiRenderableSeriesChart3,
    macdHistogramRenderableSeriesChart4,
    macdMACDRenderableSeriesChart4,
    macdSignalRenderableSeriesChart4,
    rsiRenderableSeriesChart4,
    chart1Indicators,
    setChart1Indicators,
    chart1IndicatorsSelected,
    chart3Indicators,
    setChart3IndicatorValue,
    chart3IndicatorValue,
    chart4Indicators,
    setChart4IndicatorValue,
    chart4IndicatorValue,
  } = props;

  //-- Chart 1 Indicator Selections --//
  //-- ********************************* --//
  //-- Note: The chart1Indicators labels are used to populate the Dropdown Select menu. That menu returns those labels only to the chart1IndicatorsSelected state, so the label string is used to find the series object in chart1Indicators when mapping out the array of Chips per series --//

  const chart1IndicatorsChangeHandler = (event) => {
    //-- Added indicators are in the event.target.value array but not the chart1IndicatorsSelected array --//
    let added = event.target.value.filter(
      (x) => !chart1IndicatorsSelected.includes(x)
    );
    //-- Removed indicators are in the chart1IndicatorsSelected array but not the event.target.value array --//
    let removed = chart1IndicatorsSelected.filter(
      (x) => !event.target.value.includes(x)
    );
    //-- If an indicator was added, set it's renderableSeries.isVisible = true and add its chip to the legend --//
    if (added[0]) {
      switch (added[0]) {
        case "OHLC":
          ohlcRenderableSeries.isVisible = true;
          break;
        case "EMA":
          ema12VWRenderableSeries.isVisible = true;
          break;
        case "ABANDS":
          abandsLowerRenderableSeries.isVisible = true;
          abandsMiddleRenderableSeries.isVisible = true;
          abandsUpperRenderableSeries.isVisible = true;
          break;
        default:
          console.log("Unexpected indicator requesting addition to OHLC Chart");
      }
    }
    //-- If an indicator was removed, set it's renderableSeries.isVisible = false and remove it's chip from the legend--//
    if (removed[0]) {
      switch (removed[0]) {
        case "OHLC":
          ohlcRenderableSeries.isVisible = false;
          break;
        case "EMA":
          ema12VWRenderableSeries.isVisible = false;
          break;
        case "ABANDS":
          abandsLowerRenderableSeries.isVisible = false;
          abandsMiddleRenderableSeries.isVisible = false;
          abandsUpperRenderableSeries.isVisible = false;
          break;
        default:
          console.log(
            "Unexpected indicator requesting removal from OHLC Chart"
          );
      }
    }
    //-- Use entire array from event.target.value as the new state. If it's a string, split on commas into an array --//
    setChart1Indicators(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };
  //-- Chart 3 Indicator Selections --//
  //-- ***************************** --//

  const allSurface3RenderableSeries = [
    macdHistogramRenderableSeriesChart3,
    macdMACDRenderableSeriesChart3,
    macdSignalRenderableSeriesChart3,
    rsiRenderableSeriesChart3,
  ];
  const surface3IndicatorChangeHandler = (event) => {
    switch (event.target.value) {
      case "":
        allSurface3RenderableSeries.map((x) => (x.isVisible = false));
        break;
      case "MACD":
        //-- Set all non-MACD renderable series isVisible = false --//
        allSurface3RenderableSeries
          .filter(
            (x) =>
              x !== macdHistogramRenderableSeriesChart3 ||
              x !== macdMACDRenderableSeriesChart3 ||
              x !== macdSignalRenderableSeriesChart3
          )
          .map((x) => (x.isVisible = false));
        //-- Set all MACD renderable series isVisible = true --//
        macdHistogramRenderableSeriesChart3.isVisible = true;
        macdMACDRenderableSeriesChart3.isVisible = true;
        macdSignalRenderableSeriesChart3.isVisible = true;
        break;
      case "RSI":
        //-- Set all non-RSI renderable series isVisible = false --//
        allSurface3RenderableSeries
          .filter((x) => x !== rsiRenderableSeriesChart3)
          .map((x) => (x.isVisible = false));
        //-- Set all RSI renderable series isVisible = true --//
        rsiRenderableSeriesChart3.isVisible = true;
        break;
      default:
        console.log("Unexpected indicator requested for Chart 3");
    }
    setChart3IndicatorValue(event.target.value || "");
  };

  //-- Chart 4 Indicator Selections --//
  //-- ***************************** --//

  const allSurface4RenderableSeries = [
    macdHistogramRenderableSeriesChart4,
    macdMACDRenderableSeriesChart4,
    macdSignalRenderableSeriesChart4,
    rsiRenderableSeriesChart4,
  ];
  const surface4IndicatorChangeHandler = (event) => {
    switch (event.target.value) {
      case "":
        allSurface4RenderableSeries.map((x) => (x.isVisible = false));
        break;
      case "MACD":
        //-- Set all non-MACD renderable series isVisible = false --//
        allSurface4RenderableSeries
          .filter(
            (x) =>
              x !== macdHistogramRenderableSeriesChart4 ||
              x !== macdMACDRenderableSeriesChart4 ||
              x !== macdSignalRenderableSeriesChart4
          )
          .map((x) => (x.isVisible = false));
        //-- Set all MACD renderable series isVisible = true --//
        macdHistogramRenderableSeriesChart4.isVisible = true;
        macdMACDRenderableSeriesChart4.isVisible = true;
        macdSignalRenderableSeriesChart4.isVisible = true;
        break;
      case "RSI":
        //-- Set all non-RSI renderable series isVisible = false --//
        allSurface4RenderableSeries
          .filter((x) => x !== rsiRenderableSeriesChart4)
          .map((x) => (x.isVisible = false));
        //-- Set all RSI renderable series isVisible = true --//
        rsiRenderableSeriesChart4.isVisible = true;
        break;
      default:
        console.log("Unexpected indicator requested for Chart 4");
    }
    setChart4IndicatorValue(event.target.value);
  };

  return (
    <Stack direction="row" spacing={0.5}>
      {/*-- Data Series Object Settings Menu --*/}
      <Tooltip title={"Data Theme Settings"}>
        <IconButton
          onClick={() => {
            setDataThemeMenuIsOpen(true);
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      {/*-- OHLC Chart Indicators Dropdown Select Menu --*/}
      <FormControl sx={{ minWidth: 105 }} size="small">
        <Select
          labelId="ohlc-surface-indicators-select-label"
          value={chart1IndicatorsSelected}
          onChange={chart1IndicatorsChangeHandler}
          multiple
          renderValue={(value) => (
            <Typography sx={{ color: "#333", fontStyle: "italic" }}>
              Main Chart
            </Typography>
          )}
        >
          {chart1Indicators.map((x) => (
            <MenuItem key={x.label} value={x.label}>
              <Checkbox
                //-- Look for renderable series "x" in the array of selected indicators --//
                checked={chart1IndicatorsSelected.indexOf(x.label) > -1}
              />
              <ListItemText primary={x.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Chart 3 Indicators */}
      <FormControl sx={{ minWidth: 100 }} size="small">
        <InputLabel id="chart-3-indicators-select-label">Lower 1</InputLabel>
        <Select
          labelId="chart-3-indicators-select-label"
          label="Lower 1" //-- Just a name users might like --//
          value={chart3IndicatorValue}
          onChange={surface3IndicatorChangeHandler}
        >
          {chart3Indicators.map((x) => (
            <MenuItem key={x.label} value={x.label}>
              {x.label}
            </MenuItem>
          ))}
          <MenuItem value="">
            <CloseIcon />
          </MenuItem>
        </Select>
      </FormControl>

      {/* Chart 4 Indicators */}
      <FormControl sx={{ minWidth: 100 }} size="small">
        <InputLabel id="chart-4-indicators-select-label">Lower 2</InputLabel>
        <Select
          labelId="chart-4-indicators-select-label"
          label="Lower 2" //-- Just a name users might like --//
          value={chart4IndicatorValue}
          onChange={surface4IndicatorChangeHandler}
        >
          {chart4Indicators.map((x) => (
            <MenuItem key={x.label} value={x.label}>
              {x.label}
            </MenuItem>
          ))}
          <MenuItem value="">
            <CloseIcon />
          </MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
