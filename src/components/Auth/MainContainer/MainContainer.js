//-- React --//

//-- AWS SDK --//

//-- CHRT Components --//

//-- npm Package Functions --//

//-- npm Package Components --//
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import { grey } from "@mui/material/colors";

//-- localStorage --//

//-- SX --//
const GRID_SX = {
  display: "grid",
  height: "100%",
  width: "100%",
  gridTemplateRows: "auto 1fr",
  gridTemplateColumns: "1fr 350px 1fr",
  gridTemplateAreas: `"leftMargin content rightMargin"
                      "leftMargin bottomMargin rightMargin"`,
};
const CONTAINER_SX = {
  gridArea: "content",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  backgroundColor: grey[200],
  marginTop: 2,
};
const CONTENT_SX = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  margin: 1,
};

export default function MainContainer(props) {
  let { children } = props;

  return (
    <Box sx={GRID_SX}>
      <Paper sx={CONTAINER_SX} elevation={8}>
        <Box sx={CONTENT_SX}>{children}</Box>
      </Paper>
    </Box>
  );
}
