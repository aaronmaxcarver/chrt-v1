//-- React --//
import { useState, Fragment } from "react";

//-- AWS SDK --//

//-- CHRT Components --//
import MainContainer from "../MainContainer/MainContainer";

//-- npm Package Functions --//
import axios from "axios";
import { format } from "date-fns";
import { srpLogin } from "franken-srp";
import { add, getUnixTime } from "date-fns";
import jwtDecode from "jwt-decode";
import * as yup from "yup";
import { Sha256 } from "@aws-crypto/sha256-browser";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

//-- npm Package Components --//
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import TodayIcon from "@mui/icons-material/Today";

import ReCAPTCHA from "react-google-recaptcha";

//-- SX --//
import { TEXT_FIELD_SX, BUTTON_SX } from "../AuthSX";

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

//-- Constants --//
const REGION = "us-east-1";
const APP_CLIENT_ID = "7j7co4p1u35vbf31ahl09ihfut";
const USER_POOL_ID = "us-east-1_nGMFSXaES";

export default function SignIn() {
  let { email, password } = useParams();

  //-- Email and Password state --//
  const [email_value, email_setValue] = useState(email || "");
  const [password_value, password_setValue] = useState(password || "");
  //-- Email onChange Handler --//
  const email_onChangeHandler = (event) => {
    //-- Set Value --//
    email_setValue(event.target.value);
  };
  //-- Password onChange Handler --//
  const password_onChangeHandler = (event) => {
    //-- Set Value --//
    password_setValue(event.target.value);
  };

  //-- MFA/TOTP State and Schema --//
  const [totp_value, totp_setValue] = useState("");
  const [totp_error, totp_setError] = useState(false);
  const [totp_valid, totp_setValid] = useState(false);
  const [totp_helperText, totp_setHelperText] = useState(false);
  const [totp_inFocus, totp_setInFocus] = useState(false);
  const [totp_hasBlurred, totp_setHasBlurred] = useState(false);
  const totp_schema = yup.object({
    totp: yup
      .string()
      .matches(/^[0-9]*$/, "Digits only")
      .min(6, "Must be 6 digits")
      .max(6, "Must be 6 digits")
      .required(),
  });

  //-- TOTP onChange Handler --//
  const totp_onChangeHandler = (event) => {
    //-- Set Value --//
    totp_setValue(event.target.value);

    //-- Validate value with yup --//
    totp_schema
      .validate({ totp: event.target.value })
      .then((value) => {
        totp_setValid(true);
        totp_setError(false);
      })
      .catch((err) => {
        totp_setValid(false);
        totp_setError(true);
        totp_setHelperText(err.errors);
      });
  };

  //-- reCaptcha v2 Checkbox State --//
  const [humanVerified, setHumanVerified] = useState(false);
  //-- reCAPTCHA v2 Checkbox onChange Handler --//\
  const onRecaptchaChange = async (value) => {
    try {
      //-- Send Axios POST request to Auth Utilities API  --//
      let url = "https://authutilities.chrt.com/recaptchav2"; //-- Lambda proxy integration for reCAPTCHAv2 function --//
      let content = {
        recaptchaValue: value,
      };
      let res = await axios.post(url, content); //-- No headers, resource + method has no authorization --//

      //-- Success case: reCAPTCHA validation returned true --//
      if (res.data.success === true) {
        setHumanVerified(true);
      }
      //-- Error case: reCAPTCHA validation returned false  --//
      else if (res.data.success === false) {
        alert(
          "reCAPTCHA failed - please refresh the page and try again...if you are a human :) [reCAPTCHA validation returned false Error]"
        );
      }
      //-- Error case: Lambda to reCAPTCHA  --//
      else if (res.data.success === "Lambda to reCAPTCHA Error") {
        alert(
          "reCAPTCHA failed - please refresh the page and try again...if you are a human :). Reach out to support@chrt.com for support. [Lambda to reCAPTCHA Error]"
        );
      }
      //-- Error case: Unexpected  --//
      // NOTE - Consider allowing success in the case of unexpected errors...
      else {
        alert(
          "reCAPTCHA failed - please refresh the page and try again...if you are a human :). Reach out to support@chrt.com for support. [unexpected Error]"
        );
      }
    } catch (err) {
      alert(
        "reCAPTCHA failed - please refresh the page and try again...if you are a human :). Reach out to support@chrt.com for support. [Axios to Lambda Error]"
      );
    }
  };
  //-- reCAPTCHA v2 Checkbox Expired Handler --//
  const recaptchaExpiredHandler = () => {
    setHumanVerified(false);
  };

  //-- Disable Submit Button --//
  const disableSubmit = !humanVerified || !email_value || !password_value;

  //-- onSubmit Handler --//
  const onSubmitHandler = async () => {
    setLoginAttempted(true);

    //-- Open Sign In Stepper Modal --//
    setModalOpen(true);
    //-- NOTE - step 0 is active due to intial activeStep state value of 0 --//

    //-- Hash email value --//
    const hash = new Sha256();
    hash.update(email_value + "chrt-salt");
    let hashed_email_value = await hash.digest();

    //-- Use email to check for a 'sub' value --//
    let cognito_sub =
      localStorage.getItem(`chrt-${hashed_email_value}-cognito_sub`) || "";

    //-- If a cognito_sub is found for the user signing in, try to get device params --//
    let key, groupKey, devicePassword;
    if (cognito_sub) {
      key = localStorage.getItem(`chrt-${cognito_sub}-key`) || "";
      groupKey = localStorage.getItem(`chrt-${cognito_sub}-groupKey`) || "";
      devicePassword =
        localStorage.getItem(`chrt-${cognito_sub}-devicePassword`) || "";
    }

    //-- Set device parameters or leave 'device' as undefined --//
    let device;
    if (key && groupKey && devicePassword) {
      device = {
        key: key,
        groupKey: groupKey,
        password: devicePassword,
      };
    }

    //-- Defin doLogin (franken-srp implementation) --//
    const doLogin = async (username, password) => {
      //-- Set pool and user params by creating instance of the srpLogin Async Generator --//
      const login = srpLogin({
        region: REGION,
        userPoolId: USER_POOL_ID,
        clientId: APP_CLIENT_ID,
        username,
        password,
        device: device,
        autoConfirmDevice: true,
        autoRememberDevice: "not_remembered", // Seems to still be remembering?
      });

      //-- Start the async generator by calling login.next() and awaiting the result --//
      let result = await login.next(); //-- NOTE - Docs use const, changed to let here --//

      //-- Update Sign In Stepper Modal - step 1 active --//
      setActiveStep(1);

      //-- Device params exist on client but were deleted from Cognito --//
      if (result.value?.error?.message === "Device does not exist.") {
        //-- Remove device params from localStorage --//
        localStorage.removeItem(`chrt-${cognito_sub}-key`);
        localStorage.removeItem(`chrt-${cognito_sub}-deviceKey`);
        localStorage.removeItem(`chrt-${cognito_sub}-devicePassword`);
        throw new Error("Device does not exist.");
      }

      //-- Respond to ChallengeName: "SOFTWARE_TOKEN_MFA" --//
      if (result.value.code === "SOFTWARE_MFA_REQUIRED") {
        //-- Update Sign In Stepper Modal - step 2 active, set mfaEnabled true --//
        setActiveStep(2);
        mfaEnabled = true;

        //-- Call login.next() with the totp_value --//
        result = await login.next(totp_value);
      }

      //-- On success, tokens are returned --//
      if (result.value.code === "TOKENS") {
        //-- Update Sign In Stepper Modal - if mfaEnabled is true then set mfaStepComplete to true --//
        if (mfaEnabled) {
          setMFAStepComplete(true);
        }
        //-- Set step 3 to active --//
        setActiveStep(3);

        //-- Return tokens to complete franken-srp login --//
        return result.value.response;
      }

      //-- This error gets passed to the doLogin catch block --//
      throw new Error(`unexpected result code: ${result.code}`);
    };

    //-- Call doLogin --//
    try {
      //-- (1) franken-srp login --//
      //-- ********************* --//
      let res = await doLogin(email_value, password_value);

      //-- (2) Call Auth Utilities API to store refresh token in DynamoDB --//
      //-- ************************************************************** --//
      //-- Use cognito 'sub' attribute value for localStorage values --//
      const idTokenDecoded = jwtDecode(res.tokens.idToken);
      cognito_sub = idTokenDecoded.sub;

      //-- Get device key either from device object that checked localStorage or from doLogin response --//
      let deviceKey = device?.key || res?.newDevice?.key;

      //-- Prep axios call params --//
      let url = "https://authutilities.chrt.com/sessionsmanager"; //-- Lambda proxy for chrtStoreRefreshToken --//
      let content = {
        accessToken: res.tokens.accessToken,
        deviceKey: deviceKey,
        idToken: res.tokens.idToken,
        refreshToken: res.tokens.refreshToken,
      };
      let headersObject = {
        authorization: res.tokens.idToken,
      };

      //-- Send Axios POST request to Auth Utilities API --//
      try {
        await axios.post(url, content, {
          headers: headersObject,
        });
        // TODO - if error received from API Gateway, throw new Error("Error establishing session")
        // // show error message from API gateway as well?

        //-- Update Sign In Stepper Modal --//
        setActiveStep(4); //-- Sets all steps to complete (or perhaps not complete for MFA) --//
        //----//
      } catch (err) {
        console.log(err);
        throw new Error(
          "axios error during Auth Utilities API Sessions Manager request"
        );
      }

      //-- (3) If request to Auth Utilities API succeeds, store tokens, else throw Error --//
      //-- ***************************************************************************** --//
      //-- Store id and access tokens in localStorage --//
      localStorage.setItem(`chrt-${cognito_sub}-idToken`, res.tokens.idToken);
      localStorage.setItem(
        `chrt-${cognito_sub}-accessToken`,
        res.tokens.accessToken
      );
      //-- Store cognit_sub - used for (a) choosing current user, (b) DynamoDB item-level access control --//
      localStorage.setItem("chrt-currentUser-cognito_sub", cognito_sub);

      //-- Store hashed email (during sign in used to get cognito_sub to check for device params) --//
      localStorage.setItem(
        `chrt-${hashed_email_value}-cognito_sub`,
        cognito_sub
      );
      //-- Store refresh token in localStorage --//
      localStorage.setItem(
        `chrt-${cognito_sub}-refreshToken`,
        res.tokens.refreshToken
      );
      //-- Set idToken expiration timestamp --//
      localStorage.setItem(
        `chrt-${cognito_sub}-idTokenExpiration`,
        idTokenDecoded.exp
      );
      //-- (NOTE - Hardcoded value) Store refresh token expiration timestamp in localStorage --//
      const refreshTokenExpiration = getUnixTime(
        add(Date.now(), { days: 41, hours: 23, minutes: 59 })
      );
      localStorage.setItem(
        `chrt-${cognito_sub}-refreshTokenExpiration`,
        refreshTokenExpiration
      );
      //-- Store device params in localStorage if they are returned --//
      if (res?.newDevice?.key) {
        localStorage.setItem(`chrt-${cognito_sub}-key`, res.newDevice.key);
      }
      if (res?.newDevice?.groupKey) {
        localStorage.setItem(
          `chrt-${cognito_sub}-groupKey`,
          res.newDevice.groupKey
        );
      }
      if (res?.newDevice?.password) {
        localStorage.setItem(
          `chrt-${cognito_sub}-devicePassword`,
          res.newDevice.password
        );
      }

      //-- Redirect user to home page - redirect (instead of react-router-dom navigate allows the SDK clients to initialize after tokens are available in localStorage, preventing SDK command credential failures) --//
      window.location.assign(process.env.REACT_APP_HOMEPAGE_URL);
    } catch (err) {
      //-- If the error is for old device credentials, submit form again, else reset TOTP --//
      console.log(err.message);
      if (err.message === "Device does not exist.") {
        //-- Close Sign In Stepper Modal, etc. --//
        setModalOpen(false);
        setActiveStep(0);
        setLoginAttempted(false);
        mfaEnabled = false;
        //-- Do Sign In sequence again - stale device data gets deleted during first Sign In attempt --//
        onSubmitHandler();
        //----//
      } else {
        //-- Reset TOTP input and status --//
        totp_setValue("");
        totp_setValid(false);
        //-- Close Sign In Stepper Modal, etc. --//
        setModalOpen(false);
        setActiveStep(0);
        setLoginAttempted(false);
        mfaEnabled = false;
        //-- Alert user of error --//
        alert("Sign In failed. Please try again. [" + err.message + "]");
      }
    }
  };

  //-- Check for tokens to determine if a user is Signed In --//
  let cognito_sub = localStorage.getItem("chrt-currentUser-cognito_sub") || "";
  let idToken = localStorage.getItem(`chrt-${cognito_sub}-idToken`) || "";
  let refreshToken =
    localStorage.getItem(`chrt-${cognito_sub}-refreshToken`) || "";

  //-- react router navigate --//
  let navigate = useNavigate();

  //-- Sign In Stepper Modal --//
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  let mfaEnabled;
  const [mfaStepComplete, setMFAStepComplete] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);

  //-- Return Sign Out Button or Sign In Form --///
  if (idToken && refreshToken && !loginAttempted) {
    return (
      <MainContainer>
        <Button
          variant="contained"
          onClick={() => {
            navigate("/signout");
          }}
        >
          SIGN OUT
        </Button>
      </MainContainer>
    );
  } else {
    return (
      <Fragment>
        {/* Sign In Stepper Modal */}
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
              <Step key={"keys"} completed={activeStep > 0}>
                <StepLabel>{"Cryptographic Key Exchange"}</StepLabel>
              </Step>
              <Step key={"srp"} completed={activeStep > 1}>
                <StepLabel>{"Secure Remote Password Authentication"}</StepLabel>
              </Step>

              <Step key={"mfa"} completed={activeStep > 2 && mfaStepComplete}>
                <StepLabel>{"Multi-Factor Authentication"}</StepLabel>
              </Step>

              <Step key={"sesion"} completed={activeStep > 3}>
                <StepLabel>{"Establish Active Session"}</StepLabel>
              </Step>
            </Stepper>
          </Box>
        </Modal>

        {/* Sign In Components */}
        <MainContainer>
          <Typography variant="h6">Sign In</Typography>
          {/* Email and Password */}
          <form>
            <TextField
              label="Email"
              variant="outlined"
              autoComplete="on"
              value={email_value}
              onChange={email_onChangeHandler}
              sx={TEXT_FIELD_SX}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              autoComplete="on"
              value={password_value}
              onChange={password_onChangeHandler}
              sx={TEXT_FIELD_SX}
            />
          </form>

          {/* Google reCaptcha v2 Checkbox */}
          <Box
            sx={{
              marginY: "5px",
              marginRight: "3px",
              height: "75px",
              width: "300px",
              //----//
            }}
          >
            <ReCAPTCHA
              sitekey="6LevhPQhAAAAAMxmof5YgjGEWZ3Xci2v6bfRkqjh"
              onChange={onRecaptchaChange}
              onExpired={recaptchaExpiredHandler}
            />
          </Box>

          {/* MFA */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              label="MFA code (ignore unless enabled)"
              variant="filled"
              error={totp_error && totp_hasBlurred && !totp_inFocus}
              helperText={
                totp_error && totp_hasBlurred && !totp_inFocus
                  ? `${totp_helperText}`
                  : "Required only if MFA is enabled"
              }
              color={totp_valid ? "success" : "warning"}
              autoComplete="off"
              value={totp_value}
              onFocus={() => {
                totp_setInFocus(true);
              }}
              onChange={totp_onChangeHandler}
              onBlurCapture={() => {
                totp_setInFocus(false);
                totp_setHasBlurred(true);
              }}
              sx={{
                marginTop: "6px",
                width: "300px",
              }}
            />
          </Box>

          {/* "Shrinkwrap" agreement */}
          <Box
            sx={{
              marginTop: "6px",
              marginX: "8px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <Typography variant="caption">
              By clicking SIGN IN below, you agree to CHRT's <br />{" "}
              <Link href="https://resources.chrt.com/legal/terms">Terms</Link>,{" "}
              <Link href="https://resources.chrt.com/legal/privacy">
                Privacy Statement
              </Link>
              , and{" "}
              <Link href="https://resources.chrt.com/legal/cookies">
                Cookies Policy.
              </Link>
            </Typography>
          </Box>

          {/* Submit Button */}
          <Button
            variant={"contained"}
            onClick={onSubmitHandler}
            sx={BUTTON_SX}
            disabled={disableSubmit}
          >
            SIGN IN
          </Button>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: "4px",
            }}
          >
            {/* Today's Date */}
            <Chip
              label={format(Date.now(), "yyyy/MM/dd")}
              size="small"
              sx={{
                marginRight: "8px",
              }}
              icon={<TodayIcon />}
            />

            {/* Link to Sign In Page */}
            <Divider orientation="vertical" sx={{ marginRight: "9px" }} />
            <Typography variant="body2">
              Need an account?{" "}
              <Link href="https://chrt.com/signup">Sign Up</Link>
            </Typography>
          </Box>

          {/* Forgot your password? */}
          <Box sx={{ marginTop: "6px", marginBottom: "2px" }}>
            <Link href="https://chrt.com/forgotpassword" fontSize="small">
              Forgot your password?
            </Link>
          </Box>
        </MainContainer>
      </Fragment>
    );
  }
}
