//-- React --//
import { useState, useEffect, Fragment } from "react";

//-- AWS SDK --//

//-- CHRT Components --//
import CompanyOverview from "./CompanyOverview";

//-- npm Package Functions --//
import { useParams } from "react-router-dom";

//-- npm Package Components --//
import Box from "@mui/material/Box";

import { grey } from "@mui/material/colors";

import ReactGridLayout from "react-grid-layout";
import "../../../react-grid-layout.css";

//-- SX --//
const THEATER_MODE_GRID_SX = {
  display: "grid",
  background: grey[800],
  height: "100%",
  width: "100%",
  gridTemplateRows: "auto",
  gridTemplateColumns: "1fr minmax(600px, 1920px) 1fr",
  gridTemplateAreas: ` "leftMargin widgetUI rightMargin"`,
};
const WIDGET_UI_SX = {
  gridArea: "widgetUI",
};
const LEFT_MARGIN_SX = {
  gridArea: "leftMargin",
  background: grey[800],
};
const RIGHT_MARGIN_SX = {
  gridArea: "rightMargin",
  background: grey[800],
};

const layout = [
  {
    i: "a",
    x: 0,
    y: 0,
    w: 12,
    h: 12, // good??
    static: true,
  },
];

export default function FinancialWidgetUI() {
  //-- Set up windowWidth state and an event listener that updates windowWidth state--//
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleWindowWidthResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleWindowWidthResize);
    return () => {
      window.removeEventListener("resize", handleWindowWidthResize);
    };
  }, []);

  //-- Get the dataEntity value from URL path parameters --//
  let { dataEntity } = useParams();
  console.log("dataEntity: " + dataEntity);
  // TODO - uppercase of dataEntity?? or do when making request??

  return (
    <Fragment>
      <Box sx={THEATER_MODE_GRID_SX}>
        {/* Content */}
        <Box sx={WIDGET_UI_SX}>
          <ReactGridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={12} // what to put here??
            width={Math.min(windowWidth, 1920)} //-- 1920px = 1/2 the width of a 4k screen --//
          >
            <div key="a">
              <CompanyOverview dataEntity={dataEntity} />
            </div>

            {/* TODO - add TickerNews */}

            {/* TODO - add SECFilings */}
          </ReactGridLayout>
        </Box>

        {/* Left & Right Margins */}
        <Box sx={LEFT_MARGIN_SX} />
        <Box sx={RIGHT_MARGIN_SX} />
      </Box>
    </Fragment>
  );
}
