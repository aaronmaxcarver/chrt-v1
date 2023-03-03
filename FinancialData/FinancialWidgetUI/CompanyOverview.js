//-- React --//
import { useState } from "react";

//-- AWS SDK --//
import freshCUPTokens from "../../SDK_CLIENTS/freshCUPTokens";

//-- CHRT Components --//
import Dog404 from "../../404/Dog404";

//-- npm Package Functions --//
import axios from "axios";

//-- npm Package Components --//
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import { useEffect } from "react";

//-- SX --//

//-- Company Overview Widget --//
export default function CompanyOverview(props) {
  let { dataEntity } = props;

  let iconURLPathParameters;
  let blobObjectURL;
  const [referenceData, setReferenceData] = useState();
  const [iconBlobObjectURL, setIconBlobObjectURL] = useState();

  //-- (1) Reference Data --//
  //-- ****************** --//
  const getReferenceData = async () => {
    let { idToken } = await freshCUPTokens();

    try {
      //-- GET request params --//
      let url = `https://polygonStocksAPI.chrt.com/v3/reference/tickers/${dataEntity}`;
      let headersObject = {
        authorization: `${idToken}`,
      };

      //-- GET request --//
      let referenceDataResponse = await axios.get(url, {
        headers: headersObject,
      });

      //-- GET request results --//
      setReferenceData(referenceDataResponse.data.results);

      let icon_url = referenceDataResponse.data.results.branding.icon_url; //-- use regex to get just the path params --//
      let pathParamsRegEx = new RegExp("^https?://[A-Za-z0-9:.]*([/].*/?)$");
      let matches = pathParamsRegEx.exec(icon_url);
      iconURLPathParameters = matches[1];
    } catch (err) {
      //-- refernce data block error --//
      console.log(err);
    }

    //-- (2) Icon --//
    //-- ******** --//
    try {
      //-- GET request params --//
      let url = `https://polygonStocksAPI.chrt.com${iconURLPathParameters}`;
      let headersObject = {
        authorization: `${idToken}`,
      };

      //-- Get request --//
      fetch(url, {
        headers: headersObject,
      })
        //-- GET request results --//
        .then((res) => res.blob())
        .then((blob) => setIconBlobObjectURL(URL.createObjectURL(blob)));
    } catch (err) {
      //-- icon block error --//
      console.log(err);
    }
  };

  //-- Use side effect to fetch data --//
  useEffect(() => {
    getReferenceData();

    // is this good??
    return () => {
      URL.revokeObjectURL(blobObjectURL);
    };
  }, [dataEntity]);

  return (
    <Card sx={{ height: "100%" }}>
      {/* Company Ticker */}
      <Typography>{referenceData?.ticker}</Typography>

      {/* Company Name */}
      <Typography>{referenceData?.name}</Typography>

      {/* Company Icon */}
      {iconBlobObjectURL ? (
        <img
          src={iconBlobObjectURL}
          alt="company icon"
          width="100px"
          height="100px"
        />
      ) : (
        <Skeleton
          variant="rectangular"
          height={100}
          width={100}
          animation={false}
          sx={{ backgroundColor: grey[700] }} // DEV - make good
        />
      )}

      {/* Company Description */}
      <Typography>{referenceData?.description}</Typography>
    </Card>
  );
}

// <Skeleton
// animation="none"
// variant="rectangular"
// width={"100%"} // DEV - does 100% work well??
// height={"100%"} // DEV - infer somehow??
// sx={{ backgroundColor: grey[700] }} // DEV - make good
// />
