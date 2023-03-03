//-- React --//
import { useState, useEffect } from "react";

//-- npm Package Functions --//

//-- AWS SDK --//
import freshCUPTokens from "../../SDK_CLIENTS/freshCUPTokens";
import CognitoUserPools from "../../SDK_CLIENTS/CognitoUserPools";
import { GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

//-- CHRT Components --//
import SubscriptionSection from "./SubscriptionSection/SubscriptionSection.js";
import SignInFlowSection from "./SignInFlowSection/SignInFlowSection.js";
import SignInSessionsSection from "./SignInSessionsSection/SignInSessionsSection.js";
import DangerZoneSection from "./DangerZoneSection/DangerZoneSection.js";

//-- npm Package Components --//
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

//-- SX --//
import {
  MAIN_SX,
  DIVIDER_SX,
  BOLD_SX,
  BOLD_ITALIC_SX,
  BOLD_UNDERLINE_SX,
  USER_DATA_BOX_SX,
  GREY_BOX_SX,
  INPUT_AND_BUTTON_SX,
  CENTER_SX,
} from "../SettingsSX";

export default function AccountSettings() {
  //-- User Data --//
  const [email, setEmail] = useState();
  const [mfaSettings, setMFASettings] = useState();
  const [mfaEnabled, setMFAEnabled] = useState();

  const getUser = async () => {
    //-- Fresh tokens, SDK command --//
    const { accessToken } = await freshCUPTokens();
    try {
      let res = await CognitoUserPools.send(
        new GetUserCommand({ AccessToken: accessToken })
      );

      //-- Get Email from response --//
      let _email = res.UserAttributes.find((x) => x.Name === "email").Value;
      setEmail(_email);

      //-- Get MFA Settings from response and set state --//
      let _mfaSettings = res.PreferredMfaSetting;
      if (_mfaSettings === "SOFTWARE_TOKEN_MFA") {
        setMFASettings("MFA enabled");
        setMFAEnabled("yes");
      } else {
        setMFASettings("MFA not enabled");
        setMFAEnabled("no");
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  //-- **************** --//
  //-- Component return --//
  return (
    <Card variant="outlined" sx={{ border: "0px solid black" }}>
      {/* PAGE HEADER */}
      <Typography sx={BOLD_SX} variant={"h3"}>
        Account Settings
      </Typography>
      <Divider sx={DIVIDER_SX} />

      {/* SUBSCRIPTIONS */}
      <SubscriptionSection email={email} />
      <Divider sx={DIVIDER_SX} />

      {/* SIGN IN FLOW */}
      <SignInFlowSection
        getUser={getUser}
        email={email}
        mfaEnabled={mfaEnabled}
        mfaSettings={mfaSettings}
      />
      <Divider sx={DIVIDER_SX} />

      {/* SIGN IN SESSIONS */}
      <SignInSessionsSection />
      <Divider sx={DIVIDER_SX} />

      {/* DANGER ZONE (ACCOUNT DELETION) */}
      <DangerZoneSection />
      <Box sx={GREY_BOX_SX}>
        <Typography sx={BOLD_SX}>Deleting your account:</Typography>
        <Typography>
          To delete your account, please reach out to support@chrt.com from your
          CHRT account's current email listed above
        </Typography>
      </Box>
    </Card>
  );
}
