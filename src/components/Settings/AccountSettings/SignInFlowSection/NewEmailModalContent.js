//-- React --//
import { useState, Fragment } from "react";

//-- AWS SDK --//
import freshCUPTokens from "../../../SDK_CLIENTS/freshCUPTokens";
import CognitoUserPools from "../../../SDK_CLIENTS/CognitoUserPools";
import { VerifyUserAttributeCommand } from "@aws-sdk/client-cognito-identity-provider";

//-- CHRT Components --//

//-- npm Package Functions --//
import * as yup from "yup";

//-- npm Package Components --//
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function NewEmailModalContent(props) {
  //-- Props --//
  const { setVerifyNewEmailModalOpen } = props;

  //-- State and Schema --//
  const [value, setValue] = useState("");
  const [hasBlurred, setHasBlurred] = useState(false);
  const [inFocus, setInFocus] = useState(false);
  const [error, setError] = useState(false);
  const schema = yup.object({
    code: yup
      .string()
      .required()
      .matches(/^[0-9]+$/)
      .min(6)
      .max(6),
  });

  //-- onChange Handler --//
  const onChangeHandler = (event) => {
    setValue(event.target.value);
    schema.isValid({ code: `${event.target.value}` }).then((x) => {
      if (x === true) {
        setError(false);
      }
      if (x === false) {
        setError(true);
      }
    });
    //----//
  };

  //-- onSubmit Handler --//
  const onSubmitHandler = async () => {
    const { accessToken } = await freshCUPTokens();
    try {
      let res = await CognitoUserPools.send(
        new VerifyUserAttributeCommand({
          AccessToken: `${accessToken}`,
          AttributeName: "email",
          Code: `${value}`,
        })
      );
      console.log(res); // DEV
      setVerifyNewEmailModalOpen(false);
      // need to refactor to allow calling GetUserCommand to refresh data on screen
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      <Typography>Enter verification code:</Typography>
      <TextField
        id="newEmail_TextField"
        label="verification code"
        variant="outlined"
        value={value}
        error={hasBlurred && !inFocus && error}
        helperText={hasBlurred && !inFocus && error && "code must be 6 digits"}
        onChange={onChangeHandler}
        onFocus={() => {
          setInFocus(true);
        }}
        onBlurCapture={() => {
          setInFocus(false);
          setHasBlurred(true);
        }}
      />
      <Button variant="contained" onClick={onSubmitHandler} disabled={error}>
        Submit
      </Button>
    </Fragment>
  );
}
