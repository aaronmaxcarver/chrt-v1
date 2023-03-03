//-- React --//

//-- AWS SDK --//

//-- CHRT Components --//

//-- npm Package Functions --//
import { useSearchParams, useNavigate } from "react-router-dom";
import qs from "qs";
import axios from "axios";
import { add, getUnixTime } from "date-fns";
import jwtDecode from "jwt-decode";

//-- npm Package Components --//

//-- SX --//

//-- This component used when: chrt.com/callback receives auth_code --//
export default function AWS_SDK_V3_CUP_TOKENS() {
  //-- Navigate function --//
  let navigate = useNavigate();

  //-- Parse Auth Code from search/query params --//
  let [searchParams, setSearchParams] = useSearchParams();
  let AUTH_CODE = searchParams.get("code");

  console.log(searchParams); // DEV

  //-- authorization_code Axios POST request to Token endpoint --//
  let data = qs.stringify({
    grant_type: "authorization_code",
    client_id: "7j7co4p1u35vbf31ahl09ihfut",
    code: `${AUTH_CODE}`,
    redirect_uri: "https://chrt.com/callback",
  });

  let requestConfig = {
    method: "post",
    url: "https://auth.chrt.com/oauth2/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  let getTokens = async () => {
    try {
      let res = await axios(requestConfig);

      console.log(res.data); // DEV

      //-- Store tokens in LocalStorage --//
      localStorage.setItem("idToken", res.data.id_token);
      localStorage.setItem("accessToken", res.data.access_token);
      localStorage.setItem("refreshToken", res.data.refresh_token);

      //-- Store Cognito 'sub' attribute for use with DynamoDB tables --//
      const id_token_decoded = jwtDecode(res.data.id_token);
      const cognito_sub = id_token_decoded.sub;
      localStorage.setItem("cognito_sub", cognito_sub);

      //-- Set refresh_token expiration in LocalStorage --//
      const refresh_token_expiration = getUnixTime(
        add(Date.now(), { days: 41, hours: 23, minutes: 59 })
      );
      localStorage.setItem(
        "REFRESH_TOKEN_EXPIRATION",
        refresh_token_expiration
      );

      //-- Navigate to "/" --//
      navigate("/");
      //----//
    } catch (err) {
      console.log(err);
      alert(
        "Error - please Sign In again. If problem persists, reach out for support."
      );
    }
  };
  getTokens();

  return null;
}
