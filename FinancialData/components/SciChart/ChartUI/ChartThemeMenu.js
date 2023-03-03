import { useState } from "react";

import { UpdateSuspender } from "scichart/Charting/Visuals/UpdateSuspender";

import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";

import Draggable from "react-draggable";
import { SketchPicker } from "react-color";

const ALL_SERIES_BOX_SX = {
  display: "grid",
  height: "100%",
  widght: "100%",
  gridTemplateRows: "auto auto auto",
  gridTemplateColumns: "1fr 1fr",
  gridTemplateAreas: `"one two" 
                      "three four"
                      "five six"`,
  gap: 1.2,
};

const ONE_BOX_SX = {
  gridArea: "one",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
};

const TWO_BOX_SX = {
  gridArea: "two",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
};

const THREE_BOX_SX = {
  gridArea: "three",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
};

const FOUR_BOX_SX = {
  gridArea: "four",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
};

const FIVE_BOX_SX = {
  gridArea: "five",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
};

const SIX_BOX_SX = {
  gridArea: "six",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
};

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const PRESET_COLORS = [
  "#ff0000", // red
  "#FFFF00", // yellow
  "#00ff00", // green
  "#33691E", // light green 10
  "#4A90E2", // washed blue
  "#0000ff", // blue
  "#6600FF", // purple
  "#BD10E0", // purple-ish
  "#FFC0CB", // pink
  "#FF6600", // orange
  "#D0021B", // darkish red
  "#8B572A", // brown
  "#607D8B", // blue grey 6
  "#90A4AE", // blue grey 4
  "#CFD8DC", // blue grey 2
  "#ffffff", // white
  "#E0E0E0", // grey 4
  "#9E9E9E", // grey 6
  "#4A4A4A", // dark grey
  "#000000", // black
];

