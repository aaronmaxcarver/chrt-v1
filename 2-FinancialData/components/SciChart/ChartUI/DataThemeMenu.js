import React, { Fragment, useState } from "react";

import { UpdateSuspender } from "scichart/Charting/Visuals/UpdateSuspender";

import { styled } from "@mui/system";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityOffSharpIcon from "@mui/icons-material/VisibilityOffSharp";
import VisibilitySharpIcon from "@mui/icons-material/VisibilitySharp";

import Emoji from "a11y-react-emoji";

import Draggable from "react-draggable";
import { SketchPicker } from "react-color";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";

const GRID_2x2_SX = {
  display: "grid",
  height: "100%",
  width: "100%",
  gridTemplateRows: "auto auto",
  gridTemplateColumns: "1fr 1fr",
  gridTemplateAreas: `"topLeft    topRight"
                      "bottomLeft bottomRight"`,
  gap: 1.2,
};
const GRID_2x2_TOP_LEFT_SX = {
  gridArea: "topLeft",
};
const GRID_2x2_TOP_RIGHT_SX = {
  gridArea: "topRight",
};
const GRID_2x2_BOTTOM_LEFT_SX = {
  gridArea: "bottomLeft",
};
const GRID_2x2_BOTTOM_RIGHT_SX = {
  gridArea: "bottomRight",
};
const GRID_2x1_SX = {
  display: "grid",
  height: "100%",
  width: "100%",
  gridTemplateRows: "auto",
  gridTemplateColumns: "1fr 1fr",
  gridTemplateAreas: `"lhs rhs"`,
  gap: 1.2,
};
const GRID_2x1_LHS_SX = {
  gridArea: "lhs",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  marginRight: "12px",
};
const GRID_2x1_RHS_SX = {
  gridArea: "rhs",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  marginLeft: "12px",
};
const MACD_SX = {
  display: "grid",
  height: "100%",
  width: "100%",
  gridTemplateRows: "auto auto",
  gridTemplateColumns: "auto",
  gridTemplateAreas: `"top"
                      "bottom"`,
  gap: 1.2,
};
const MACD_TOP_SX = {
  gridArea: "top",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "stretch",
  marginRight: "12px",
};
const MACD_BOTTOM_SX = {
  gridArea: "bottom",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
};
const TITLE_SX = {
  gridArea: "title",
  dipslay: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
};
const ACCORDION_DETAILS_SX = { backgroundColor: "#ddd" };
const STRETCH_SX = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "stretch",
};

//-- Properties Selectable Values --//
const marks1to16 = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 4,
    label: "4",
  },
  {
    value: 8,
    label: "8",
  },
  {
    value: 12,
    label: "12",
  },
  {
    value: 16,
    label: "16",
  },
];
const marks0to1 = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 0.5,
    label: "50%",
  },
  {
    value: 1,
    label: "100%",
  },
];
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

function PaperComponent(props) {
  return (
    //-- All props go to a normal paper component, and are then wrapped in a Draggable component which provides Draggable functionality --//
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  minHeight: 30,
  maxHeight: 30,
  backgroundColor: "#ccc",
  "&.Mui-expanded": {
    minHeight: 30,
    maxHeight: 30,
    backgroundColor: "#a5a5a5",
  },
}));

