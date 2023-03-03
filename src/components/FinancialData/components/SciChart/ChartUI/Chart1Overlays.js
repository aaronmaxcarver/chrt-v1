import { useState, Fragment } from "react";

import { format } from "date-fns";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import VisibilitySharpOffIcon from "@mui/icons-material/VisibilityOffSharp";
import VisibilitySharpIcon from "@mui/icons-material/VisibilitySharp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const CHART_1_OVERLAYS_SX = {
  pointerEvents: "none", //-- Override this with `pointerEvents: "auto"` for elements that need to be clickable --//
  gridRowStart: 2,
  gridRowEnd: 3,
  gridColumnStart: 1,
  gridColumnEnd: 4,
  display: "grid",
  gridTemplateRows: "100%",
  gridTemplateColumns: "100px auto",
  gridTemplateAreas: `"legend overlays"`,
  zIndex: 1002,
  marginRight: "12px",
  marginTop: "3px",
  gap: "3px",
};

const LEGEND_FLEXBOX_SX = {
  gridArea: "legend",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  marginLeft: "6px",
  gap: "3px",
};

const NOT_LEGEND_FLEXBOX_SX = {
  gridArea: "overlays",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  marginLeft: "6px",
  gap: "3px",
};

const TodaysDate = (order) => {
  return (
    <Box sx={{ order: order }}>
      <Paper
        elevation={1}
        sx={{
          pointerEvents: "auto",
          backgroundColor: "#777",
          color: "black",
          width: "150px",
          height: "24px",
          textAlign: "center",
          opacity: 0.8,
        }}
      >
        <Typography>{format(Date.now(), "yyyy-MM-dd")}</Typography>
      </Paper>
    </Box>
  );
};

const LowestVisiblePrice = (order) => {
  return (
    <Box sx={{ order: order }}>
      <Paper
        elevation={1}
        sx={{
          pointerEvents: "auto",
          backgroundColor: "#777",
          color: "black",
          width: "150px",
          height: "24px",
          textAlign: "center",
          opacity: 0.8,
        }}
      >
        <Typography>VisLow - $xxx.xx</Typography>
      </Paper>
    </Box>
  );
};

const HighestVisiblePrice = (order) => {
  return (
    <Box sx={{ order: order }}>
      <Paper
        elevation={1}
        sx={{
          pointerEvents: "auto",
          backgroundColor: "#777",
          color: "black",
          width: "150px",
          height: "24px",
          textAlign: "center",
          opacity: 0.8,
        }}
      >
        <Typography>VisHigh - $xxx.xx</Typography>
      </Paper>
    </Box>
  );
};

export default function Chart1Overlays(props) {
  let {
    dataTheme,
    chart1Indicators,
    chart1IndicatorsSelected,
    seriesPropertiesMenuOpenHandler,
  } = props;

  const [overlays, setOverlays] = useState({
    TodaysDate: { visible: true, order: 1 },
    LowestVisiblePrice: { visible: true, order: 2 },
    HighestVisiblePrice: { visible: true, order: 3 },
  });

  const [legendVisible, setLegendVisible] = useState(true);

  return (
    <Fragment>
      <Box sx={CHART_1_OVERLAYS_SX}>
        <Box sx={LEGEND_FLEXBOX_SX}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              pointerEvents: "auto",
              width: "100px",
              opacity: 0.8,
              gap: "3px",
            }}
          >
            <Typography>Legend</Typography>
            {legendVisible ? (
              <Tooltip title="Hide Legend">
                <ExpandLessIcon
                  onClick={() => {
                    setLegendVisible((prevState) => !prevState);
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Show Legend">
                <ExpandMoreIcon
                  onClick={() => {
                    setLegendVisible((prevState) => !prevState);
                  }}
                />
              </Tooltip>
            )}
          </Card>

          {legendVisible &&
            chart1IndicatorsSelected.map((x) => (
              <Tooltip key={x} title={x + " settings"} placement={"right"}>
                <Card
                  key={x}
                  onClick={() => {
                    seriesPropertiesMenuOpenHandler(x);
                  }}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    pointerEvents: "auto",
                    width: "100px",
                    opacity: 0.8,
                    gap: "3px",
                  }}
                >
                  <Typography
                    sx={{
                      alignSelf: "flex-start",
                    }}
                  >
                    {x}
                  </Typography>

                  <Box
                    sx={{
                      width: "24px",
                      height: "24px",
                      backgroundColor: "#777",
                      alignSelf: "flex-end",
                    }}
                  />
                </Card>
              </Tooltip>
            ))}
        </Box>

        <Box sx={NOT_LEGEND_FLEXBOX_SX}>
          {/* //----// */}
          {overlays.TodaysDate.visible && (
            <TodaysDate order={overlays.TodaysDate.order} />
          )}

          {overlays.LowestVisiblePrice.visible && (
            <LowestVisiblePrice order={overlays.LowestVisiblePrice.order} />
          )}

          {overlays.HighestVisiblePrice.visible && (
            <HighestVisiblePrice order={overlays.HighestVisiblePrice.order} />
          )}
        </Box>
      </Box>
    </Fragment>
  );
}

// let series = chart1Indicators.filter(
//   (x) => x.label === renderableSeriesLabel
// );
