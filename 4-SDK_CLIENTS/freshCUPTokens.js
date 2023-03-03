//-- React --//

//-- AWS SDK --//
import { freshIDToken_CognitoUserPoolsClient } from "./CognitoUserPools";
import { freshIDToken_DynamoDBClient } from "./DynamoDBClient";
import { freshIDToken_S3Client } from "./S3Client";

//-- CHRT Components --//

//-- npm Package Functions --//
import { add, getUnixTime } from "date-fns";
import { refresh } from "franken-srp";
import jwtDecode from "jwt-decode";

//-- npm Package Components --//

export default async function freshCUPTokens() {
  //-- Get tokens and such from localStorage --//
  const cognito_sub =
    localStorage.getItem("chrt-currentUser-cognito_sub") || "";

  let idToken = localStorage.getItem(`chrt-${cognito_sub}-idToken`) || "";
  const idTokenExpiration =
    localStorage.getItem(`chrt-${cognito_sub}-idTokenExpiration`) || 1;

  let accessToken =
    localStorage.getItem(`chrt-${cognito_sub}-accessToken`) || "";

  const refreshToken =
    localStorage.getItem(`chrt-${cognito_sub}-refreshToken`) || "";
  const refreshTokenExpiration =
    localStorage.getItem(`chrt-${cognito_sub}-refreshTokenExpiration`) || 0;

  const key = localStorage.getItem(`chrt-${cognito_sub}-key`) || "";

  //-- Get timestamp (a) 1 day in the future, (b) 10 minutes in the future --//
  const now_plus_1_day_timestamp = getUnixTime(add(Date.now(), { days: 1 }));
  const now_plus_10_min_timestamp = getUnixTime(
    add(Date.now(), { minutes: 10 })
  );

  //-- ************************ --//
  //-- Keep refresh token fresh --//
  if (refreshTokenExpiration) {
    if (!(refreshTokenExpiration > now_plus_1_day_timestamp)) {
      //-- If refresh token already expired, Sign Out --//
      const now_timestamp = getUnixTime(Date.now());
      if (!(refreshTokenExpiration > now_timestamp)) {
        alert(
          "42-day Sign In session for this device is expired. CHRT will now Sign Out. To begin a new 42-day session, Sign In again."
        );
        //-- Sign out by navigating to /signout --//
        window.location.assign(process.env.REACT_APP_HOMEPAGE_URL + "/signout");
      }
    }
  }

  //-- ****************** --//
  //-- Keep idToken fresh --//
  //-- If idToken expiration < 10 minutes in the future, exchange refresh token for new idToken --//
  if (idToken) {
    if (!(idTokenExpiration > now_plus_10_min_timestamp)) {
      //-- franken-srp refresh --//
      try {
        let res = await refresh({
          region: "us-east-1",
          userPoolId: "us-east-1_nGMFSXaES",
          clientId: "7j7co4p1u35vbf31ahl09ihfut",
          refreshToken: refreshToken,
          deviceKey: key,
        });

        //-- Save idToken, idTokenExpiration, and accessToken to localStorage --//
        localStorage.setItem(`chrt-${cognito_sub}-idToken`, res.idToken);
        const idTokenDecoded = jwtDecode(res.idToken);
        localStorage.setItem(
          `chrt-${cognito_sub}-idTokenExpiration`,
          idTokenDecoded.exp
        );
        localStorage.setItem(
          `chrt-${cognito_sub}-accessToken`,
          res.accessToken
        );

        //-- Set new values of idToken and accessToken to return  --//
        idToken = localStorage.getItem(`chrt-${cognito_sub}-idToken`) || "";
        accessToken =
          localStorage.getItem(`chrt-${cognito_sub}-accessToken`) || "";

        //-- Set new idToken parameter in SDK Clients credentials --//
        freshIDToken_CognitoUserPoolsClient(idToken);
        freshIDToken_DynamoDBClient(idToken);
        freshIDToken_S3Client(idToken);
        //----//
      } catch (err) {
        console.log(err); // Keep??
        alert(
          "Current Sign In session experienced an error - please Sign Out and Sign In again. If needed, reach out to support@chrt.com [" +
            err +
            "]"
        );
      }
    }
  }

  return {
    cognito_sub,
    idToken,
    accessToken,
    refreshToken,
    key,
  };
}

// If current solution starts failing:

// SDK Credentials and fresh CUP Tokens file:
// // initialize SDKs using idToken from localstorage
// // // export SDK clients

// // upon refresh of idToken, update idToken parameter in logins section of SDk credentials
// // // before each SDK call, call freshCUPTokens() which gets fresh cup tokens and sets them as the SDK credentials params

// import { freshCUPTokens, CognitoUserPoolsClient } from "../../../SDK_CLIENTS/freshCUPTokensAndSDKClients";
// await { idToken, accessToken } = freshCUPTokens()
// await CognitoUserPoolsClient.send({ new SomeCommand({}) })
