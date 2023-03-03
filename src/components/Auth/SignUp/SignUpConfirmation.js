//-- React --//
import { useState } from "react";

//-- AWS SDK --//
import CognitoUserPools from "../../SDK_CLIENTS/CognitoUserPools";
import {
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
} from "@aws-sdk/client-cognito-identity-provider";

//-- CHRT Components --//
import MainContainer from "../MainContainer/MainContainer";

//-- npm Package Functions --//
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

//-- npm Package Components --//
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

//-- localStorage --//

//-- SX --//
import { TEXT_FIELD_SX, BUTTON_SX } from "../AuthSX";

export default function SignUp() {
  let navigate = useNavigate();
  let { destination } = useParams();

  //-- Email State and Schema --//
  const [email_value, email_setValue] = useState(destination || "");
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

  //-- Email TextField --//
  const onEmailChangeHandler = (event) => {
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

  //-- Confirmation Code TextField --//
  const [code_value, code_setValue] = useState("");
  const [code_error, code_setError] = useState(false);
  const [code_helperText, code_setHelperText] = useState(false);
  const [code_inFocus, code_setInFocus] = useState(false);
  const [code_hasBlurred, code_setHasBlurred] = useState(false);
  const code_schema = yup.object({
    code: yup
      .string()
      .matches(/^[0-9]*$/, "Digits only")
      .min(6, "Must be 6 digits")
      .max(6, "Must be 6 digits")
      .required(),
  });
  const code_onChangeHandler = (event) => {
    //-- Set Value --//
    code_setValue(event.target.value);

    //-- Validate value with yup --//
    code_schema
      .validate({ code: event.target.value })
      .then((value) => {
        code_setError(false);
      })
      .catch((err) => {
        code_setError(true);
        code_setHelperText(err.errors);
      });
  };

  //-- Submit Verification Code --//
  const confirmSignUpHandler = async () => {
    try {
      let res = await CognitoUserPools.send(
        new ConfirmSignUpCommand({
          ClientId: "7j7co4p1u35vbf31ahl09ihfut",
          ConfirmationCode: `${code_value}`,
          Username: `${email_value}`,
        })
      );

      // TODO - if successful confirmation, notify user?
      // then navigate user to /signin

      console.log(res); // DEV

      navigate("/signin");
    } catch (err) {
      console.log(err);
      alert(
        "Error. Please check your email to ensure the email address and verification code are correct."
      );
    }
  };

  //-- Resend Verification Code --//
  const resendConfirmationCodeHandler = async () => {
    console.log("resendConfirmationCodeHandler");
    try {
      let res = await CognitoUserPools.send(
        new ResendConfirmationCodeCommand({
          ClientId: "7j7co4p1u35vbf31ahl09ihfut",
          Username: `${email_value}`,
        })
      );
      // TODO - alert user of status of resend command
      console.log(res); // DEV
    } catch (err) {
      console.log(err);
    }
  };

  //-- Disable Confirm Sign Up Button --//
  const disableConfirmSignUp =
    email_value === "" || code_value === "" || email_error || code_error;

  return (
    <MainContainer>
      <Typography variant="h6" sx={{ marginBottom: "6px" }}>
        Check email for verification code
      </Typography>
      <Typography>Usually delivered in 30-60 seconds</Typography>

      {/* Email TextField */}
      <TextField
        label="Email"
        variant="filled"
        error={email_error && email_hasBlurred && !email_inFocus}
        helperText={
          email_error &&
          email_hasBlurred &&
          !email_inFocus &&
          `${email_helperText}`
        }
        value={email_value}
        onFocus={() => {
          email_setInFocus(true);
        }}
        onChange={onEmailChangeHandler}
        onBlurCapture={() => {
          email_setInFocus(false);
          email_setHasBlurred(true);
        }}
        sx={TEXT_FIELD_SX}
      />

      {/* Verification Code TextField */}
      <TextField
        label="6-Digit Verification Code"
        error={code_error && code_hasBlurred && !code_inFocus}
        helperText={
          code_error && code_hasBlurred && !code_inFocus && `${code_helperText}`
        }
        value={code_value}
        onFocus={() => {
          code_setInFocus(true);
        }}
        onChange={code_onChangeHandler}
        onBlurCapture={() => {
          code_setInFocus(false);
          code_setHasBlurred(true);
        }}
        sx={TEXT_FIELD_SX}
      />
      {/* Submit Verification Code */}
      <Button
        onClick={confirmSignUpHandler}
        variant="contained"
        sx={BUTTON_SX}
        disabled={disableConfirmSignUp}
      >
        CONFIRM SIGN UP
      </Button>

      {/* Resend Verification Code */}
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "4px",
          paddingTop: "8px",
          paddingBottom: "4px",
          backgroundColor: "#ead5c5", //-- very light orange --//
        }}
      >
        <Typography variant="body2" fontStyle="italic">
          Didn't receive a verification code?
        </Typography>
        <Button
          onClick={resendConfirmationCodeHandler}
          variant="contained"
          size="small"
          color="inherit"
          sx={BUTTON_SX}
        >
          SEND ANOTHER VERIFICATION CODE
        </Button>
      </Paper>
    </MainContainer>
  );
}
