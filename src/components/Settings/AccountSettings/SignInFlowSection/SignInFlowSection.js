//-- React --//
import { Fragment, useState, useRef } from "react";

// npm package Functions --//
import QRCode from "qrcode";

//-- AWS SDK --//
import freshCUPTokens from "../../../SDK_CLIENTS/freshCUPTokens";
import CognitoUserPools from "../../../SDK_CLIENTS/CognitoUserPools";
import {
  AssociateSoftwareTokenCommand,
  SetUserMFAPreferenceCommand,
} from "@aws-sdk/client-cognito-identity-provider";

//-- CHRT Components --//
import VerifyFirstTOTPCodeForm from "./VerifyFirstTOTPCodeForm";
import NewEmailForm from "./NewEmailForm";

//-- npm Package Components --//
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import CardActions from "@mui/material/CardActions";
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import EmailIcon from "@mui/icons-material/Email";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PasswordIcon from "@mui/icons-material/Password";
import SecurityIcon from "@mui/icons-material/Security";

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
} from "../../SettingsSX";

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
};
const INDENT_SX = {
  marginLeft: "16px",
  marginRight: "16px",
};
const GREY_BOX_2_SX = {
  display: "flex",
  justifyContent: "center",
  backgroundColor: "#ddd",
  marginY: "6px",
  paddingY: "6px",
  paddingX: "12px",
  borderRadius: "4px",
  width: "280px",
};

export default function SignInFlowSection(props) {
  //-- Props --//
  const {
    //-- Data --//
    getUser,
    email,
    mfaEnabled,
    mfaSettings,
  } = props;

  //-- Modal State, QR Code ref / variables --//
  const [modalOpen, setModalOpen] = useState(false);
  const qr_code_canvas_ref = useRef(null);

  //-- Enable MFA --//
  const enableMFA = async () => {
    const { accessToken } = await freshCUPTokens();
    try {
      let res = await CognitoUserPools.send(
        new AssociateSoftwareTokenCommand({ AccessToken: accessToken })
      );
      let qrCodeString = `otpauth://totp/${email}?secret=${res.SecretCode}&issuer=CHRT`;
      await QRCode.toDataURL(qr_code_canvas_ref.current, qrCodeString);
    } catch (err) {
      console.log(err);
    }
  };
  const enableMFAHandler = async () => {
    setModalOpen(true);
    await enableMFA();
  };

  //-- Disable MFA --//
  const disableMFA = async () => {
    //-- Set User MFA Preferences --//
    const { accessToken } = await freshCUPTokens();
    try {
      await CognitoUserPools.send(
        new SetUserMFAPreferenceCommand({
          AccessToken: accessToken,
          SoftwareTokenMfaSettings: {
            Enabled: false,
            PreferredMfa: false,
          },
        })
      );
      //-- Update mfa settings data to display to user --//
      getUser();
    } catch (err) {
      console.log(err);
    }
  };
  const disableMFAHandler = async () => {
    disableMFA();
  };

  //-- MFA Settings message and button --//
  const MFASettingsMessage = () => {
    if (mfaEnabled === "yes") {
      // TODO - bold text + align icon
      return (
        <Box sx={{ justifyContent: "center" }}>
          <Typography fontWeight="bold" color="#1565C0">
            MFA enabled (6-digit MFA code required at Sign In)
          </Typography>
        </Box>
      );
    } else {
      return (
        <Typography fontWeight="bold" color="#1565C0">
          MFA not enabled (no 6-digit MFA code required at Sign In)
        </Typography>
      );
    }
  };
  const MFAEnableOrDisableButton = () => {
    if (mfaEnabled === "no") {
      return (
        <Button
          variant="contained"
          sx={{ width: "225px" }}
          size="small"
          fullWidth
          onClick={enableMFAHandler}
          color="success"
        >
          Enable MFA
        </Button>
      );
    } else if (mfaEnabled === "yes") {
      return (
        <Button
          variant="contained"
          sx={{ width: "225px" }}
          size="small"
          onClick={disableMFAHandler}
          color="warning"
        >
          Disable MFA
        </Button>
      );
    } else {
      return <CircularProgress size={36} />;
    }
  };

  return (
    <Fragment>
      {/* TOTP Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={MODAL_BOX_SX}>
          <Box sx={GREY_BOX_2_SX}>
            <Typography sx={BOLD_SX}>
              Use a TOTP app to scan QR Code:
            </Typography>
          </Box>
          <canvas ref={qr_code_canvas_ref} />
          <Box sx={GREY_BOX_2_SX}>
            <Typography sx={BOLD_SX}>
              Enter code from TOTP app below:
            </Typography>
          </Box>
          <VerifyFirstTOTPCodeForm
            getUser={getUser}
            setModalOpen={setModalOpen}
          />
        </Box>
      </Modal>

      <Typography sx={BOLD_SX} variant={"h6"}>
        Sign In Flow
      </Typography>

      {/* EMAIL */}
      <Card variant="outlined">
        <CardHeader
          title="Email"
          avatar={<EmailIcon />}
          sx={{
            paddingBottom: "0px",
          }}
        />
        <CardContent
          sx={{
            paddingBottom: "0px",
          }}
        >
          {email ? (
            <Typography variant="body1" color="#1565C0" fontWeight={"bold"}>
              {email}
            </Typography>
          ) : (
            <CircularProgress size={24} />
          )}
        </CardContent>
        <CardActions>
          To change your email, please reach out to support@chrt.com from your
          CHRT account's current email listed abov
        </CardActions>
      </Card>

      {/* PASSWORD */}
      <Card variant="outlined">
        <CardHeader
          title="Password"
          avatar={<PasswordIcon />}
          sx={{
            paddingBottom: "0px",
          }}
        />
        <CardContent
          sx={{
            paddingBottom: "0px",
          }}
        >
          <Typography
            variant="body1"
            color="#1565C0"
            fontWeight="bold"
            fontStyle="italic"
          >
            password never displayed
          </Typography>
        </CardContent>
        <CardActions>
          <Typography>
            Use the{" "}
            <Link
              fontStyle="italic"
              underline="hover"
              display="inline"
              href={process.env.REACT_APP_HOMEPAGE_URL + "/forgotpassword"}
            >
              "Forgot Password?"
            </Link>{" "}
            page to update your password.
          </Typography>
        </CardActions>
      </Card>

      {/* MFA SETTINGS */}
      <Card variant="outlined">
        <CardHeader
          title="MFA (multi-factor authentication)"
          avatar={<SecurityIcon />}
          sx={{
            paddingBottom: "0px",
          }}
        />
        <CardContent
          sx={{
            paddingBottom: "0px",
          }}
        >
          {mfaSettings ? (
            <MFASettingsMessage />
          ) : (
            <CircularProgress size={24} />
          )}
          {/* TOTP DETAILS */}
          <Box sx={GREY_BOX_SX}>
            <Typography>
              MFA Strongly Recommended - multi-factor authentication
              dramatically increases your account's security. More about MFA
              <a
                target={"_blank"}
                rel="noreferrer" //-- Obscure legacy browser security thing for target=_blank --//
                href="https://resources.chrt.com/mfa"
              >
                <IconButton>
                  <OpenInNewIcon color="primary" />
                </IconButton>
              </a>
            </Typography>
            <Typography sx={BOLD_SX}>
              We support MFA via TOTP (time-based one-time password)
              applications. Popular applications include:
            </Typography>
            Google Authenticator ( iOS
            <a
              target={"_blank"}
              rel="noreferrer" //-- Obscure legacy browser security thing for target=_blank --//
              href="https://apps.apple.com/us/app/google-authenticator/id388497605"
            >
              <IconButton>
                <OpenInNewIcon color="primary" />
              </IconButton>
            </a>
            Android
            <a
              target={"_blank"}
              rel="noreferrer" //-- Obscure legacy browser security thing for target=_blank --//
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
            >
              <IconButton>
                <OpenInNewIcon color="primary" />
              </IconButton>
            </a>
            ), Twilio Authy ( iOS
            <a
              target={"_blank"}
              rel="noreferrer" //-- Obscure legacy browser security thing for target=_blank --//
              href="https://apps.apple.com/us/app/twilio-authy/id494168017"
            >
              <IconButton>
                <OpenInNewIcon color="primary" />
              </IconButton>
            </a>
            Android
            <a
              target={"_blank"}
              rel="noreferrer" //-- Obscure legacy browser security thing for target=_blank --//
              href="https://play.google.com/store/apps/details?id=com.authy.authy"
            >
              <IconButton>
                <OpenInNewIcon color="primary" />
              </IconButton>
            </a>
            MacOS / Windows / Linux
            <a
              target={"_blank"}
              rel="noreferrer" //-- Obscure legacy browser security thing for target=_blank --//
              href="https://authy.com/download/"
            >
              <IconButton>
                <OpenInNewIcon color="primary" />
              </IconButton>
            </a>
            )
          </Box>
        </CardContent>
        <CardActions>
          <MFAEnableOrDisableButton />
        </CardActions>
      </Card>
    </Fragment>
  );
}

