import React, { Fragment, useState } from "react";

import { UpdateSuspender } from "scichart/Charting/Visuals/UpdateSuspender";

import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import VisibilitySharpIcon from "@mui/icons-material/VisibilitySharp";
import VisibilityOffSharpIcon from "@mui/icons-material/VisibilityOffSharp";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import Emoji from "a11y-react-emoji";

import Draggable from "react-draggable";
import { SketchPicker } from "react-color";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";

const ALL_SERIES_BOX_SX = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  // gap: 12,
};

const SINGLE_SERIES_BOX_SX = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  gap: 1.5,
  marginX: 3,
};

const OHLC_2x2_COLOR_SELECTOR_SX = {
  display: "grid",
  height: "100%",
  width: "100%",
  gridTemplateRows: "auto auto",
  gridTemplateColumns: "1fr 1fr",
  gridTemplateAreas: `"topLeft    topRight"
                      "bottomLeft bottomRight"`,
  gap: 1.2,
};

const OHLC_2x2_COLOR_SELECTOR_UP_FILL_SX = {
  gridArea: "topLeft",
};
const OHLC_2x2_COLOR_SELECTOR_UP_BORDER_SX = {
  gridArea: "topRight",
};
const OHLC_2x2_COLOR_SELECTOR_DOWN_FILL_SX = {
  gridArea: "bottomLeft",
};
const OHLC_2x2_COLOR_SELECTOR_DOWN_BORDER_SX = {
  gridArea: "bottomRight",
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

export default function DataThemeMenu(props) {
  let {
    dataTheme,
    setDataTheme,
    dataThemeMenuSeries,
    dataThemeMenuIsOpen,
    dataThemeMenuCloseHandler,
    volumeRenderableSeries,
    chart2Surface,
    chart3Surface,
    chart4Surface,
  } = props;

  //-- Renderable series (the objects from SciChart) --//
  //-- ********************************************* --//
  let label = dataThemeMenuSeries?.label;

  let renderableSeries1 = dataThemeMenuSeries?.renderableSeries?.[0];
  let series1Name =
    renderableSeries1?.dataSeriesProperty?.dataSeriesNameProperty;

  let renderableSeries2 = dataThemeMenuSeries?.renderableSeries?.[1];
  let series2Name =
    renderableSeries2?.dataSeriesProperty?.dataSeriesNameProperty;

  let renderableSeries3 = dataThemeMenuSeries?.renderableSeries?.[2];
  let series3Name =
    renderableSeries3?.dataSeriesProperty?.dataSeriesNameProperty;

  // TODO - make this (series properties updater) into a custom hook then inline it with the eventHandlers

  //-- Series 1 --//
  //-- Series 1 isVisible  --//
  const renderableSeries1IsVisibleHandler = () => {
    //-- (0) set active SciChart renderable series color --//
    renderableSeries1.isVisible = !renderableSeries1.isVisible;
    //-- (1) Find the renderable series 1 object in DataTheme (DataTheme object is prevState) --//
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries1.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      //-- (2) update property --//
      seriesObjectUndergoingUpdate.isVisible = renderableSeries1.isVisible;
      //-- (3) Spread in previous state then overwrite just the nested object with the updated property --//
      return {
        ...prevState,
        [renderableSeries1.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
  };
  //-- Series 1 Stroke Color --//
  const renderableSeries1StrokeColorHandler = (event) => {
    renderableSeries1.stroke = event.hex;
    //-- (1) Find the renderable series 1 object in DataTheme (DataTheme object is prevState) --//
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries1.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      //-- (2) update property --//
      seriesObjectUndergoingUpdate.stroke = event.hex;
      //-- (3) Spread in previous state then overwrite just the nested object with the updated property --//
      return {
        ...prevState,
        [renderableSeries1.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
  };
  //-- Series 1 Stroke Thickness --//
  const renderableSeries1StrokeThicknessHandler = (event) => {
    renderableSeries1.strokeThickness = event.target.value;
    //-- (1) Find the renderable series 1 object in DataTheme (DataTheme object is prevState) --//
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries1.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      //-- (2) update property --//
      seriesObjectUndergoingUpdate.strokeThickness = event.target.value;
      //-- (3) Spread in previous state then overwrite just the nested object with the updated property --//
      return {
        ...prevState,
        [renderableSeries1.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
  };
  //-- Series 1 Stroke Dash Array: [Dashes, Spaces] --//
  const renderableSeries1DashArrayDashesHandler = (event) => {
    //-- If no dash array, set both dashes and spaces to incoming value --//
    if (!renderableSeries1.strokeDashArray) {
      renderableSeries1.strokeDashArray = [
        event.target.value, //-- Dashes --//
        event.target.value, //-- Spaces --//
      ];
      //-- setDataTheme Dashes --//
      //-- (1) Find the renderable series 1 object in DataTheme (DataTheme object is prevState) --//
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[
            renderableSeries1.dataSeriesProperty.dataSeriesNameProperty
          ],
        };
        //-- (2) update property --//
        seriesObjectUndergoingUpdate.strokeDashArray[0] = event.target.value; //-- Dashes --//
        seriesObjectUndergoingUpdate.strokeDashArray[1] = event.target.value; //-- Spaces --//
        //-- (3) Spread in previous state then overwrite just the nested object with the updated property --//
        return {
          ...prevState,
          [renderableSeries1.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    } else {
      //-- Else set just Dashes to a new value --//
      renderableSeries1.strokeDashArray = [
        event.target.value, //-- Dashes does change here --//
        renderableSeries1.strokeDashArray[1], //-- Spaces doesn't change here --//
      ];
      //-- (1) Find the renderable series 1 object in DataTheme (DataTheme object is prevState) --//
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[
            renderableSeries1.dataSeriesProperty.dataSeriesNameProperty
          ],
        };
        //-- (2) update property --//
        seriesObjectUndergoingUpdate.strokeDashArray[0] = event.target.value; //-- Dashes --//
        //-- (3) Spread in previous state then overwrite just the nested object with the updated property --//
        return {
          ...prevState,
          [renderableSeries1.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    }
  };
  const renderableSeries1DashArraySpacesHandler = (event) => {
    //-- If no dash array, set both dashes and spaces to incoming value --//
    if (!renderableSeries1.strokeDashArray) {
      renderableSeries1.strokeDashArray = [
        event.target.value,
        event.target.value,
      ];
      //-- setDataTheme Dashes --//
      //-- (1) Find the renderable series 1 object in DataTheme (DataTheme object is prevState) --//
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[
            renderableSeries1.dataSeriesProperty.dataSeriesNameProperty
          ],
        };
        //-- (2) update property --//
        seriesObjectUndergoingUpdate.strokeDashArray[0] = event.target.value; //-- Dashes --//
        seriesObjectUndergoingUpdate.strokeDashArray[1] = event.target.value; //-- Spaces --//
        //-- (3) Spread in previous state then overwrite just the nested object with the updated property --//
        return {
          ...prevState,
          [renderableSeries1.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    } else {
      //-- Else set just Spaces to a new value --//
      renderableSeries1.strokeDashArray = [
        renderableSeries1.strokeDashArray[0], //-- Dashes doesn't change here--//
        event.target.value, //-- Spaces does change here --//
      ];
      //-- (1) Find the renderable series 1 object in DataTheme (DataTheme object is prevState) --//
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[
            renderableSeries1.dataSeriesProperty.dataSeriesNameProperty
          ],
        };
        //-- (2) update property --//
        seriesObjectUndergoingUpdate.strokeDashArray[1] = event.target.value; //-- Spaces --//
        //-- (3) Spread in previous state then overwrite just the nested object with the updated property --//
        return {
          ...prevState,
          [renderableSeries1.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    }
  };
  //-- Series 1 Stroke Up --//
  const renderableSeries1StrokeUpHandler = (event) => {
    renderableSeries1.strokeUp = event.hex;
    //-- (1) Find the renderable series 1 object in DataTheme (DataTheme object is prevState) --//
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries1.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      //-- (2) update property --//
      seriesObjectUndergoingUpdate.strokeUp = event.hex;
      //-- (3) Spread in previous state then overwrite just the nested object with the updated property --//
      return {
        ...prevState,
        [renderableSeries1.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
  };
  //-- Series 1 Stroke Down --//
  const renderableSeries1StrokeDownHandler = (event) => {
    renderableSeries1.strokeDown = event.hex;
    //-- (1) Find the renderable series 1 object in DataTheme (DataTheme object is prevState) --//
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries1.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      //-- (2) update property --//
      seriesObjectUndergoingUpdate.strokeDown = event.hex;
      //-- (3) Spread in previous state then overwrite just the nested object with the updated property --//
      return {
        ...prevState,
        [renderableSeries1.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
  };
  //-- Series 1 Brush Up --//
  const renderableSeries1BrushUpHandler = (event) => {
    renderableSeries1.brushUp = event.hex;
    //-- (1) Find the renderable series 1 object in DataTheme (DataTheme object is prevState) --//
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries1.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      //-- (2) update property --//
      seriesObjectUndergoingUpdate.brushUp = event.hex;
      //-- (3) Spread in previous state then overwrite just the nested object with the updated property --//
      return {
        ...prevState,
        [renderableSeries1.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
    //-- Match volume series by changing pallete provider colors --//
    UpdateSuspender.using(chart2Surface, () => {
      volumeRenderableSeries.paletteProvider.volumeUpRGBA =
        parseColorToUIntArgb(event.hex);
    });
  };
  //-- Series 1 Brush Down --//
  const renderableSeries1BrushDownHandler = (event) => {
    renderableSeries1.brushDown = event.hex;
    //-- (1) Find the renderable series 1 object in DataTheme (DataTheme object is prevState) --//
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries1.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      //-- (2) update property --//
      seriesObjectUndergoingUpdate.brushDown = event.hex;
      //-- (3) Spread in previous state then overwrite just the nested object with the updated property --//
      return {
        ...prevState,
        [renderableSeries1.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
    //-- Match volume series by changing pallete provider colors --//
    UpdateSuspender.using(chart2Surface, () => {
      volumeRenderableSeries.paletteProvider.volumeDownRGBA =
        parseColorToUIntArgb(event.hex);
    });
  };
  //-- Series 1 Opacity --//
  const renderableSeries1OpacityHandler = (event) => {
    renderableSeries1.opacity = event.target.value;
    //-- (1) Find the renderable series 1 object in DataTheme (DataTheme object is prevState) --//
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries1.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      //-- (2) update property --//
      seriesObjectUndergoingUpdate.opacity = event.target.value;
      //-- (3) Spread in previous state then overwrite just the nested object with the updated property --//
      return {
        ...prevState,
        [renderableSeries1.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
  };

  //-- Series 2 --//
  //-- Series 2 isVisible --//
  const renderableSeries2IsVisibleHandler = () => {
    renderableSeries2.isVisible = !renderableSeries2.isVisible;
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries2.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      seriesObjectUndergoingUpdate.isVisible = renderableSeries2.isVisible;
      return {
        ...prevState,
        [renderableSeries2.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
  };
  //-- Series 2 Stroke Color --//
  const renderableSeries2StrokeColorHandler = (event) => {
    renderableSeries2.stroke = event.hex;
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries2.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      seriesObjectUndergoingUpdate.stroke = event.hex;
      return {
        ...prevState,
        [renderableSeries2.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
  };
  //-- Series 2 Stroke Thickness --//
  const renderableSeries2StrokeThicknessHandler = (event) => {
    renderableSeries2.strokeThickness = event.target.value;
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries2.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      //-- (2) update property --//
      seriesObjectUndergoingUpdate.strokeThickness = event.target.value;
      //-- (3) Spread in previous state then overwrite just the nested object with the updated property --//
      return {
        ...prevState,
        [renderableSeries2.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
  };
  //-- Series 2 Stroke Dash Array: [Dashes, Spaces] --//
  const renderableSeries2DashArrayDashesHandler = (event) => {
    //-- If no dash array, set both dashes and spaces to incoming value --//
    if (!renderableSeries2.strokeDashArray) {
      renderableSeries2.strokeDashArray = [
        event.target.value,
        event.target.value,
      ];
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[
            renderableSeries2.dataSeriesProperty.dataSeriesNameProperty
          ],
        };
        seriesObjectUndergoingUpdate.strokeDashArray[0] = event.target.value; //-- Dashes --//
        seriesObjectUndergoingUpdate.strokeDashArray[1] = event.target.value; //-- Spaces --//
        return {
          ...prevState,
          [renderableSeries2.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    } else {
      renderableSeries2.strokeDashArray = [
        event.target.value, //-- Dashes change here --//
        renderableSeries2.strokeDashArray[1], //-- Spaces doesn't change here --//
      ];
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[
            renderableSeries2.dataSeriesProperty.dataSeriesNameProperty
          ],
        };
        seriesObjectUndergoingUpdate.strokeDashArray[0] = event.target.value; //-- Dashes --//
        return {
          ...prevState,
          [renderableSeries2.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    }
  };
  const renderableSeries2DashArraySpacesHandler = (event) => {
    //-- If no dash array, set both dashes and spaces to incoming value --//
    if (!renderableSeries2.strokeDashArray) {
      renderableSeries2.strokeDashArray = [
        event.target.value,
        event.target.value,
      ];
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[
            renderableSeries2.dataSeriesProperty.dataSeriesNameProperty
          ],
        };
        seriesObjectUndergoingUpdate.strokeDashArray[0] = event.target.value; //-- Dashes --//
        seriesObjectUndergoingUpdate.strokeDashArray[1] = event.target.value; //-- Spaces --//
        return {
          ...prevState,
          [renderableSeries2.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    } else {
      renderableSeries2.strokeDashArray = [
        renderableSeries2.strokeDashArray[0], //-- Dashes does not change here --//
        event.target.value, //-- Spaces does change here --//
      ];
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[
            renderableSeries2.dataSeriesProperty.dataSeriesNameProperty
          ],
        };
        seriesObjectUndergoingUpdate.strokeDashArray[1] = event.target.value; //-- Spaces --//
        return {
          ...prevState,
          [renderableSeries2.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    }
  };
  //-- Series 2 Opacity --//
  const renderableSeries2OpacityHandler = (event) => {
    renderableSeries2.opacity = event.target.value;
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries2.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      //-- (2) update property --//
      seriesObjectUndergoingUpdate.opacity = event.target.value;
      //-- (3) Spread in previous state then overwrite just the nested object with the updated property --//
      return {
        ...prevState,
        [renderableSeries2.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
  };

  //-- Series 3 --//
  //-- Series 3 isVisible --//
  const renderableSeries3IsVisibleHandler = () => {
    renderableSeries3.isVisible = !renderableSeries3.isVisible;
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries3.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      seriesObjectUndergoingUpdate.isVisible = renderableSeries3.isVisible;
      return {
        ...prevState,
        [renderableSeries3.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
  };
  //-- Series 3 Stroke Color --//
  const renderableSeries3StrokeColorHandler = (event) => {
    renderableSeries3.stroke = event.hex;
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries3.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      seriesObjectUndergoingUpdate.stroke = event.hex;
      return {
        ...prevState,
        [renderableSeries3.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
  };
  //-- Series 3 Stroke Thickness --//
  const renderableSeries3StrokeThicknessHandler = (event) => {
    renderableSeries3.strokeThickness = event.target.value;
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries3.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      seriesObjectUndergoingUpdate.strokeThickness = event.target.value;
      return {
        ...prevState,
        [renderableSeries3.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
  };
  //-- Series 3 Stroke Dash Array: [Dashes, Spaces] --//
  const renderableSeries3DashArrayDashesHandler = (event) => {
    //-- If no dash array, set both dashes and spaces to incoming value --//
    if (!renderableSeries3.strokeDashArray) {
      renderableSeries3.strokeDashArray = [
        event.target.value,
        event.target.value,
      ];
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[
            renderableSeries3.dataSeriesProperty.dataSeriesNameProperty
          ],
        };
        seriesObjectUndergoingUpdate.strokeDashArray[0] = event.target.value; //-- Dashes --//
        seriesObjectUndergoingUpdate.strokeDashArray[1] = event.target.value; //-- Spaces --//
        return {
          ...prevState,
          [renderableSeries3.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    } else {
      renderableSeries3.strokeDashArray = [
        event.target.value, //-- Dashes does change here --//
        renderableSeries3.strokeDashArray[1], //-- Spaces doesn't change here --//
      ];
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[
            renderableSeries3.dataSeriesProperty.dataSeriesNameProperty
          ],
        };
        seriesObjectUndergoingUpdate.strokeDashArray[0] = event.target.value; //-- Dashes --//
        return {
          ...prevState,
          [renderableSeries3.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    }
  };
  const renderableSeries3DashArraySpacesHandler = (event) => {
    //-- If no dash array, set both dashes and spaces to incoming value --//
    if (!renderableSeries3.strokeDashArray) {
      renderableSeries3.strokeDashArray = [
        event.target.value,
        event.target.value,
      ];
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[
            renderableSeries3.dataSeriesProperty.dataSeriesNameProperty
          ],
        };
        seriesObjectUndergoingUpdate.strokeDashArray[0] = event.target.value; //-- Dashes --//
        seriesObjectUndergoingUpdate.strokeDashArray[1] = event.target.value; //-- Spaces --//
        return {
          ...prevState,
          [renderableSeries3.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    } else {
      renderableSeries3.strokeDashArray = [
        renderableSeries3.strokeDashArray[0], //-- Dashes doesn't change here --//
        event.target.value, //-- Spaces does change here --//
      ];
      setDataTheme((prevState) => {
        const seriesObjectUndergoingUpdate = {
          ...prevState[
            renderableSeries3.dataSeriesProperty.dataSeriesNameProperty
          ],
        };
        seriesObjectUndergoingUpdate.strokeDashArray[1] = event.target.value; //-- Spaces --//
        return {
          ...prevState,
          [renderableSeries3.dataSeriesProperty.dataSeriesNameProperty]:
            seriesObjectUndergoingUpdate,
        };
      });
    }
  };
  //-- Series 3 Opacity --//
  const renderableSeries3OpacityHandler = (event) => {
    renderableSeries3.opacity = event.target.value;
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries3.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      seriesObjectUndergoingUpdate.opacity = event.target.value;
      return {
        ...prevState,
        [renderableSeries3.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
  };

  //-- Unique to Series 3 - ColumnSeries for MACD --//
  //-- Series 3 Column Fill Above 0 (ColumnSeries) --//
  const renderableSeries3ColumnFillAbove0Handler = (event) => {
    UpdateSuspender.using(chart4Surface, () => {
      UpdateSuspender.using(chart3Surface, () => {
        renderableSeries3.paletteProvider.above0ColorRGBA =
          parseColorToUIntArgb(event.hex);
      });
    });
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries3.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      seriesObjectUndergoingUpdate.above0 = event.hex;
      return {
        ...prevState,
        [renderableSeries3.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
  };
  //-- Series 3 Column Fill Below 0(ColumnSeries) --//
  const renderableSeries3ColumnFillBelow0Handler = (event) => {
    UpdateSuspender.using(chart4Surface, () => {
      UpdateSuspender.using(chart3Surface, () => {
        renderableSeries3.paletteProvider.below0ColorRGBA =
          parseColorToUIntArgb(event.hex);
      });
    });
    setDataTheme((prevState) => {
      const seriesObjectUndergoingUpdate = {
        ...prevState[
          renderableSeries3.dataSeriesProperty.dataSeriesNameProperty
        ],
      };
      seriesObjectUndergoingUpdate.below0 = event.hex;
      return {
        ...prevState,
        [renderableSeries3.dataSeriesProperty.dataSeriesNameProperty]:
          seriesObjectUndergoingUpdate,
      };
    });
  };

  //-- Properties Selectable Values --//
  //-- **************************** --//
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

  //-- Series 1 Menu Items --//
  const Series1IsVisible = () => {
    return (
      <Tooltip
        title={renderableSeries1?.isVisible ? "Hide series" : "Show series"}
        placement="top-end"
        arrow
      >
        <Button
          onClick={renderableSeries1IsVisibleHandler}
          sx={{ marginBottom: "12px" }}
          variant="contained"
          color="primary"
        >
          {renderableSeries1?.isVisible ? (
            <VisibilityOffSharpIcon />
          ) : (
            <VisibilitySharpIcon />
          )}
        </Button>
      </Tooltip>
    );
  };
  const Series1StrokeThickness = () => {
    return (
      <Box>
        <Typography>Stroke Thickness</Typography>
        <Slider
          value={renderableSeries1?.strokeThickness}
          valueLabelDisplay="auto"
          step={1}
          min={0}
          max={16}
          marks={marks1to16}
          onChange={renderableSeries1StrokeThicknessHandler}
        />
      </Box>
    );
  };
  const Series1DashArray = () => {
    return (
      <Fragment>
        <Box>
          <Typography>Dashes</Typography>
          <Slider
            value={renderableSeries1?.strokeDashArrayProperty?.[0] || 0}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={16}
            marks={marks1to16}
            onChange={renderableSeries1DashArrayDashesHandler}
          />
        </Box>
        <Box>
          <Typography>Spaces</Typography>
          <Slider
            value={renderableSeries1?.strokeDashArrayProperty?.[1] || 0}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={16}
            marks={marks1to16}
            onChange={renderableSeries1DashArraySpacesHandler}
          />
        </Box>
      </Fragment>
    );
  };
  const Series1Opacity = () => {
    return (
      <Box>
        <Typography>Opacity</Typography>
        <Slider
          valueLabelDisplay="auto"
          value={renderableSeries1?.opacity}
          step={0.1}
          min={0}
          max={1}
          marks={marks0to1}
          onChange={renderableSeries1OpacityHandler}
        />
      </Box>
    );
  };
  const Series1StrokeColor = () => {
    return (
      <Fragment>
        <Typography>Stroke Color</Typography>
        <SketchPicker
          color={renderableSeries1?.strokeProperty}
          onChangeComplete={renderableSeries1StrokeColorHandler}
          disableAlpha
          width={250}
          presetColors={PRESET_COLORS}
        />
      </Fragment>
    );
  };
  const Series1OHLC = () => {
    return (
      <Box sx={OHLC_2x2_COLOR_SELECTOR_SX}>
        {/* Brush Up */}
        <Box sx={OHLC_2x2_COLOR_SELECTOR_UP_FILL_SX}>
          <Typography>
            <Emoji symbol="⬆️ 🟢 " label="up" />
            Up Fill
          </Typography>
          <SketchPicker
            color={renderableSeries1?.brushUpProperty}
            onChangeComplete={renderableSeries1BrushUpHandler}
            disableAlpha
            width={250}
            presetColors={PRESET_COLORS}
          />
        </Box>
        {/* Brush Down */}
        <Box sx={OHLC_2x2_COLOR_SELECTOR_DOWN_FILL_SX}>
          <Typography>
            <Emoji symbol="⬇️ 🔴 " label="down" />
            Down Fill
          </Typography>
          <SketchPicker
            color={renderableSeries1?.brushDownProperty}
            onChangeComplete={renderableSeries1BrushDownHandler}
            disableAlpha
            width={250}
            presetColors={PRESET_COLORS}
          />
        </Box>
        {/* Stroke Up */}
        <Box sx={OHLC_2x2_COLOR_SELECTOR_UP_BORDER_SX}>
          <Typography>
            <Emoji symbol="⬆️ 🟢 " label="up" />
            Up Border
          </Typography>
          <SketchPicker
            color={renderableSeries1?.strokeUpProperty}
            onChangeComplete={renderableSeries1StrokeUpHandler}
            disableAlpha
            width={250}
            presetColors={PRESET_COLORS}
          />
        </Box>
        {/* Stroke Down */}
        <Box sx={OHLC_2x2_COLOR_SELECTOR_DOWN_BORDER_SX}>
          <Typography>
            <Emoji symbol="⬇️ 🔴 " label="down" />
            Down Border
          </Typography>
          <SketchPicker
            color={renderableSeries1?.strokeDownProperty}
            onChangeComplete={renderableSeries1StrokeDownHandler}
            disableAlpha
            width={250}
            presetColors={PRESET_COLORS}
          />
        </Box>
      </Box>
    );
  };
  //-- Series 2 Menu Items --//
  const Series2IsVisible = () => {
    return (
      <Tooltip
        title={renderableSeries2?.isVisible ? "Hide series" : "Show series"}
        placement="top-end"
        arrow
      >
        <Button
          onClick={renderableSeries2IsVisibleHandler}
          sx={{ marginBottom: "12px" }}
          variant="contained"
          color="primary"
        >
          {renderableSeries2?.isVisible ? (
            <VisibilityOffSharpIcon />
          ) : (
            <VisibilitySharpIcon />
          )}
        </Button>
      </Tooltip>
    );
  };
  const Series2StrokeThickness = () => {
    return (
      <Box>
        <Typography>Stroke Thickness</Typography>
        <Slider
          value={renderableSeries2?.strokeThickness}
          valueLabelDisplay="auto"
          step={1}
          min={0}
          max={16}
          marks={marks1to16}
          onChange={renderableSeries2StrokeThicknessHandler}
        />
      </Box>
    );
  };
  const Series2DashArray = () => {
    return (
      <Fragment>
        <Box>
          <Typography>Dashes</Typography>
          <Slider
            value={renderableSeries2?.strokeDashArrayProperty?.[0] || 0}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={16}
            marks={marks1to16}
            onChange={renderableSeries2DashArrayDashesHandler}
          />
        </Box>
        <Box>
          <Typography>Spaces</Typography>
          <Slider
            value={renderableSeries2?.strokeDashArrayProperty?.[1] || 0}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={16}
            marks={marks1to16}
            onChange={renderableSeries2DashArraySpacesHandler}
          />
        </Box>
      </Fragment>
    );
  };
  const Series2Opacity = () => {
    return (
      <Box>
        <Typography>Opacity</Typography>
        <Slider
          value={renderableSeries2?.opacity}
          valueLabelDisplay="auto"
          step={0.1}
          min={0}
          max={1}
          marks={marks0to1}
          onChange={renderableSeries2OpacityHandler}
        />
      </Box>
    );
  };
  const Series2StrokeColor = () => {
    return (
      <Fragment>
        <Typography>Stroke Color</Typography>
        <SketchPicker
          color={renderableSeries2?.strokeProperty}
          onChangeComplete={renderableSeries2StrokeColorHandler}
          disableAlpha
          width={250}
          presetColors={PRESET_COLORS}
        />
      </Fragment>
    );
  };
  //-- Series 3 Menu Items --//
  const Series3IsVisible = () => {
    return (
      <Tooltip
        title={renderableSeries3?.isVisible ? "Hide series" : "Show series"}
        placement="top-end"
        arrow
      >
        <Button
          onClick={renderableSeries3IsVisibleHandler}
          sx={{ marginBottom: "12px" }}
          variant="contained"
          color="primary"
        >
          {renderableSeries3?.isVisible ? (
            <VisibilityOffSharpIcon />
          ) : (
            <VisibilitySharpIcon />
          )}
        </Button>
      </Tooltip>
    );
  };
  const Series3StrokeThickness = () => {
    return (
      <Box>
        <Typography>Stroke Thickness</Typography>
        <Slider
          value={renderableSeries3?.strokeThickness}
          valueLabelDisplay="auto"
          step={1}
          min={0}
          max={16}
          marks={marks1to16}
          onChange={renderableSeries3StrokeThicknessHandler}
        />
      </Box>
    );
  };
  const Series3DashArray = () => {
    return (
      <Fragment>
        <Box>
          <Typography>Dashes</Typography>
          <Slider
            value={renderableSeries3?.strokeDashArrayProperty?.[0] || 0}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={16}
            marks={marks1to16}
            onChange={renderableSeries3DashArrayDashesHandler}
          />
        </Box>
        <Box>
          <Typography>Spaces</Typography>
          <Slider
            value={renderableSeries3?.strokeDashArrayProperty?.[1] || 0}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={16}
            marks={marks1to16}
            onChange={renderableSeries3DashArraySpacesHandler}
          />
        </Box>
      </Fragment>
    );
  };
  const Series3Opacity = () => {
    return (
      <Box>
        <Typography>Opacity</Typography>
        <Slider
          value={renderableSeries3?.opacity}
          valueLabelDisplay="auto"
          step={0.1}
          min={0}
          max={1}
          marks={marks0to1}
          onChange={renderableSeries3OpacityHandler}
        />
      </Box>
    );
  };
  const Series3StrokeColor = () => {
    return (
      <Fragment>
        <Typography>Stroke Color</Typography>
        <SketchPicker
          color={renderableSeries3?.strokeProperty}
          onChangeComplete={renderableSeries3StrokeColorHandler}
          disableAlpha
          width={250}
          presetColors={PRESET_COLORS}
        />
      </Fragment>
    );
  };
  const Series3MACDPaletteProvider = () => {
    return (
      <Fragment>
        {/* MACD series - edit palette provider (above 0) */}
        <Typography>Above 0</Typography>
        <SketchPicker
          color={renderableSeries3?.paletteProvider?.above0ColorRGBA}
          onChangeComplete={renderableSeries3ColumnFillAbove0Handler}
          disableAlpha
          width={250}
          presetColors={PRESET_COLORS}
        />
        {/* MACD series - edit palette provider (below 0) */}
        <Typography>Below 0</Typography>
        <SketchPicker
          color={renderableSeries3?.paletteProvider?.below0ColorRGBA}
          onChangeComplete={renderableSeries3ColumnFillBelow0Handler}
          disableAlpha
          width={250}
          presetColors={PRESET_COLORS}
        />
      </Fragment>
    );
  };

  //-- Series 1 Menus --//
  const Series1OHLCMenu = () => {
    return (
      <Fragment>
        <Series1IsVisible />
        <Series1StrokeThickness />
        <Series1Opacity />
        <Series1OHLC />
      </Fragment>
    );
  };
  const Series1EMA12Menu = () => {
    return (
      <Fragment>
        <Series1IsVisible />
        <Series1StrokeThickness />
        <Series1DashArray />
        <Series1Opacity />
        <Series1StrokeColor />
      </Fragment>
    );
  };
  const Series1ABANDSLowerMenu = () => {
    return (
      <Fragment>
        <Typography>ABANDS Lower</Typography>
        <Series1IsVisible />
        <Series1StrokeThickness />
        <Series1DashArray />
        <Series1Opacity />
        <Series1StrokeColor />
      </Fragment>
    );
  };
  const Series1MACDMACDMenu = () => {
    return (
      <Fragment>
        <Typography>MACD Line</Typography>
        <Series1IsVisible />
        <Series1StrokeThickness />
        <Series1DashArray />
        <Series1Opacity />
        <Series1StrokeColor />
      </Fragment>
    );
  };
  const Series1RSIMenu = () => {
    return (
      <Fragment>
        <Series1IsVisible />
        <Series1StrokeThickness />
        <Series1DashArray />
        <Series1Opacity />
        <Series1StrokeColor />
      </Fragment>
    );
  };
  //-- Series 2 Menus --//
  const Series2ABANDSMiddleMenu = () => {
    return (
      <Fragment>
        <Typography>ABANDS Middle</Typography>
        <Series2IsVisible />
        <Series2StrokeThickness />
        <Series2DashArray />
        <Series2Opacity />
        <Series2StrokeColor />
      </Fragment>
    );
  };
  const Series2MACDSignalMenu = () => {
    return (
      <Fragment>
        <Typography>MACD Signal Line</Typography>
        <Series2IsVisible />
        <Series2StrokeThickness />
        <Series2DashArray />
        <Series2Opacity />
        <Series2StrokeColor />
      </Fragment>
    );
  };
  //-- Series 3 Menus --//
  const Series3ABANDSUpperMenu = () => {
    return (
      <Fragment>
        <Typography>ABANDS Upper</Typography>
        <Series3IsVisible />
        <Series3StrokeThickness />
        <Series3DashArray />
        <Series3Opacity />
        <Series3StrokeColor />
      </Fragment>
    );
  };
  const Series3MACDHistogramMenu = () => {
    return (
      <Fragment>
        <Typography>MACD Histogram</Typography>
        <Series3IsVisible />
        <Series3StrokeThickness />
        <Series3MACDPaletteProvider />
      </Fragment>
    );
  };

  //-- Menu Cases --//
  //-- ********** --//
  let Series1Menu = () => {}; // seems like hacky way to initialize function
  if (series1Name) {
    switch (series1Name) {
      case "ohlcSeriesChart1":
        Series1Menu = Series1OHLCMenu;
        break;
      case "ema12SeriesChart1":
        Series1Menu = Series1EMA12Menu;
        break;
      case "abandsLowerSeriesChart1":
        Series1Menu = Series1ABANDSLowerMenu;
        break;
      case "macdMACDSeriesChart3":
        Series1Menu = Series1MACDMACDMenu;
        break;
      case "macdMACDSeriesChart4":
        Series1Menu = Series1MACDMACDMenu;
        break;
      case "rsiSeriesChart3":
        Series1Menu = Series1RSIMenu;
        break;
      case "rsiSeriesChart4":
        Series1Menu = Series1RSIMenu;
        break;
      default:
        console.log("Unexpected series1Name");
        break;
    }
  }
  let Series2Menu = () => {}; // seems like hacky way to initialize function
  if (series2Name) {
    switch (series2Name) {
      case "abandsMiddleSeriesChart1":
        Series2Menu = Series2ABANDSMiddleMenu;
        break;
      case "macdSignalSeriesChart3":
        Series2Menu = Series2MACDSignalMenu;
        break;
      case "macdSignalSeriesChart4":
        Series2Menu = Series2MACDSignalMenu;
        break;
      default:
        console.log("Unexpected series2Name");
        break;
    }
  }
  let Series3Menu = () => {}; // seems like hacky way to initialize function
  if (series3Name) {
    switch (series3Name) {
      case "abandsUpperSeriesChart1":
        Series3Menu = Series3ABANDSUpperMenu;
        break;
      case "macdHistogramSeriesChart3":
        Series3Menu = Series3MACDHistogramMenu;
        break;
      case "macdHistogramSeriesChart4":
        Series3Menu = Series3MACDHistogramMenu;
        break;
      default:
        console.log("Unexpected series3Name");
        break;
    }
  }

  //-- Function Return --//
  //-- *************** --//
  return (
    <Dialog
      open={dataThemeMenuIsOpen}
      onClose={dataThemeMenuCloseHandler}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      maxWidth="lg"
      // sx={{ opacity: 0.95 }}
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        Properties - {label}
      </DialogTitle>
      <DialogContent>
        <Box sx={ALL_SERIES_BOX_SX}>
          {/* Series 1 Properties */}
          <Box sx={SINGLE_SERIES_BOX_SX}>
            <Series1Menu />
          </Box>
          {/* Series 2 Properties */}
          {renderableSeries2 && (
            <Box sx={SINGLE_SERIES_BOX_SX}>
              <Series2Menu />
            </Box>
          )}
          {/* Series 3 Properties */}
          {renderableSeries3 && (
            <Box sx={SINGLE_SERIES_BOX_SX}>
              <Series3Menu />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={dataThemeMenuCloseHandler}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
