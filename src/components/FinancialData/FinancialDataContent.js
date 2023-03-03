//-- React --//
import { Fragment } from "react";

//-- AWS SDK --//

//-- CHRT Components --//
import ChartUI from "./components/SciChart/ChartUI/ChartUI";
import FinancialWidgetUI from "./FinancialWidgetUI/FinancialWidgetUI.js";

//-- npm Package Functions --//

//-- npm Package Components --//
import Box from "@mui/material/Box";

//-- SX --//

export default function FinancialDataContent() {
  return (
    <Fragment>
      {/* ChartUI */}
      <Box>
        <ChartUI />
      </Box>

      {/* Below ChartUI */}
      <FinancialWidgetUI />
    </Fragment>
  );
}