// {
//   <Typography sx={BOLD_UNDERLINE_SX}>Email</Typography>
//       <Box sx={INDENT_SX}>
//         <Box sx={USER_DATA_BOX_SX}>
//           {email ? (
//             <Typography sx={BOLD_SX}>{email}</Typography>
//           ) : (
//             <CircularProgress size={24} />
//           )}
//         </Box>

//         <Box sx={GREY_BOX_SX}>
//           <Typography sx={BOLD_SX}>Changing your email:</Typography>
//           <Typography>
//             To change your email, please reach out to support@chrt.com from your
//             CHRT account's current email listed above
//           </Typography>
//         </Box>
//       </Box>
// }

// {/* <Typography sx={BOLD_UNDERLINE_SX}>Password</Typography>
// <Box sx={INDENT_SX}>
//   <Box sx={USER_DATA_BOX_SX}>
//     <Typography sx={BOLD_ITALIC_SX}>password never displayed</Typography>
//   </Box>
//   <Box sx={GREY_BOX_SX}>
//     <Typography sx={BOLD_SX}>Changing your password:</Typography>
//     <Typography>
//       Use the{" "}
//       <Link
//         fontStyle={"italic"}
//         underline={"hover"}
//         href={
//            process.env.REACT_APP_HOMEPAGE_URL + '/forgotpassword'
//         }
//       >
//         "Forgot Password?"
//       </Link>
//       {"  "} page to update your password.
//     </Typography>
//   </Box>
// </Box> */}

// {/* <Typography sx={BOLD_UNDERLINE_SX}>
// MFA (multi-factor authentication) Settings
// </Typography>
// <Box sx={INDENT_SX}>
// <Box sx={USER_DATA_BOX_SX}>
//   {mfaSettings ? (
//     <MFASettingsMessage />
//   ) : (
//     <CircularProgress size={24} />
//   )}
// </Box>

// <Box sx={CENTER_SX}>
//   <MFAEnableOrDisableButton />
// </Box> */}