export default function DataThemeMenu(props) {
  let {
    dataTheme,
    setDataTheme,
    dataThemeMenuSeries,
    dataThemeMenuIsOpen,
    dataThemeMenuCloseHandler,
    chart2Surface,
    chart3Surface,
    chart4Surface,
    ohlcRenderableSeries,
    ema12VWRenderableSeries,
    abandsLowerRenderableSeries,
    abandsMiddleRenderableSeries,
    abandsUpperRenderableSeries,
    volumeRenderableSeries,
    macdHistogramRenderableSeriesChart3,
    macdMACDRenderableSeriesChart3,
    macdSignalRenderableSeriesChart3,
    rsiRenderableSeriesChart3,
    macdHistogramRenderableSeriesChart4,
    macdMACDRenderableSeriesChart4,
    macdSignalRenderableSeriesChart4,
    rsiRenderableSeriesChart4,
  } = props;

  //-- Menu Items --//
  const SeriesIsVisible = (props) => {
    let { series } = props;

    const isVisibleHandler = () => {
      //-- (0) Set active SciChart renderable series color --//
      series.isVisible = !series.isVisible;
      setDataTheme((prevState) => {
        //-- (1) Destructure series object from inside DataTheme object (prevState is the DataTheme) --//
        const seriesObjectInsideDataThemeObject = {
          ...prevState[series.dataSeriesProperty.dataSeriesNameProperty],
        };
        //-- (2) Update property --//
        seriesObjectInsideDataThemeObject.isVisible = series.isVisible;
        //-- (3) Spread in previous state, overwrite old series object with updated series object --//
        return {
          ...prevState,
          [series.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectInsideDataThemeObject,
        };
      });
    };

    return (
      <Tooltip
        title={series?.isVisible ? "Hide series" : "Show series"}
        placement="top-end"
        arrow
      >
        <Button
          onClick={isVisibleHandler}
          sx={{ marginBottom: "12px" }}
          variant="contained"
          color="primary"
        >
          {series?.isVisible ? (
            <VisibilityOffSharpIcon />
          ) : (
            <VisibilitySharpIcon />
          )}
        </Button>
      </Tooltip>
    );
  };
  const SeriesOpacity = (props) => {
    let { series } = props;

    const opacityHandler = (event) => {
      //-- (0) Set active SciChart renderable series color --//
      series.opacity = event.target.value;
      //-- (1) Destructure series object from inside DataTheme object (prevState is the DataTheme) --//
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[series.dataSeriesProperty.dataSeriesNameProperty],
        };
        //-- (2) Update property --//
        seriesObjectUndergoingUpdate.opacity = event.target.value;
        //-- (3) Spread in previous state, overwrite old series object with updated series object --//
        return {
          ...prevState,
          [series.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    };

    return (
      <Box>
        <Typography>Opacity</Typography>
        <Slider
          valueLabelDisplay="auto"
          value={series?.opacity}
          step={0.1}
          min={0}
          max={1}
          marks={marks0to1}
          onChange={opacityHandler}
        />
      </Box>
    );
  };
  const SeriesStrokeColor = (props) => {
    let { series } = props;

    const strokeColorHandler = (event) => {
      //-- (0) Set active SciChart renderable series color --//
      series.stroke = event.hex;
      //-- (1) Destructure series object from inside DataTheme object (prevState is the DataTheme) --//
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[series.dataSeriesProperty.dataSeriesNameProperty],
        };
        //-- (2) Update property --//
        seriesObjectUndergoingUpdate.stroke = event.hex;
        //-- (3) Spread in previous state, overwrite old series object with updated series object --//
        return {
          ...prevState,
          [series.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    };

    return (
      <Fragment>
        <Typography>Stroke Color</Typography>
        <SketchPicker
          color={series?.strokeProperty}
          onChangeComplete={strokeColorHandler}
          disableAlpha
          width={250}
          presetColors={PRESET_COLORS}
        />
      </Fragment>
    );
  };
  const SeriesBrushesAndStrokes = (props) => {
    let { series } = props;

    const strokeUpHandler = (event) => {
      //-- (0) Set active SciChart renderable series color --//
      series.strokeUp = event.hex;
      //-- (1) Destructure series object from inside DataTheme object (prevState is the DataTheme) --//
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[series.dataSeriesProperty.dataSeriesNameProperty],
        };
        //-- (2) Update property --//
        seriesObjectUndergoingUpdate.strokeUp = event.hex;
        //-- (3) Spread in previous state, overwrite old series object with updated series object --//
        return {
          ...prevState,
          [series.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    };
    const strokeDownHandler = (event) => {
      //-- (0) Set active SciChart renderable series color --//
      series.strokeDown = event.hex;
      //-- (1) Destructure series object from inside DataTheme object (prevState is the DataTheme) --//
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[series.dataSeriesProperty.dataSeriesNameProperty],
        };
        //-- (2) Update property --//
        seriesObjectUndergoingUpdate.strokeDown = event.hex;
        //-- (3) Spread in previous state, overwrite old series object with updated series object --//
        return {
          ...prevState,
          [series.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    };
    const brushUpHandler = (event) => {
      //-- (0) Set active SciChart renderable series color --//
      series.brushUp = event.hex;
      //-- (1) Destructure series object from inside DataTheme object (prevState is the DataTheme) --//
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[series.dataSeriesProperty.dataSeriesNameProperty],
        };
        //-- (2) Update property --//
        seriesObjectUndergoingUpdate.brushUp = event.hex;
        //-- (3) Spread in previous state, overwrite old series object with updated series object --//
        return {
          ...prevState,
          [series.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
      //-- Match volume series by changing pallete provider colors --//
      UpdateSuspender.using(chart2Surface, () => {
        volumeRenderableSeries.paletteProvider.volumeUpRGBA =
          parseColorToUIntArgb(event.hex);
      });
    };
    const brushDownHandler = (event) => {
      //-- (0) Set active SciChart renderable series color --//
      series.brushDown = event.hex;
      //-- (1) Destructure series object from inside DataTheme object (prevState is the DataTheme) --//
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[series.dataSeriesProperty.dataSeriesNameProperty],
        };
        //-- (2) Update property --//
        seriesObjectUndergoingUpdate.brushDown = event.hex;
        //-- (3) Spread in previous state, overwrite old series object with updated series object --//
        return {
          ...prevState,
          [series.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
      //-- Match volume series by changing pallete provider colors --//
      UpdateSuspender.using(chart2Surface, () => {
        volumeRenderableSeries.paletteProvider.volumeDownRGBA =
          parseColorToUIntArgb(event.hex);
      });
    };
    return (
      <Box sx={GRID_2x2_SX}>
        {/* Brush Up */}
        <Box sx={GRID_2x2_TOP_LEFT_SX}>
          <Typography>
            <Emoji symbol="⬆️ 🟢 " label="up" />
            Up Fill
          </Typography>
          <SketchPicker
            color={series?.brushUpProperty}
            onChangeComplete={brushUpHandler}
            disableAlpha
            width={250}
            presetColors={PRESET_COLORS}
          />
        </Box>
        {/* Brush Down */}
        <Box sx={GRID_2x2_BOTTOM_LEFT_SX}>
          <Typography>
            <Emoji symbol="⬇️ 🔴 " label="down" />
            Down Fill
          </Typography>
          <SketchPicker
            color={series?.brushDownProperty}
            onChangeComplete={brushDownHandler}
            disableAlpha
            width={250}
            presetColors={PRESET_COLORS}
          />
        </Box>
        {/* Stroke Up */}
        <Box sx={GRID_2x2_TOP_RIGHT_SX}>
          <Typography>
            <Emoji symbol="⬆️ 🟢 " label="up" />
            Up Border
          </Typography>
          <SketchPicker
            color={series?.strokeUpProperty}
            onChangeComplete={strokeUpHandler}
            disableAlpha
            width={250}
            presetColors={PRESET_COLORS}
          />
        </Box>
        {/* Stroke Down */}
        <Box sx={GRID_2x2_BOTTOM_RIGHT_SX}>
          <Typography>
            <Emoji symbol="⬇️ 🔴 " label="down" />
            Down Border
          </Typography>
          <SketchPicker
            color={series?.strokeDownProperty}
            onChangeComplete={strokeDownHandler}
            disableAlpha
            width={250}
            presetColors={PRESET_COLORS}
          />
        </Box>
      </Box>
    );
  };
  const SeriesStrokeThickness = (props) => {
    let { series } = props;

    const strokeThicknessHandler = (event) => {
      //-- (0) Set active SciChart renderable series color --//
      series.strokeThickness = event.target.value;
      //-- (1) Destructure series object from inside DataTheme object (prevState is the DataTheme) --//
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[series.dataSeriesProperty.dataSeriesNameProperty],
        };
        //-- (2) Update property --//
        seriesObjectUndergoingUpdate.strokeThickness = event.target.value;
        //-- (3) Spread in previous state, overwrite old series object with updated series object --//
        return {
          ...prevState,
          [series.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    };

    return (
      <Box>
        <Typography>Stroke Thickness</Typography>
        <Slider
          value={series?.strokeThickness}
          valueLabelDisplay="auto"
          step={1}
          min={0}
          max={16}
          marks={marks1to16}
          onChange={strokeThicknessHandler}
        />
      </Box>
    );
  };
  const SeriesDashArray = (props) => {
    let { series } = props;

    const dashArrayDashesHandler = (event) => {
      //-- If no dash array, set both dashes and spaces to incoming value --//
      if (!series.strokeDashArray) {
        series.strokeDashArray = [
          event.target.value, //-- Dashes --//
          event.target.value, //-- Spaces --//
        ];
        //-- setDataTheme Dashes --//
        //-- (1) Destructure series object from inside DataTheme object (prevState is the DataTheme) --//
        setDataTheme((prevState) => {
          const seriesObjectUndergoingUpdate = {
            ...prevState[series.dataSeriesProperty.dataSeriesNameProperty],
          };
          //-- (2) Update property --//
          seriesObjectUndergoingUpdate.strokeDashArray[0] = event.target.value; //-- Dashes --//
          seriesObjectUndergoingUpdate.strokeDashArray[1] = event.target.value; //-- Spaces --//
          //-- (3) Spread in previous state, overwrite old series object with updated series object --//
          return {
            ...prevState,
            [series.dataSeriesProperty.dataSeriesNameProperty]:
              seriesObjectUndergoingUpdate,
          };
        });
      } else {
        //-- Else set just Dashes to a new value --//
        series.strokeDashArray = [
          event.target.value, //-- Dashes does change here --//
          series.strokeDashArray[1], //-- Spaces doesn't change here --//
        ];
        //-- (1) Destructure series object from inside DataTheme object (prevState is the DataTheme) --//
        setDataTheme((prevState) => {
          const seriesObjectUndergoingUpdate = {
            ...prevState[series.dataSeriesProperty.dataSeriesNameProperty],
          };
          //-- (2) Update property --//
          seriesObjectUndergoingUpdate.strokeDashArray[0] = event.target.value; //-- Dashes --//
          //-- (3) Spread in previous state, overwrite old series object with updated series object --//
          return {
            ...prevState,
            [series.dataSeriesProperty.dataSeriesNameProperty]:
              seriesObjectUndergoingUpdate,
          };
        });
      }
    };

    const dashArraySpacesHandler = (event) => {
      //-- If no dash array, set both dashes and spaces to incoming value --//
      if (!series.strokeDashArray) {
        series.strokeDashArray = [event.target.value, event.target.value];
        //-- setDataTheme Dashes --//
        //-- (1) Destructure series object from inside DataTheme object (prevState is the DataTheme) --//
        setDataTheme((prevState) => {
          const seriesObjectUndergoingUpdate = {
            ...prevState[series.dataSeriesProperty.dataSeriesNameProperty],
          };
          //-- (2) Update property --//
          seriesObjectUndergoingUpdate.strokeDashArray[0] = event.target.value; //-- Dashes --//
          seriesObjectUndergoingUpdate.strokeDashArray[1] = event.target.value; //-- Spaces --//
          //-- (3) Spread in previous state, overwrite old series object with updated series object --//
          return {
            ...prevState,
            [series.dataSeriesProperty.dataSeriesNameProperty]:
              seriesObjectUndergoingUpdate,
          };
        });
      } else {
        //-- Else set just Spaces to a new value --//
        series.strokeDashArray = [
          series.strokeDashArray[0], //-- Dashes doesn't change here--//
          event.target.value, //-- Spaces does change here --//
        ];
        //-- (1) Destructure series object from inside DataTheme object (prevState is the DataTheme) --//
        setDataTheme((prevState) => {
          const seriesObjectUndergoingUpdate = {
            ...prevState[series.dataSeriesProperty.dataSeriesNameProperty],
          };
          //-- (2) Update property --//
          seriesObjectUndergoingUpdate.strokeDashArray[1] = event.target.value; //-- Spaces --//
          //-- (3) Spread in previous state, overwrite old series object with updated series object --//
          return {
            ...prevState,
            [series.dataSeriesProperty.dataSeriesNameProperty]:
              seriesObjectUndergoingUpdate,
          };
        });
      }
    };

    return (
      <Fragment>
        <Box>
          <Typography>Dashes</Typography>
          <Slider
            value={series?.strokeDashArrayProperty?.[0] || 0}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={16}
            marks={marks1to16}
            onChange={dashArrayDashesHandler}
          />
        </Box>
        <Box>
          <Typography>Spaces</Typography>
          <Slider
            value={series?.strokeDashArrayProperty?.[1] || 0}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={16}
            marks={marks1to16}
            onChange={dashArraySpacesHandler}
          />
        </Box>
      </Fragment>
    );
  };
  const SeriesMACDPaletteProvider = (props) => {
    let { series } = props;

    //-- Series 3 Column Fill Above 0 (ColumnSeries) --//
    const seriesColumnFillAbove0Handler = (event) => {
      UpdateSuspender.using(chart4Surface, () => {
        UpdateSuspender.using(chart3Surface, () => {
          series.paletteProvider.above0ColorRGBA = parseColorToUIntArgb(
            event.hex
          );
        });
      });
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[series.dataSeriesProperty.dataSeriesNameProperty],
        };
        seriesObjectUndergoingUpdate.above0 = event.hex;
        return {
          ...prevState,
          [series.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    };
    //-- Series 3 Column Fill Below 0(ColumnSeries) --//
    const seriesColumnFillBelow0Handler = (event) => {
      UpdateSuspender.using(chart4Surface, () => {
        UpdateSuspender.using(chart3Surface, () => {
          series.paletteProvider.below0ColorRGBA = parseColorToUIntArgb(
            event.hex
          );
        });
      });
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[series.dataSeriesProperty.dataSeriesNameProperty],
        };
        seriesObjectUndergoingUpdate.below0 = event.hex;
        return {
          ...prevState,
          [series.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    };

    return (
      <Fragment>
        {/* MACD series - edit palette provider (above 0) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <Typography>Above 0</Typography>
          <SketchPicker
            color={series?.paletteProvider?.above0ColorRGBA}
            onChangeComplete={seriesColumnFillAbove0Handler}
            disableAlpha
            width={250}
            presetColors={PRESET_COLORS}
          />
        </Box>
        {/* MACD series - edit palette provider (below 0) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <Typography>Below 0</Typography>
          <SketchPicker
            color={series?.paletteProvider?.below0ColorRGBA}
            onChangeComplete={seriesColumnFillBelow0Handler}
            disableAlpha
            width={250}
            presetColors={PRESET_COLORS}
          />
        </Box>
      </Fragment>
    );
  };

  //-- Open / Close Accordions --//
  const [ohlcOpen, setOHLCOpen] = useState(false);
  const [emaOpen, setEMAOpen] = useState(false);
  const [abandsOpen, setABANDSOpen] = useState(false);
  //-- CHART 3 --//
  const [macdChart3Open, setMACDChart3Open] = useState(false);
  const [rsiChart3Open, setRSIChart3Open] = useState(false);
  //-- CHART 4 --//
  const [macdChart4Open, setMACDChart4Open] = useState(false);
  const [rsiChart4Open, setRSIChart4Open] = useState(false);

  const allOpenHandler = () => {
    setOHLCOpen(true);
    setEMAOpen(true);
    setABANDSOpen(true);
    setMACDChart3Open(true);
    setRSIChart3Open(true);
    setMACDChart4Open(true);
    setRSIChart4Open(true);
  };
  const allCloseHandler = () => {
    setOHLCOpen(false);
    setEMAOpen(false);
    setABANDSOpen(false);
    setMACDChart3Open(false);
    setRSIChart3Open(false);
    setMACDChart4Open(false);
    setRSIChart4Open(false);
  };

  const ohlcHandler = () => {
    setOHLCOpen((prevState) => !prevState);
  };
  const emaHandler = () => {
    setEMAOpen((prevState) => !prevState);
  };
  const abandsHandler = () => {
    setABANDSOpen((prevState) => !prevState);
  };
  const macdChart3Handler = () => {
    setMACDChart3Open((prevState) => !prevState);
  };
  const rsiChart3Handler = () => {
    setRSIChart3Open((prevState) => !prevState);
  };
  const macdChart4Handler = () => {
    setMACDChart4Open((prevState) => !prevState);
  };
  const rsiChart4Handler = () => {
    setRSIChart4Open((prevState) => !prevState);
  };

  return (
    <Dialog
      open={dataThemeMenuIsOpen}
      onClose={dataThemeMenuCloseHandler}
      PaperComponent={PaperComponent}
      hideBackdrop={true}
      aria-labelledby="draggable-dialog-title"
      maxWidth="lg"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        <Typography sx={TITLE_SX}>Data Theme Menu</Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            direction: "row",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant={"outlined"}
            onClick={allOpenHandler}
            sx={{ marginLeft: "6px", marginBottom: "5px" }}
          >
            Open All
          </Button>
          <Button
            variant={"outlined"}
            onClick={allCloseHandler}
            sx={{ marginLeft: "6px", marginBottom: "5px" }}
          >
            Close All
          </Button>
        </Box>
        {/* //----// */}
        {/* OHLC */}
        <Accordion expanded={ohlcOpen} onChange={ohlcHandler}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>OHLC</Typography>
          </StyledAccordionSummary>
          <AccordionDetails sx={ACCORDION_DETAILS_SX}>
            <Box sx={STRETCH_SX}>
              <SeriesIsVisible series={ohlcRenderableSeries} />
            </Box>
            <SeriesOpacity series={ohlcRenderableSeries} />
            <SeriesStrokeThickness series={ohlcRenderableSeries} />
            <SeriesBrushesAndStrokes series={ohlcRenderableSeries} />
          </AccordionDetails>
        </Accordion>

        {/* EMA*/}
        <Accordion expanded={emaOpen} onChange={emaHandler}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>EMA</Typography>
          </StyledAccordionSummary>
          <AccordionDetails sx={ACCORDION_DETAILS_SX}>
            <Box sx={GRID_2x1_SX}>
              <Box sx={GRID_2x1_LHS_SX}>
                <SeriesIsVisible series={ema12VWRenderableSeries} />
                <SeriesOpacity series={ema12VWRenderableSeries} />
                <SeriesStrokeThickness series={ema12VWRenderableSeries} />
                <SeriesDashArray series={ema12VWRenderableSeries} />
              </Box>
              <Box sx={GRID_2x1_RHS_SX}>
                <SeriesStrokeColor series={ema12VWRenderableSeries} />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ABANDS */}
        <Accordion expanded={abandsOpen} onChange={abandsHandler}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>ABANDS</Typography>
          </StyledAccordionSummary>
          <AccordionDetails sx={ACCORDION_DETAILS_SX}>
            <Typography variant="h6">Upper</Typography>
            <Box sx={GRID_2x1_SX}>
              <Box sx={GRID_2x1_LHS_SX}>
                <SeriesIsVisible series={abandsUpperRenderableSeries} />
                <SeriesStrokeThickness series={abandsUpperRenderableSeries} />
                <SeriesDashArray series={abandsUpperRenderableSeries} />
                <SeriesOpacity series={abandsUpperRenderableSeries} />
              </Box>
              <Box sx={GRID_2x1_RHS_SX}>
                <SeriesStrokeColor series={abandsUpperRenderableSeries} />
              </Box>
            </Box>
            <Divider light={true} />
            <Typography variant="h6">Middle</Typography>
            <Box sx={GRID_2x1_SX}>
              <Box sx={GRID_2x1_LHS_SX}>
                <SeriesIsVisible series={abandsMiddleRenderableSeries} />
                <SeriesStrokeThickness series={abandsMiddleRenderableSeries} />
                <SeriesDashArray series={abandsMiddleRenderableSeries} />
                <SeriesOpacity series={abandsMiddleRenderableSeries} />
              </Box>
              <Box sx={GRID_2x1_RHS_SX}>
                <SeriesStrokeColor series={abandsMiddleRenderableSeries} />
              </Box>
            </Box>
            <Divider light={true} />
            <Typography variant="h6">Lower</Typography>
            <Box sx={GRID_2x1_SX}>
              <Box sx={GRID_2x1_LHS_SX}>
                <SeriesIsVisible series={abandsLowerRenderableSeries} />
                <SeriesStrokeThickness series={abandsLowerRenderableSeries} />
                <SeriesDashArray series={abandsLowerRenderableSeries} />
                <SeriesOpacity series={abandsLowerRenderableSeries} />
              </Box>
              <Box sx={GRID_2x1_RHS_SX}>
                <SeriesStrokeColor series={abandsLowerRenderableSeries} />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        {/* CHART 3 */}
        {/* ******* */}
        {/* RSI Chart 3*/}
        <Accordion expanded={rsiChart3Open} onChange={rsiChart3Handler}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>[Lower 1] RSI</Typography>
          </StyledAccordionSummary>
          <AccordionDetails sx={ACCORDION_DETAILS_SX}>
            <Box sx={GRID_2x1_SX}>
              <Box sx={GRID_2x1_LHS_SX}>
                <SeriesIsVisible series={rsiRenderableSeriesChart3} />
                <SeriesOpacity series={rsiRenderableSeriesChart3} />
                <SeriesStrokeThickness series={rsiRenderableSeriesChart3} />
                <SeriesDashArray series={rsiRenderableSeriesChart3} />
              </Box>
              <Box sx={GRID_2x1_RHS_SX}>
                <SeriesStrokeColor series={rsiRenderableSeriesChart3} />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        {/* MACD Chart 3 */}
        <Accordion expanded={macdChart3Open} onChange={macdChart3Handler}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>[Lower 1] MACD</Typography>
          </StyledAccordionSummary>
          <AccordionDetails sx={ACCORDION_DETAILS_SX}>
            <Box sx={GRID_2x1_SX}>
              <Box sx={GRID_2x1_LHS_SX}>
                <Typography variant="h6">MACD</Typography>
                <SeriesIsVisible series={macdMACDRenderableSeriesChart3} />
                <SeriesOpacity series={macdMACDRenderableSeriesChart3} />
                <SeriesStrokeThickness
                  series={macdMACDRenderableSeriesChart3}
                />
                <SeriesDashArray series={macdMACDRenderableSeriesChart3} />
              </Box>
              <Box sx={GRID_2x1_RHS_SX}>
                <SeriesStrokeColor series={macdMACDRenderableSeriesChart3} />
              </Box>
            </Box>
          </AccordionDetails>
          <Divider light={true} />
          <AccordionDetails sx={ACCORDION_DETAILS_SX}>
            <Box sx={GRID_2x1_SX}>
              <Box sx={GRID_2x1_LHS_SX}>
                <Typography variant="h6">Signal</Typography>
                <SeriesIsVisible series={macdSignalRenderableSeriesChart3} />
                <SeriesOpacity series={macdSignalRenderableSeriesChart3} />
                <SeriesStrokeThickness
                  series={macdSignalRenderableSeriesChart3}
                />
                <SeriesDashArray series={macdSignalRenderableSeriesChart3} />
              </Box>
              <Box sx={GRID_2x1_RHS_SX}>
                <SeriesStrokeColor series={macdSignalRenderableSeriesChart3} />
              </Box>
            </Box>
          </AccordionDetails>
          <Divider light={true} />
          <AccordionDetails sx={ACCORDION_DETAILS_SX}>
            <Box sx={MACD_SX}>
              <Box sx={MACD_TOP_SX}>
                <Typography variant="h6">Histogram</Typography>
                <SeriesIsVisible series={macdHistogramRenderableSeriesChart3} />
                <SeriesStrokeThickness
                  series={macdHistogramRenderableSeriesChart3}
                />
              </Box>
              <Box sx={MACD_BOTTOM_SX}>
                <SeriesMACDPaletteProvider
                  series={macdHistogramRenderableSeriesChart3}
                />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        {/* CHART 4 */}
        {/* ******* */}
        {/* RSI Chart 4*/}
        <Accordion expanded={rsiChart4Open} onChange={rsiChart4Handler}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>[Lower 2] RSI</Typography>
          </StyledAccordionSummary>
          <AccordionDetails sx={ACCORDION_DETAILS_SX}>
            <Box sx={GRID_2x1_SX}>
              <Box sx={GRID_2x1_LHS_SX}>
                <SeriesIsVisible series={rsiRenderableSeriesChart4} />
                <SeriesOpacity series={rsiRenderableSeriesChart4} />
                <SeriesStrokeThickness series={rsiRenderableSeriesChart4} />
                <SeriesDashArray series={rsiRenderableSeriesChart4} />
              </Box>
              <Box sx={GRID_2x1_RHS_SX}>
                <SeriesStrokeColor series={rsiRenderableSeriesChart4} />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        {/* MACD Chart 4 */}
        <Accordion expanded={macdChart4Open} onChange={macdChart4Handler}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>[Lower 2] MACD</Typography>
          </StyledAccordionSummary>
          <AccordionDetails sx={ACCORDION_DETAILS_SX}>
            <Box sx={GRID_2x1_SX}>
              <Box sx={GRID_2x1_LHS_SX}>
                <Typography variant="h6">MACD</Typography>
                <SeriesIsVisible series={macdMACDRenderableSeriesChart4} />
                <SeriesOpacity series={macdMACDRenderableSeriesChart4} />
                <SeriesStrokeThickness
                  series={macdMACDRenderableSeriesChart4}
                />
                <SeriesDashArray series={macdMACDRenderableSeriesChart4} />
              </Box>
              <Box sx={GRID_2x1_RHS_SX}>
                <SeriesStrokeColor series={macdMACDRenderableSeriesChart4} />
              </Box>
            </Box>
          </AccordionDetails>
          <Divider light={true} />
          <AccordionDetails sx={ACCORDION_DETAILS_SX}>
            <Box sx={GRID_2x1_SX}>
              <Box sx={GRID_2x1_LHS_SX}>
                <Typography variant="h6">Signal</Typography>
                <SeriesIsVisible series={macdSignalRenderableSeriesChart4} />
                <SeriesOpacity series={macdSignalRenderableSeriesChart4} />
                <SeriesStrokeThickness
                  series={macdSignalRenderableSeriesChart4}
                />
                <SeriesDashArray series={macdSignalRenderableSeriesChart4} />
              </Box>
              <Box sx={GRID_2x1_RHS_SX}>
                <SeriesStrokeColor series={macdSignalRenderableSeriesChart4} />
              </Box>
            </Box>
          </AccordionDetails>
          <Divider light={true} />
          <AccordionDetails sx={ACCORDION_DETAILS_SX}>
            <Box sx={MACD_SX}>
              <Box sx={MACD_TOP_SX}>
                <Typography variant="h6">Histogram</Typography>
                <SeriesIsVisible series={macdHistogramRenderableSeriesChart4} />
                <SeriesStrokeThickness
                  series={macdHistogramRenderableSeriesChart4}
                />
              </Box>
              <Box sx={MACD_BOTTOM_SX}>
                <SeriesMACDPaletteProvider
                  series={macdHistogramRenderableSeriesChart4}
                />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* //----// */}
      </DialogContent>
      <DialogActions style={{ cursor: "move" }} id="draggable-dialog-title">
        <Button onClick={dataThemeMenuCloseHandler}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
