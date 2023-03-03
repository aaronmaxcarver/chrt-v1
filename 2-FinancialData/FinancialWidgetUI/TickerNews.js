//-- React --//

//-- AWS SDK --//
import freshCUPTokens from "../../SDK_CLIENTS/freshCUPTokens";

//-- CHRT Components --//
import TickerNewsStory from "../components/Polygon/TickerNewsStory";
import Dog404 from "../../404/Dog404";

//-- npm Package Functions --//
import { useParams } from "react-router-dom";
import axios from "axios";
import useSWR from "swr";

//-- npm Package Components --//
import Card from "@mui/material/Card";
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

//-- Ticker News Widget --//
export default function TickerNews() {
  let { dataEntity } = useParams();
  dataEntity = dataEntity.toUpperCase();

  const { data: TICKER_NEWS, error: TICKER_NEWS_error } = useSWR(
    `https://polygonStocksAPI.chrt.com/v2/reference/news?ticker=${dataEntity}`,
    axiosFetcher
  );

  if (TICKER_NEWS_error) return <Dog404 />; // to improve error handling...
  if (!TICKER_NEWS)
    return (
      <Skeleton
        variant="rectangular"
        width={"100%"} // DEV - effective??
        height={"100%"} // DEV - effective??
        sx={{ backgroundColor: grey[700] }}
      />
    );

  return (
    <Card sx={{ height: "100%" }}>
      {TICKER_NEWS.results.map((story) => (
        <TickerNewsStory key={story.id} story={story} />
      ))}
    </Card>
  );
}
