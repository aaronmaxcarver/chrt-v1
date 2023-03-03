import { useState, Fragment } from "react";

import { format } from "date-fns";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import VisibilitySharpOffIcon from "@mui/icons-material/VisibilityOffSharp";
import VisibilitySharpIcon from "@mui/icons-material/VisibilitySharp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const CHART_4_OVERLAYS_SX = {
  pointerEvents: "none", //-- Override this with `pointerEvents: "auto"` for elements that need to be clickable --//
  gridRowStart: 5,
  gridRowEnd: 6,
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

// const TodaysDate = (order) => {
//   return (
//     <Box sx={{ order: order }}>
//       <Paper
//         elevation={1}
//         sx={{
//           pointerEvents: "auto",
//           backgroundColor: "#777",
//           color: "black",
//           width: "150px",
//           height: "24px",
//           textAlign: "center",
//           opacity: 0.8,
//         }}
//       >
//         <Typography>{format(Date.now(), "yyyy-MM-dd")}</Typography>
//       </Paper>
//     </Box>
//   );
// };

export default function Chart1Overlays(props) {
  let { dataTheme, chart4IndicatorValue, seriesPropertiesMenuOpenHandler } =
    props;

  // const [overlays, setOverlays] = useState({
  //   TodaysDate: { visible: true, order: 1 },
  // });

  const [legendVisible, setLegendVisible] = useState(true);

  return (
    <Fragment>
      <Box sx={CHART_4_OVERLAYS_SX}>
        <Box sx={LEGEND_FLEXBOX_SX}>
          {chart4IndicatorValue && (
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
          )}

          {chart4IndicatorValue && legendVisible && (
            <Tooltip
              title={chart4IndicatorValue + " settings"}
              placement={"right"}
            >
              <Card
                onClick={() => {
                  seriesPropertiesMenuOpenHandler(
                    "chart4",
                    chart4IndicatorValue
                  );
                }}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  // justifyContent: "flex-start",
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
                  {chart4IndicatorValue}
                </Typography>

                {/* <Box
                  sx={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "#777",
                    alignSelf: "flex-end",
                  }}
                /> */}
              </Card>
            </Tooltip>
          )}
        </Box>

        <Box sx={NOT_LEGEND_FLEXBOX_SX}>
          {/* {overlays.TodaysDate.visible && (
              <TodaysDate order={overlays.TodaysDate.order} />
            )} */}
        </Box>
      </Box>
    </Fragment>
  );
}
