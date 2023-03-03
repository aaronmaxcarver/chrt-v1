//-- React --//
import { useState, Fragment } from "react";

//-- AWS SDK --//
import freshCUPTokens from "../../../SDK_CLIENTS/freshCUPTokens";
import CognitoUserPools from "../../../SDK_CLIENTS/CognitoUserPools";
import { UpdateUserAttributesCommand } from "@aws-sdk/client-cognito-identity-provider";

//-- CHRT Components --//
import NewEmailModalContent from "./NewEmailModalContent";

//-- npm Package Functions --//
import * as yup from "yup";

//-- npm Package Components --//
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

const MODAL_BOX_SX = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
  padding: 2,
  borderRadius: "4px",
  height: "420px",
  width: "300px",
  gap: 1.5,
};

export default function NewEmailForm() {
  //-- New Email State --//
  const [newEmailValue, setNewEmailValue] = useState("");
  const [newEmailIsValid, setNewEmailIsValid] = useState(false);
  //-- yup Validation Schema --//
  let newEmailSchema = yup.object({
    newEmail: yup.string().email(),
  });
  //-- New Email onChange Handler --//
  const newEmailOnChangeHandler = (event) => {
    //-- Set State for newEmailValue --//
    setNewEmailValue(event.target.value);

    //-- Set State for newEmailIsValid --//
    newEmailSchema.isValid({ newEmail: `${event.target.value}` }).then((x) => {
      if (x === true) {
        setNewEmailIsValid(true);
      }
      if (x === false) {
        setNewEmailIsValid(false);
      }
    });
    //----//
  };

  //-- verifyNewEmailModalOpen State --//
  const [verifyNewEmailModalOpen, setVerifyNewEmailModalOpen] = useState(false);
  //-- Update Email Command --//
  const updateEmailCommand = async () => {
    const { accessToken } = await freshCUPTokens();
    try {
      await CognitoUserPools.send(
        new UpdateUserAttributesCommand({
          AccessToken: `${accessToken}`,
          UserAttributes: [
            {
              Name: "email",
              Value: `${newEmailValue}`,
            },
          ],
        })
      );
      setVerifyNewEmailModalOpen(true);
      setNewEmailValue("");
    } catch (err) {
      console.log(err);
    }
  };

  //-- Update Email Handler--//
  const updateEmailHandler = async () => {
    await updateEmailCommand();
  };

  return (
    <Fragment>
      <Modal
        open={verifyNewEmailModalOpen}
        onClose={() => {
          setVerifyNewEmailModalOpen(false);
        }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={MODAL_BOX_SX}>
          <NewEmailModalContent
            setVerifyNewEmailModalOpen={setVerifyNewEmailModalOpen}
          />
        </Box>
      </Modal>

      <TextField
        variant="outlined"
        size="small"
        label="New Email"
        fullWidth
        onChange={newEmailOnChangeHandler}
        value={newEmailValue}
      />
      <Button
        variant="contained"
        sx={{ width: "150px" }}
        onClick={updateEmailHandler}
        disabled={!newEmailIsValid || newEmailValue.length === 0}
      >
        SUBMIT
      </Button>
    </Fragment>
  );
}
