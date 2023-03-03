//-- React --//
import { Fragment, useState } from "react";

//-- AWS SDK --//
import CognitoUserPools from "../../SDK_CLIENTS/CognitoUserPools";
import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

//-- CHRT Components --//
import MainContainer from "../MainContainer/MainContainer";

//-- npm Package Functions --//
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { format } from "date-fns";
import axios from "axios";

//-- npm Package Components --//
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import InfoIcon from "@mui/icons-material/Info";
import TodayIcon from "@mui/icons-material/Today";

//-- localStorage --//

//-- SX --//
import { TEXT_FIELD_SX, BUTTON_SX } from "../AuthSX";
const LIST_ITEM_ICON_SX = { minWidth: "0px", marginRight: "8px" };
const MODAL_BOX_SX = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: "4px",
  marginTop: "252px",
  height: "220px",
  width: "400px",
};

//-- Utility functions --//
let timeout = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default function SignUp() {
  //-- React Router navigation --//
  let navigate = useNavigate();

  //-- Email State and Schema --//
  const [email_value, email_setValue] = useState("");
  const [email_error, email_setError] = useState(false);
  const [email_helperText, email_setHelperText] = useState(false);
  const [email_inFocus, email_setInFocus] = useState(false);
  const [email_hasBlurred, email_setHasBlurred] = useState(false);
  const email_schema = yup.object({
    email: yup
      .string()
      .email("Must be valid email (i.e. ___@__.__)")
      .required("Email required"),
  });
  //-- Password State and Schema--//
  const [password_value, password_setValue] = useState("");
  const [password_error, password_setError] = useState(false);
  const [password_inFocus, password_setInFocus] = useState(false);
  const [password_hasBlurred, password_setHasBlurred] = useState(false);
  const password_schema = yup.object({
    password: yup.string().required("Password required"),
  });

  //-- req1 --//
  const password_req1 = "at least 8 characters";
  const [password_req1_error, password_req1_setError] = useState(true);
  const password_req1_schema = yup.object({
    password: yup.string().min(8),
  });
  //-- req2 --//
  const password_req2 = "contains a lowercase character";
  const [password_req2_error, password_req2_setError] = useState(true);
  const password_req2_schema = yup.object({
    password: yup.string().matches(/[a-z]/),
  });
  //-- req3 --//
  const password_req3 = "contains an uppercase character";
  const [password_req3_error, password_req3_setError] = useState(true);
  const password_req3_schema = yup.object({
    password: yup.string().matches(/[A-Z]/),
  });
  //-- req4 --//
  const password_req4 = "contains a number";
  const [password_req4_error, password_req4_setError] = useState(true);
  const password_req4_schema = yup.object({
    password: yup.string().matches(/[0-9]/),
  });
  //-- req5 --//
  const password_req5 = "contains a special character";
  const [password_req5_error, password_req5_setError] = useState(true);
  const password_req5_schema = yup.object({
    // eslint-disable-next-line
    password: yup.string().matches(/[\^$*.[\]{}()?\-"!@#%&\/\\,><':;\|_~`\+=]/),
  });

  //-- Email onChange Handler --//
  const email_onChangeHandler = (event) => {
    //-- Set Value --//
    email_setValue(event.target.value);

    //-- Validate value with yup --//
    email_schema
      .validate({ email: event.target.value })
      .then((value) => {
        email_setError(false);
      })
      .catch((err) => {
        email_setError(true);
        email_setHelperText(err.errors);
      });
  };
  //-- Password onChange Handler --//
  const password_onChangeHandler = (event) => {
    //-- Set Value --//
    password_setValue(event.target.value);

    //-- Validate password value with yup --//
    password_schema
      .validate({ password: event.target.value })
      .then((value) => {
        password_setError(false);
      })
      .catch((err) => {
        password_setError(true);
        // password_setHelperText(err.errors);
      });

    //-- Check password req1 --//
    password_req1_schema
      .validate({ password: event.target.value })
      .then((value) => {
        password_req1_setError(false);
      })
      .catch((err) => {
        password_req1_setError(true);
      });
    //-- Check password req2 --//
    password_req2_schema
      .validate({ password: event.target.value })
      .then((value) => {
        password_req2_setError(false);
      })
      .catch((err) => {
        password_req2_setError(true);
      });
    //-- Check password req3 --//
    password_req3_schema
      .validate({ password: event.target.value })
      .then((value) => {
        password_req3_setError(false);
      })
      .catch((err) => {
        password_req3_setError(true);
      });
    //-- Check password req4 --//
    password_req4_schema
      .validate({ password: event.target.value })
      .then((value) => {
        password_req4_setError(false);
      })
      .catch((err) => {
        password_req4_setError(true);
      });
    //-- Check password req5 --//
    password_req5_schema
      .validate({ password: event.target.value })
      .then((value) => {
        password_req5_setError(false);
      })
      .catch((err) => {
        password_req5_setError(true);
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
      console.log(err);
      alert(
        "reCAPTCHA failed - please refresh the page and try again...if you are a human :). Reach out to support@chrt.com for support. [Axios to Lambda Error]"
      );
    }
  };
  //-- reCAPTCHA v2 Checkbox Expired Handler --//
  const recaptchaExpiredHandler = () => {
    setHumanVerified(false);
  };

  //-- Clickwrap checkboxes state --//
  const [clickwrapChecked, setClickwrapChecked] = useState(false);
  const [ageConfirmationChecked, setAgeConfirmationChecked] = useState(false);
  const onClickwrapCheckedHandler = (event) => {
    setClickwrapChecked(event.target.checked);
  };
  const onAgeConfirmationCheckedHandler = (event) => {
    setAgeConfirmationChecked(event.target.checked);
  };

  //-- Conditions for preventing Submit --//
  const disableSignUpButton =
    email_value === "" ||
    password_value === "" ||
    email_error ||
    password_error ||
    password_req1_error ||
    password_req2_error ||
    password_req3_error ||
    password_req4_error ||
    password_req5_error ||
    !clickwrapChecked ||
    !ageConfirmationChecked ||
    !humanVerified;

  //-- onSubmit Handler --//
  const onSubmitHandler = async () => {
    setSignUpAttempted(true);
    setModalOpen(true);

    //-- Burner email check via Lambda Function URL (for request failures, just proceed) --//
    let burner = false;

    //-- Send Axios POST request to Auth Utilities API  --//
    let url = "https://authutilities.chrt.com/burneremailcheck";
    let content = { email: email_value };
    try {
      let res = await axios.post(url, content);
      burner = res.data.burner;
    } catch (err) {
      console.log(err);
    }
    //-- If burner email, alert user. Else make Cognito API calls for Sign Up --//
    if (burner === true) {
      alert(
        'That looks like a "burner" email. Please try Gmail, iCloud, Outlook, ProtonMail, etc.'
      );
      setModalOpen(false);
    } //-- Note - Request errors don't trigger the "burner" error, just successful requests returning `true` --//
    else {
      //-- Update Sign Up Stepper Modal  --//
      setActiveStep(1);

      //-- SignUp Command --//
      try {
        let res = await CognitoUserPools.send(
          new SignUpCommand({
            ClientId: "7j7co4p1u35vbf31ahl09ihfut",
            Password: password_value,
            Username: email_value,
          })
        );

        // TODO - success and error handling

        //-- Update Sign Up Stepper Modal  --//
        setActiveStep(2);

        //-- Navigate to confirm/email --//
        await timeout(1000);
        navigate(`/confirm/${email_value}`);
      } catch (err) {
        setModalOpen(false);
        alert(
          "Sign Up Error. If you already Signed Up, please (1) check your email for a verification code and enter it at chrt.com/confirm (2) Sign In at chrt.com/SignIn. If this does not resolve your situation, please reach out to support@chrt.com. Sorry for the inconvenience."
        );
      }
    }
  };

  //-- Check for tokens to determine if a user is Signed In --//
  let cognito_sub = localStorage.getItem("chrt-currentUser-cognito_sub") || "";
  let idToken = localStorage.getItem(`chrt-${cognito_sub}-idToken`) || "";
  let refreshToken =
    localStorage.getItem(`chrt-${cognito_sub}-refreshToken`) || "";

  //-- Sign Up Stepper Modal --//
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [signUpAttempted, setSignUpAttempted] = useState(false);

  //-- Return Sign Out Button or Sign In Form --//
  if (idToken && refreshToken && !signUpAttempted) {
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
        {/* Sign Up Stepper Modal */}
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
              <Step key={"email"} completed={activeStep > 0}>
                <StepLabel>{"Email Check"}</StepLabel>
              </Step>

              <Step key={"account"} completed={activeStep > 1}>
                <StepLabel>{"Create Account"}</StepLabel>
              </Step>
            </Stepper>
          </Box>
        </Modal>

        {/* Sign Up Form */}
        <MainContainer>
          <Typography variant="h6">Sign up with a new account</Typography>
          <form>
            <TextField
              // id="email"
              label="Email"
              variant="outlined"
              error={email_error && email_hasBlurred && !email_inFocus}
              helperText={
                email_error &&
                email_hasBlurred &&
                !email_inFocus &&
                `${email_helperText}`
              }
              value={email_value}
              autoComplete="off"
              onFocus={() => {
                email_setInFocus(true);
              }}
              onChange={email_onChangeHandler}
              onBlurCapture={() => {
                email_setInFocus(false);
                email_setHasBlurred(true);
              }}
              sx={TEXT_FIELD_SX}
            />
          </form>
          <form>
            <TextField
              // id="password"
              label="Password"
              type="password"
              variant="outlined"
              error={password_error && password_hasBlurred && !password_inFocus}
              value={password_value}
              autoComplete="off"
              onFocus={() => {
                password_setInFocus(true);
              }}
              onChange={password_onChangeHandler}
              onBlurCapture={() => {
                password_setInFocus(false);
                password_setHasBlurred(true);
              }}
              sx={TEXT_FIELD_SX}
            />
          </form>
          <Box>
            <List dense disablePadding>
              {/* Req 1 */}
              <ListItem>
                <ListItemIcon sx={LIST_ITEM_ICON_SX}>
                  {password_req1_error ? (
                    <HighlightOffIcon color="warning" fontSize="small" />
                  ) : (
                    <CheckCircleOutlineIcon color="success" fontSize="small" />
                  )}
                </ListItemIcon>
                <Typography>{password_req1}</Typography>
              </ListItem>

              {/* Req 2 */}
              <ListItem>
                <ListItemIcon sx={LIST_ITEM_ICON_SX}>
                  {password_req2_error ? (
                    <HighlightOffIcon color="warning" fontSize="small" />
                  ) : (
                    <CheckCircleOutlineIcon color="success" fontSize="small" />
                  )}
                </ListItemIcon>
                <Typography>{password_req2}</Typography>
              </ListItem>

              {/* Req 3 */}
              <ListItem>
                <ListItemIcon sx={LIST_ITEM_ICON_SX}>
                  {password_req3_error ? (
                    <HighlightOffIcon color="warning" fontSize="small" />
                  ) : (
                    <CheckCircleOutlineIcon color="success" fontSize="small" />
                  )}
                </ListItemIcon>
                <Typography>{password_req3}</Typography>
              </ListItem>

              {/* Req 4 */}
              <ListItem>
                <ListItemIcon sx={LIST_ITEM_ICON_SX}>
                  {password_req4_error ? (
                    <HighlightOffIcon color="warning" fontSize="small" />
                  ) : (
                    <CheckCircleOutlineIcon color="success" fontSize="small" />
                  )}
                </ListItemIcon>
                <Typography>{password_req4}</Typography>
              </ListItem>

              {/* Req 5 */}
              <ListItem>
                <ListItemIcon sx={LIST_ITEM_ICON_SX}>
                  {password_req5_error ? (
                    <HighlightOffIcon color="warning" fontSize="small" />
                  ) : (
                    <CheckCircleOutlineIcon color="success" fontSize="small" />
                  )}
                </ListItemIcon>
                <Typography>{password_req5}</Typography>
                <Tooltip
                  placement="top-end"
                  title={
                    <Typography>
                      {`^ $ * . [ ] { } ( ) ? - " ! @ # % & / \\ , > < ' : ; | _ ~ \` + =`}
                    </Typography>
                  }
                >
                  <InfoIcon htmlColor="#555" sx={{ marginLeft: "58px" }} />
                </Tooltip>
              </ListItem>
            </List>
          </Box>

          {/* Google reCaptcha v2 Checkbox */}
          <Box sx={{ marginY: "5px" }}>
            <ReCAPTCHA
              sitekey="6LevhPQhAAAAAMxmof5YgjGEWZ3Xci2v6bfRkqjh"
              onChange={onRecaptchaChange}
              onExpired={recaptchaExpiredHandler}
            />
          </Box>

          {/* Age Confirmation Clickwrap */}
          <Paper
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "300px",
              height: "48px",
              marginTop: "2px",
              marginBottom: "2px",
            }}
          >
            <Checkbox onChange={onAgeConfirmationCheckedHandler} />
            <Typography variant="caption">I am 18+ years of age</Typography>
          </Paper>
          {/* Terms / Privacy / Cookies Clickwrap */}
          <Paper
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "300px",
              height: "48px",
              marginTop: "6px",
              marginBottom: "2px",
            }}
          >
            <Checkbox onChange={onClickwrapCheckedHandler} />
            <Typography variant="caption">
              Click here to accept CHRT's{" "}
              <Link href="https://resources.chrt.com/legal/terms">Terms</Link>,
              <br />
              <Link href="https://resources.chrt.com/legal/privacy">
                Privacy Statement
              </Link>
              , and{" "}
              <Link href="https://resources.chrt.com/legal/cookies">
                Cookies Policy.
              </Link>
            </Typography>
          </Paper>

          {/* Sign Up Button */}
          <Button
            variant={"contained"}
            onClick={onSubmitHandler}
            disabled={disableSignUpButton}
            sx={BUTTON_SX}
          >
            SIGN UP
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
              Have an account?{" "}
              <Link href="https://chrt.com/signin">Sign In</Link>
            </Typography>
          </Box>
        </MainContainer>
      </Fragment>
    );
  }
}