// TODO - build a menu that changes the ChartTheme object in state
export default function SeriesPropertiesMenu(props) {
  let {
    chartThemePropertiesMenuIsOpen,
    chartThemeMenuCloseHandler,
    chartTheme,
    setChartTheme,
    chart1Surface,
    chart2Surface,
    chart3Surface,
    chart4Surface,
    setChart1Height,
    setChart2Height,
    setChart3Height,
    setChart4Height,
  } = props;

  //-- Use only those properties which are to be editable --//
  let sciChartBackground_Handler = (event) => {
    setChartTheme({ ...chartTheme, sciChartBackground: event.hex });
    UpdateSuspender.using(chart1Surface, () => {
      chart1Surface.applyTheme({
        ...chartTheme,
        sciChartBackground: event.hex,
      });
      UpdateSuspender.using(chart2Surface, () => {
        chart2Surface.applyTheme({
          ...chartTheme,
          sciChartBackground: event.hex,
        });
        UpdateSuspender.using(chart3Surface, () => {
          chart3Surface.applyTheme({
            ...chartTheme,
            sciChartBackground: event.hex,
          });
          UpdateSuspender.using(chart4Surface, () => {
            chart4Surface.applyTheme({
              ...chartTheme,
              sciChartBackground: event.hex,
            });
          });
        });
      });
    });
  };
  let axisBandsFill_Handler = (event) => {
    setChartTheme({ ...chartTheme, axisBandsFill: event.hex });
    UpdateSuspender.using(chart1Surface, () => {
      chart1Surface.applyTheme({
        ...chartTheme,
        axisBandsFill: event.hex,
      });
      UpdateSuspender.using(chart2Surface, () => {
        chart2Surface.applyTheme({
          ...chartTheme,
          axisBandsFill: event.hex,
        });
        UpdateSuspender.using(chart3Surface, () => {
          chart3Surface.applyTheme({
            ...chartTheme,
            axisBandsFill: event.hex,
          });
          UpdateSuspender.using(chart4Surface, () => {
            chart4Surface.applyTheme({
              ...chartTheme,
              axisBandsFill: event.hex,
            });
          });
        });
      });
    });
  };
  let majorGridLineBrush_Handler = (event) => {
    setChartTheme({ ...chartTheme, majorGridLineBrush: event.hex });
    UpdateSuspender.using(chart1Surface, () => {
      chart1Surface.applyTheme({
        ...chartTheme,
        majorGridLineBrush: event.hex,
      });
      UpdateSuspender.using(chart2Surface, () => {
        chart2Surface.applyTheme({
          ...chartTheme,
          majorGridLineBrush: event.hex,
        });
        UpdateSuspender.using(chart3Surface, () => {
          chart3Surface.applyTheme({
            ...chartTheme,
            majorGridLineBrush: event.hex,
          });
          UpdateSuspender.using(chart4Surface, () => {
            chart4Surface.applyTheme({
              ...chartTheme,
              majorGridLineBrush: event.hex,
            });
          });
        });
      });
    });
  };
  let minorGridLineBrush_Handler = (event) => {
    setChartTheme({ ...chartTheme, minorGridLineBrush: event.hex });
    UpdateSuspender.using(chart1Surface, () => {
      chart1Surface.applyTheme({
        ...chartTheme,
        minorGridLineBrush: event.hex,
      });
      UpdateSuspender.using(chart2Surface, () => {
        chart2Surface.applyTheme({
          ...chartTheme,
          minorGridLineBrush: event.hex,
        });
        UpdateSuspender.using(chart3Surface, () => {
          chart3Surface.applyTheme({
            ...chartTheme,
            minorGridLineBrush: event.hex,
          });
          UpdateSuspender.using(chart4Surface, () => {
            chart4Surface.applyTheme({
              ...chartTheme,
              minorGridLineBrush: event.hex,
            });
          });
        });
      });
    });
  };
  let tickTextBrush_Handler = (event) => {
    setChartTheme({ ...chartTheme, tickTextBrush: event.hex });
    UpdateSuspender.using(chart1Surface, () => {
      chart1Surface.applyTheme({
        ...chartTheme,
        tickTextBrush: event.hex,
      });
      UpdateSuspender.using(chart2Surface, () => {
        chart2Surface.applyTheme({
          ...chartTheme,
          tickTextBrush: event.hex,
        });
        UpdateSuspender.using(chart3Surface, () => {
          chart3Surface.applyTheme({
            ...chartTheme,
            tickTextBrush: event.hex,
          });
          UpdateSuspender.using(chart4Surface, () => {
            chart4Surface.applyTheme({
              ...chartTheme,
              tickTextBrush: event.hex,
            });
          });
        });
      });
    });
  };

  //-- Aspect Ratios --//
  const [chart1AspectRatioState, setChart1AspectRatioState] = useState(
    chartTheme.chart1AspectRatio
  );
  const [chart2AspectRatioState, setChart2AspectRatioState] = useState(
    chartTheme.chart2AspectRatio
  );
  const [chart3AspectRatioState, setChart3AspectRatioState] = useState(
    chartTheme.chart3AspectRatio
  );
  const [chart4AspectRatioState, setChart4AspectRatioState] = useState(
    chartTheme.chart4AspectRatio
  );
  let chart1AspectRatio_SliderHandler = (event, sliderValue) => {
    setChartTheme({ ...chartTheme, chart1AspectRatio: sliderValue }); //-- ChartTheme --//
    chart1Surface.changeViewportSize(
      window.innerWidth,
      window.innerWidth * sliderValue
    ); //-- Viewport Size --//
    setChart1Height(window.innerWidth * sliderValue); //-- react-resizable chart1Height --//
    setChart1AspectRatioState(sliderValue); //-- aspect ratio state value for slider --//
  };
  let chart2AspectRatio_SliderHandler = (event, sliderValue) => {
    setChartTheme({ ...chartTheme, chart2AspectRatio: sliderValue }); //-- ChartTheme --//
    chart2Surface.changeViewportSize(
      window.innerWidth,
      window.innerWidth * sliderValue
    ); //-- Viewport Size --//
    setChart2Height(window.innerWidth * sliderValue); //-- react-resizable chart1Height --//
    setChart2AspectRatioState(sliderValue); //-- aspect ratio state value for slider --//
  };
  let chart3AspectRatio_SliderHandler = (event, sliderValue) => {
    setChartTheme({ ...chartTheme, chart3AspectRatio: sliderValue }); //-- ChartTheme --//
    chart3Surface.changeViewportSize(
      window.innerWidth,
      window.innerWidth * sliderValue
    ); //-- Viewport Size --//
    setChart3Height(window.innerWidth * sliderValue); //-- react-resizable chart1Height --//
    setChart3AspectRatioState(sliderValue); //-- aspect ratio state value for slider --//
  };
  let chart4AspectRatio_SliderHandler = (event, sliderValue) => {
    setChartTheme({ ...chartTheme, chart4AspectRatio: sliderValue }); //-- ChartTheme --//
    chart4Surface.changeViewportSize(
      window.innerWidth,
      window.innerWidth * sliderValue
    ); //-- Viewport Size --//
    setChart4Height(window.innerWidth * sliderValue); //-- react-resizable chart1Height --//
    setChart4AspectRatioState(sliderValue); //-- aspect ratio state value for slider --//
  };

  //----//
  // TODO - save the chartTheme object to a DynamoDB table and use that table to set initialChartTheme??
  // // maybe use the useLocalStorageSynchronizedWithDynamoDB() hook??

  //-- Function Return --//
  //-- *************** --//
  return (
    <Dialog
      open={chartThemePropertiesMenuIsOpen}
      onClose={chartThemeMenuCloseHandler}
      PaperComponent={PaperComponent}
      hideBackdrop={true}
      aria-labelledby="draggable-dialog-title"
      maxWidth="lg"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        Properties - Chart Theme
      </DialogTitle>

      <DialogContent>
        {/* ChartTheme Editable Properties color pickers  */}
        <Box sx={ALL_SERIES_BOX_SX}>
          {/* axisBandsFill */}
          <Box sx={ONE_BOX_SX}>
            <Typography>Background Major</Typography>
            <SketchPicker
              color={chartTheme.axisBandsFill}
              onChangeComplete={axisBandsFill_Handler}
              disableAlpha
              width={250}
              presetColors={PRESET_COLORS}
            />
          </Box>

          {/* sciChartBackground */}
          <Box sx={TWO_BOX_SX}>
            <Typography>Background Minor</Typography>
            <SketchPicker
              color={chartTheme.sciChartBackground}
              onChangeComplete={sciChartBackground_Handler}
              disableAlpha
              width={250}
              presetColors={PRESET_COLORS}
            />
          </Box>

          {/* majorGridLineBrush */}
          <Box sx={THREE_BOX_SX}>
            <Typography>Gridlines Major</Typography>
            <SketchPicker
              color={chartTheme.majorGridLineBrush}
              onChangeComplete={majorGridLineBrush_Handler}
              disableAlpha
              width={250}
              presetColors={PRESET_COLORS}
            />
          </Box>

          {/* minorGridLineBrush */}
          <Box sx={FOUR_BOX_SX}>
            <Typography>Gridlines Minor</Typography>
            <SketchPicker
              color={chartTheme.minorGridLineBrush}
              onChangeComplete={minorGridLineBrush_Handler}
              disableAlpha
              width={250}
              presetColors={PRESET_COLORS}
            />
          </Box>

          {/* tickTextBrush */}
          <Box sx={FIVE_BOX_SX}>
            <Typography>Labels</Typography>
            <SketchPicker
              color={chartTheme.tickTextBrush}
              onChangeComplete={tickTextBrush_Handler}
              disableAlpha
              width={250}
              presetColors={PRESET_COLORS}
            />
          </Box>

          {/* tickTextBrush */}
          <Box sx={SIX_BOX_SX}>
            <Typography>Chart 1 Aspect Ratio</Typography>
            <Slider
              value={
                typeof chart1AspectRatioState === "number"
                  ? chart1AspectRatioState
                  : 0.1
              }
              min={0.1}
              max={1.0}
              step={0.01}
              valueLabelDisplay="auto"
              onChange={chart1AspectRatio_SliderHandler}
            />

            <Typography>Chart 2 Aspect Ratio</Typography>
            <Slider
              value={
                typeof chart2AspectRatioState === "number"
                  ? chart2AspectRatioState
                  : 0.1
              }
              min={0.1}
              max={1.0}
              step={0.01}
              valueLabelDisplay="auto"
              onChange={chart2AspectRatio_SliderHandler}
            />

            <Typography>Chart 3 Aspect Ratio</Typography>
            <Slider
              value={
                typeof chart3AspectRatioState === "number"
                  ? chart3AspectRatioState
                  : 0.1
              }
              min={0.1}
              max={1.0}
              step={0.01}
              valueLabelDisplay="auto"
              onChange={chart3AspectRatio_SliderHandler}
            />

            <Typography>Chart 4 Aspect Ratio</Typography>
            <Slider
              value={
                typeof chart4AspectRatioState === "number"
                  ? chart4AspectRatioState
                  : 0.1
              }
              min={0.1}
              max={1.0}
              step={0.01}
              valueLabelDisplay="auto"
              onChange={chart4AspectRatio_SliderHandler}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={chartThemeMenuCloseHandler}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
