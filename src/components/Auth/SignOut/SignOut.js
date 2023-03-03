//-- React --//
import { useState, useEffect, Fragment } from "react";

//-- AWS SDK --//
import freshCUPTokens from "../../SDK_CLIENTS/freshCUPTokens";

//-- CHRT Components --//

//-- npm Package Functions --//
import axios from "axios";
import jwtDecode from "jwt-decode";
import { Sha256 } from "@aws-crypto/sha256-browser";

//-- npm Package Components --//
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";

//-- SX --//
const MODAL_BOX_SX = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: "4px",
  marginTop: "252px",
  height: "220px",
  width: "600px",
};

//-- Utility functions --//
let timeout = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
let redirectHome = () => {
  window.location.assign(process.env.REACT_APP_HOMEPAGE_URL);
};

export default function SignOut() {
  let signOutFlow = async () => {
    //-- Open Sign Out Stepper Modal --//
    setModalOpen(true);

    //-- Get cognito_sub, tokens, and deviceKey to use for full sign out flow --//
    let { cognito_sub, idToken, accessToken, refreshToken, key } =
      await freshCUPTokens();

    //-- If idToken not found, try deleting all localStorage items, then redirec to SignIn --//
    if (!idToken) {
      //-- Delete tokens from localStorage--//
      localStorage.removeItem("chrt-currentUser-cognito_sub");
      localStorage.removeItem(`chrt-${cognito_sub}-idToken`);
      localStorage.removeItem(`chrt-${cognito_sub}-idTokenExpiration`);
      localStorage.removeItem(`chrt-${cognito_sub}-accessToken`);
      localStorage.removeItem(`chrt-${cognito_sub}-refreshToken`);
      localStorage.removeItem(`chrt-${cognito_sub}-refreshTokenExpiration`);
      localStorage.removeItem(`chrt-${cognito_sub}-key`);
      localStorage.removeItem(`chrt-${cognito_sub}-groupKey`);
      localStorage.removeItem(`chrt-${cognito_sub}-devicePassword`);
      //-- Note - not attempting to remove chrt-{hashedEmail}-cognito_sub  due to lack of email in idToken--//

      //-- Redirect user to home page --//
      await timeout(2000);
      return redirectHome();
    }

    //-- Update Sign In Stepper Modal --//
    setActiveStep(1);

    //-- Get hashed email value --//
    let idTokenDecoded = jwtDecode(idToken);
    let email = idTokenDecoded.email;
    const hash = new Sha256();
    hash.update(email + "chrt-salt");
    let hashed_email = await hash.digest();

    //-- Delete tokens from localStorage--//
    localStorage.removeItem("chrt-currentUser-cognito_sub");
    localStorage.removeItem(`chrt-${cognito_sub}-idToken`);
    localStorage.removeItem(`chrt-${cognito_sub}-idTokenExpiration`);
    localStorage.removeItem(`chrt-${cognito_sub}-accessToken`);
    localStorage.removeItem(`chrt-${cognito_sub}-refreshToken`);
    localStorage.removeItem(`chrt-${cognito_sub}-refreshTokenExpiration`);
    localStorage.removeItem(`chrt-${cognito_sub}-key`);
    localStorage.removeItem(`chrt-${cognito_sub}-groupKey`);
    localStorage.removeItem(`chrt-${cognito_sub}-devicePassword`);
    localStorage.removeItem(`chrt-${hashed_email}-cognito_sub`);

    //-- Delete settings from localStorage--//
    localStorage.removeItem(`chrt-${cognito_sub}-lastFileUploadBrokerage`);

    //-- Update Sign In Stepper Modal --//
    setActiveStep(2);

    //-- Prep axios call params --//
    let url = "https://authutilities.chrt.com/revokesession"; //-- Lambda proxy for chrtRevokeRefreshToken --//
    let content = {
      accessToken: accessToken,
      deviceKey: key,
      idToken: idToken,
      refreshToken: refreshToken,
    };
    let headersObject = {
      authorization: idToken,
    };

    //-- Send Axios POST request to Auth Utilities API --//
    try {
      await axios.post(url, content, {
        headers: headersObject,
      });

      //-- Update Sign In Stepper Modal --//
      setActiveStep(3);
    } catch (err) {
      console.log(
        "axios error during Auth Utilities API Sessions Manager request"
      );
      //-- Failed server sign out --//
      alert(
        "Server sign out experienced an error. Please refresh the page to try again."
      );
    }

    //-- Redirect user to home page --//
    await timeout(2000);
    redirectHome();
  };

  //-- After page load, execute Sign Out Flow --//
  useEffect(() => {
    signOutFlow();
  }, []);

  //-- Sign In Stepper Modal --//
  const [modalOpen, setModalOpen] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Fragment>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Box sx={MODAL_BOX_SX}>
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step completed={activeStep > 0}>
              <StepLabel>{"Identify Session"}</StepLabel>
            </Step>
            <Step completed={activeStep > 1}>
              <StepLabel>{"Local Sign Out"}</StepLabel>
            </Step>
            <Step completed={activeStep > 2}>
              <StepLabel>{"Revoke Session"}</StepLabel>
            </Step>
          </Stepper>
        </Box>
      </Modal>
    </Fragment>
  );
}
