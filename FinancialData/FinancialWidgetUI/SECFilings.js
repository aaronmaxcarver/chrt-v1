//-- React --//

//-- AWS SDK --//
import freshCUPTokens from "../../SDK_CLIENTS/freshCUPTokens";

//-- CHRT Components --//
import StockFinancialsVXFiling from "../components/Polygon/StockFinancialsVXFiling";

import Dog404 from "../../404/Dog404";

//-- npm Package Functions --//
import { useParams } from "react-router-dom";
import axios from "axios";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";

//-- npm Package Components --//
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

import { grey } from "@mui/material/colors";

//-- SX --//

//-- Fetchers (used in SWR calls) --//
const axiosFetcher = async (url) => {
  let { idToken } = await freshCUPTokens();
  axios
    .get(url, {
      headers: {
        authorization: `${idToken}`,
      },
    })
    .then((res) => res.data);
};

export default function SECFilings() {
  let { dataEntity } = useParams();

  // to be done dynamically with date picker or date range picker
  // build easier way to find a specific quarterly / annual filing
  let filing_date_gte = "2020-01-01";
  let filing_date_lte = "2021-12-31";

  const { data: STOCK_FINANCIALS_VX, error: STOCK_FINANCIALS_VX_error } =
    useSWR(
      `https://polygonStocksAPI.chrt.com/vX/reference/financials?ticker=${dataEntity}&filing_date.gte=${filing_date_gte}&filing_date.lte=${filing_date_lte}&order=desc&sort=period_of_report_date`,
      axiosFetcher
    );

  if (STOCK_FINANCIALS_VX_error) return <Dog404 />;
  if (!STOCK_FINANCIALS_VX)
    return (
      <Skeleton
        variant="rectangular"
        width={"100%"} // DEV - does 100% work well??
        height={"100%"} // DEV - does 100% work well??
        sx={{ backgroundColor: grey[700] }}
      />
    );

  return (
    <Card sx={{ height: "100%" }}>
      <Typography>Filing Search Start Date: {filing_date_gte}</Typography>
      <Typography>Filing Search End Date: {filing_date_lte}</Typography>

      {STOCK_FINANCIALS_VX.results.map((filing) => (
        <StockFinancialsVXFiling key={uuidv4()} filing={filing} />
      ))}
    </Card>
  );
}
