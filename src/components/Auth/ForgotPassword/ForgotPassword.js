//-- React --//
import { useEffect, useState } from "react";

//-- AWS SDK --//
import freshCUPTokens from "../../SDK_CLIENTS/freshCUPTokens";

//-- CHRT Components --//
import MainContainer from "../MainContainer/MainContainer";

//-- npm Package Functions --//
import axios from "axios";
import * as yup from "yup";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

//-- npm Package Components --//
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import InfoIcon from "@mui/icons-material/Info";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

//-- SX --//
import { TEXT_FIELD_SX, BUTTON_SX } from "../AuthSX";
const LIST_ITEM_ICON_SX = { minWidth: "0px", marginRight: "8px" };

export default function ForgotPassword() {
  let navigate = useNavigate();
  //-- ********************** --//
  //-- Email State and Schema --//
  const [email_value, email_setValue] = useState("");
  const [email_disabled, email_setDisabled] = useState(false);
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

  //-- Check for Active Session (to fill email text field) --//
  const checkForActiveSession = async () => {
    let { idToken } = await freshCUPTokens();
    //-- If idToken found, set email value and disable field so it can't be edited --//
    if (idToken) {
      email_setDisabled(true);
      let idTokenDecoded = jwtDecode(idToken);
      let email = idTokenDecoded.email;
      email_setValue(email);
    }
  };
  useEffect(() => {
    checkForActiveSession();
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

  //-- Conditions for preventing Send Confirmation Code --//
  const disableSendConfirmationCodeButton = email_value === "" || email_error;

  //-- Send confirmation code --//
  const sendConfirmationCodeHandler = async () => {
    //-- Use API Gateway so that the user can't determine if the email was found --//
    let url = "https://authutilities.chrt.com/forgot_password";
    let content = {
      email: email_value,
    };
    try {
      await axios.post(url, content);
    } catch (err) {
      console.log(err);
      throw new Error("axios error during Auth Utilities API request");
    }
  };

  //-- ********************************** --//
  //-- Confirmation Code State and Schema --//
  const [confirmationCode_value, confirmationCode_setValue] = useState("");
  const [confirmationCode_error, confirmationCode_setError] = useState(false);
  const [confirmationCode_valid, confirmationCode_setValid] = useState(false);
  const [confirmationCode_helperText, confirmationCode_setHelperText] =
    useState(false);
  const [confirmationCode_inFocus, confirmationCode_setInFocus] =
    useState(false);
  const [confirmationCode_hasBlurred, confirmationCode_setHasBlurred] =
    useState(false);
  const confirmationCode_schema = yup.object({
    confirmationCode: yup
      .string()
      .matches(/^[0-9]*$/, "Digits only")
      .min(6, "Must be 6 digits")
      .max(6, "Must be 6 digits")
      .required(),
  });

  //-- Confirmation Code onChange Handler --//
  const confirmationCode_onChangeHandler = (event) => {
    //-- Set Value --//
    confirmationCode_setValue(event.target.value);
    //-- Validate value with yup --//
    confirmationCode_schema
      .validate({ confirmationCode: event.target.value })
      .then((value) => {
        confirmationCode_setValid(true);
        confirmationCode_setError(false);
      })
      .catch((err) => {
        confirmationCode_setValid(false);
        confirmationCode_setError(true);
        confirmationCode_setHelperText(err.errors);
      });
  };

  //-- ************************* --//
  //-- Password State and Schema --//
  const [password_visible, password_setVisible] = useState(false);
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

  //-- Conditions for preventing Update Password --//
  const disableUpdatePasswordButton =
    password_value === "" ||
    !confirmationCode_valid ||
    email_error ||
    password_error ||
    password_req1_error ||
    password_req2_error ||
    password_req3_error ||
    password_req4_error ||
    password_req5_error;

  //-- Update Password Handler --//
  const updatePasswordHandler = async () => {
    //-- Use Auth Utilities API to convert email to cognito_sub (username) via ListUsers  --//
    let url = "https://authutilities.chrt.com/update_password";
    let content = {
      email: email_value,
      confirmationCode: confirmationCode_value,
      password: password_value,
    };
    try {
      let res = await axios.post(url, content);
      if (res.data.success) {
        alert("Password update successful.");
        navigate("/signin");
      } else {
        alert(
          "Password update error. Please try again. If problem persists, please reach out for support. [" +
            res.data.errorMessage +
            "]"
        );
      }
    } catch (err) {
      console.log(err);
      alert("Error during request, please try again [" + err + "]");
    }
  };

  return (
    <MainContainer>
      {/* EMAIL INPUT */}
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
        disabled={email_disabled}
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

      {/* SEND CONFIRMATION CODE (BUTTON) */}
      <Button
        variant="contained"
        onClick={sendConfirmationCodeHandler}
        disabled={disableSendConfirmationCodeButton}
        sx={BUTTON_SX}
      >
        Send verification code
      </Button>

      {/* CONFIRMATION CODE INPUT */}
      <form>
        <TextField
          label="Verification Code"
          type="text"
          autoComplete="off"
          value={confirmationCode_value}
          error={
            confirmationCode_error &&
            confirmationCode_hasBlurred &&
            !confirmationCode_inFocus
          }
          helperText={
            confirmationCode_error &&
            confirmationCode_hasBlurred &&
            !confirmationCode_inFocus
              ? `${confirmationCode_helperText}`
              : "Check email for verification code"
          }
          color={confirmationCode_valid ? "success" : "warning"}
          onFocus={() => {
            confirmationCode_setInFocus(true);
          }}
          onChange={confirmationCode_onChangeHandler}
          onBlurCapture={() => {
            confirmationCode_setInFocus(false);
            confirmationCode_setHasBlurred(true);
          }}
          sx={TEXT_FIELD_SX}
        />
      </form>

      {/* NEW PASSWORD INPUT */}
      <form>
        <TextField
          // id="password"
          label="New Password"
          type={password_visible ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    password_setVisible((x) => !x);
                  }}
                >
                  {password_visible ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          autoComplete="off"
          error={password_error && password_hasBlurred && !password_inFocus}
          value={password_value}
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

      {/* PASSWORD REQUIREMENTS LIST */}
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

      {/* UPDATE PASSWORD (BUTTON) */}
      <Button
        variant="contained"
        onClick={updatePasswordHandler}
        disabled={disableUpdatePasswordButton}
        sx={BUTTON_SX}
      >
        UPDATE PASSWORD
      </Button>
    </MainContainer>
  );
}
