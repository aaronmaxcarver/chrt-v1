//-- React --//
import { useState } from "react";

//-- npm Package Functions --//
import * as yup from "yup";

//-- AWS SDK --//
import CognitoUserPools from "../../../SDK_CLIENTS/CognitoUserPools";
import {
  SetUserMFAPreferenceCommand,
  VerifySoftwareTokenCommand,
} from "@aws-sdk/client-cognito-identity-provider";

//-- CHRT Components --//

//-- npm Package Components --//
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import freshCUPTokens from "../../../SDK_CLIENTS/freshCUPTokens";

const FORM_SX = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 1,
  gap: 1,
};

export default function VerifyFirstTOTPCodeForm(props) {
  const { getUser, setModalOpen } = props;

  //-- Text Field 1 state and schema --//
  const [value, setValue] = useState("");
  const [inFocus, setInFocus] = useState(false);
  const [hasBlurred, setHasBlurred] = useState(false);
  const [error, setError] = useState(false);

  const Schema = yup.object({
    id: yup
      .string()
      .required()
      .matches(/^[0-9]+$/)
      .min(6)
      .max(6),
    // id: yup.number().required(),
  });
  //-- Text Field 1 onChange Handler --//
  const onChangeHandler = (event) => {
    //-- Set Value --//
    setValue(event.target.value);
    //-- Validate value with yup --//
    Schema.isValid({ id: `${event.target.value}` }).then((x) => {
      if (x === true) {
        setError(false);
      }
      if (x === false) {
        setError(true);
      }
    });
  };

  //-- onSubmit - Submit TOTP Code and Enable MFA --//
  const submitHandler = async () => {
    //-- Verify First TOTP Code --//
    const { accessToken } = await freshCUPTokens();
    try {
      await CognitoUserPools.send(
        new VerifySoftwareTokenCommand({
          AccessToken: accessToken,
          UserCode: `${value}`,
        })
      );
      //-- Set User MFA Preferences --//
      try {
        await CognitoUserPools.send(
          new SetUserMFAPreferenceCommand({
            AccessToken: accessToken,
            SoftwareTokenMfaSettings: {
              Enabled: true,
              PreferredMfa: true,
            },
          })
        );
        setModalOpen(false);
      } catch (err) {
        console.log(err);
      }
      //-- Update mfa settings data to display to user --//
      getUser();
    } catch (err) {
      // logic to alert user of an error and prompt a user to retry?
      console.log(err);
    }
  };

  return (
    <Box sx={FORM_SX}>
      <TextField
        variant="outlined"
        label="6-digit code"
        error={hasBlurred && !inFocus && error}
        helperText={hasBlurred && !inFocus && error && "code must be 6 digits"}
        value={value}
        onChange={onChangeHandler}
        onFocus={() => {
          setInFocus(true);
        }}
        onBlurCapture={() => {
          setInFocus(false);
          setHasBlurred(true);
        }}
      />
      <Button
        variant="contained"
        onClick={submitHandler}
        //   fullWidth
      >
        Submit
      </Button>
    </Box>
  );
}
