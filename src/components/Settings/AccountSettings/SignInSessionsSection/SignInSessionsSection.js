//-- React --//
import { Fragment, useState, useEffect } from "react";

//-- AWS SDK --//
import freshCUPTokens from "../../../SDK_CLIENTS/freshCUPTokens";
import CognitoUserPoolsClient from "../../../SDK_CLIENTS/CognitoUserPools";
import { ListDevicesCommand } from "@aws-sdk/client-cognito-identity-provider";

//-- CHRT Components --//

//-- npm Package Functions --//
import { format, getUnixTime, add } from "date-fns";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//-- npm Package Components --//
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import LaptopChromebookIcon from "@mui/icons-material/LaptopChromebook";
import LaptopIcon from "@mui/icons-material/Laptop";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

//-- SX --//
import {
  MAIN_SX,
  DIVIDER_SX,
  BOLD_SX,
  BOLD_BLUE_SX,
  BOLD_ITALIC_SX,
  BOLD_ITALIC_BLUE_SX,
  BOLD_UNDERLINE_SX,
  USER_DATA_BOX_SX,
  GREY_BOX_SX,
  INPUT_AND_BUTTON_SX,
  CENTER_SX,
} from "../../SettingsSX";

const ROW_SX = {
  display: "grid",
  height: "100%",
  width: "100%",
  gridTemplateRows: "100%",
  gridTemplateColumns: "2fr 1fr",
  gridTemplateAreas: `"LHS RHS"`,
  backgroundColor: "#def",
  marginBottom: "8px",
  borderRadius: "8px",
};
const ROW_LHS_SX = {
  gridArea: "LHS",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};
const ROW_RHS_SX = {
  gridArea: "RHS",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

export default function SignInSessionsSection() {
  //-- Devices List --//
  const [devicesList, setDevicesList] = useState();
  let activeSessionsDeviceKeys;

  const getSortedDevicesList = async () => {
    //-- (0) Get fresh tokens --//
    const { idToken, accessToken, key } = await freshCUPTokens();

    //-- (1) Get Active Sessions Device Keys from DynamoDB --//
    try {
      let url = "https://authutilities.chrt.com/getsessionsdevicekeys";
      let content = { idToken: idToken };
      let headersObject = {
        authorization: idToken,
      };
      let res = await axios.post(url, content, {
        headers: headersObject,
      });
      activeSessionsDeviceKeys = res.data.activeSessionsDeviceKeys;
    } catch (err) {
      console.log(err);
      alert(
        "Error occurred, please refresh the page. If the error persists, please reach out for support and include this error message: [" +
          err +
          "]"
      );
    }

    //-- (2) Get Remembered Devices List from Cognito --//
    try {
      let listDevicesResponse = await CognitoUserPoolsClient.send(
        new ListDevicesCommand({
          AccessToken: accessToken,
        })
      );
      //-- Sort devices in descending order by last authenticated date --//
      let devices = listDevicesResponse.Devices.sort(
        (firstItem, secondItem) => {
          return (
            getUnixTime(secondItem.DeviceLastAuthenticatedDate) -
            getUnixTime(firstItem.DeviceLastAuthenticatedDate)
          );
        }
      );

      //-- (3) Set activeSession anc currentSession attributes --//
      devices.forEach((item) => {
        //-- activeSession --//
        if (activeSessionsDeviceKeys.includes(item.DeviceKey)) {
          item.activeSession = true;
        } else {
          item.activeSession = false;
        }
        //-- currentSession --//
        if (item.DeviceKey === key) {
          item.currentSession = true;
        } else {
          item.currentSession = false;
        }
      });

      //-- (4) Set state --//
      //-- ************* --//
      setDevicesList(devices);
    } catch (err) {
      console.log(err);
      alert(
        "Error occurred, please refresh the page. If the error persists, please reach out for support and include this error message: [" +
          err +
          "]"
      );
    }
  };
  useEffect(() => {
    getSortedDevicesList();
  }, []);

  //-- Devices with Active Session Table --//
  //-- ********************************* --//
  const SessionsTable = () => {
    return (
      <List dense>
        {devicesList.map((item) => {
          return (
            <Box sx={ROW_SX}>
              {/* Row Left-Hand Side */}
              <Box sx={ROW_LHS_SX}>
                <DeviceInfo item={item} />
              </Box>

              {/* Row Right-Hand Side */}
              <Box sx={ROW_RHS_SX}>
                {item.activeSession ? null : (
                  <Typography sx={{ fontWeight: 600 }}>
                    Expired Session
                  </Typography>
                )}
                {item.currentSession ? (
                  <Typography variant="body1" fontWeight="900" color="primary">
                    Current Session
                  </Typography>
                ) : null}
                {item.currentSession ? (
                  <SignOutButton />
                ) : (
                  <RevokeSessionButton item={item} />
                )}
              </Box>
            </Box>
          );
        })}
      </List>
    );
  };

  //-- Device Rows --//
  //-- ************ --//
  const DeviceInfo = (props) => {
    let { item } = props;

    //-- Device Details --//
    let device = item.DeviceAttributes[1].Value;
    let simplifiedDevice = device.split(/\((.+?)\)/)[1];
    let ipAddress = item.DeviceAttributes[2].Value;
    let deviceKey = item.DeviceKey;
    let chrtDeviceID = deviceKey.split(/_/)[1];

    //-- Icon --//
    let DeviceIcon = (props) => {
      let { item } = props;
      let iconColor;

      //-- Determine icon color based on activeSession attribute --//
      if (item.activeSession === true) {
        iconColor = "primary";
      } else {
        iconColor = "warning";
      }

      //-- Use regex matches to determine device type --//
      if (device.match(/iPhone/)) {
        return <PhoneIphoneIcon color={iconColor} />;
      } else if (device.match(/Windows/) || device.match(/Ubuntu/)) {
        return <LaptopIcon color={iconColor} />;
      } else if (device.match(/Macintosh/)) {
        return <LaptopMacIcon color={iconColor} />;
      } else if (device.match(/Android/)) {
        return <SmartphoneIcon color={iconColor} />;
      } else if (device.match(/iPad/)) {
        return <TabletMacIcon color={iconColor} />;
      } else if (device.match(/CrOs/)) {
        return <LaptopChromebookIcon color={iconColor} />;
      } else {
        return <QuestionMarkIcon color={iconColor} />;
      }
    };

    //-- Text --//
    let BOLD_UNDERLINE_BLUE_SX = {
      fontWeight: 600,
      textDecoration: "underline",
      color: "#1565c0",
    };

    let DeviceDetails = () => {
      return (
        <>
          <Typography
            variant="body1"
            color={item.activeSession ? "primary.main" : "warning.main"}
            fontWeight="900"
            // fontStyle=""
          >
            {simplifiedDevice}
          </Typography>
          <Typography
            fontSize="small"
            variant="caption"
            color={item.activeSession ? "primary.main" : "warning.main"}
            fontWeight="900"
            fontStyle="italic"
          >
            IP Address: {ipAddress}
          </Typography>
        </>
      );
    };
    let SessionExpiration = () => {
      //-- Calculate expiration date --//
      let expirationDate = add(item.DeviceLastAuthenticatedDate, { days: 42 });

      return (
        <Typography
          fontSize={"small"}
          variant="caption"
          color={item.activeSession ? "primary.main" : "warning.main"}
          fontWeight="900"
          // fontStyle=""
        >
          Expires on: {format(expirationDate, "eee. MMM dd, yyyy")}
          <br />
        </Typography>
      );
    };
    let LastSignIn = () => {
      return (
        <Typography
          fontSize={"small"}
          variant="caption"
          color={item.activeSession ? "primary.main" : "warning.main"}
          fontWeight="900"
          // fontStyle=""
        >
          Last Sign In:{" "}
          {format(item.DeviceLastAuthenticatedDate, "eee. MMM dd, yyyy @ pppp")}
          <br />
        </Typography>
      );
    };
    // let FirstSignIn = () => {
    //   return (
    //     <Typography
    //       fontSize={"small"}
    //       variant="caption"
    //       color={item.activeSession ? "primary.main" : "warning.main"}
    //       fontWeight="900"
    //       // fontStyle=""
    //     >
    //       First Sign In:{" "}
    //       {format(item.DeviceCreateDate, "eee. MMM dd, yyyy @ pppp")}
    //       <br />
    //     </Typography>
    //   );
    // };
    let CHRTDeviceID = () => {
      return (
        <Typography
          fontSize={"small"}
          variant="caption"
          color={item.activeSession ? "primary.main" : "warning.main"}
          fontWeight="900"
          // fontStyle=""
        >
          CHRT Device ID: {chrtDeviceID}
        </Typography>
      );
    };

    //-- Component Return --//
    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <DeviceIcon item={item} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={<DeviceDetails />}
          secondary={
            <>
              {item.activeSession ? <SessionExpiration /> : null}
              <LastSignIn />
              {/* <FirstSignIn /> */}
              <CHRTDeviceID />
            </>
          }
        />
      </ListItem>
    );
  };

  //-- ********************* --//
  //-- Revoke Session Button --//
  const RevokeSessionButton = (props) => {
    let { item } = props;
    return (
      <Button
        variant="contained"
        color={item.activeSession ? "primary" : "warning"}
        onClick={() => {
          revokeSession(item);
        }}
      >
        {item.activeSession ? "Revoke Session" : "Delete Session"}
      </Button>
    );
  };
  //-- Revoke Session Function --//
  const revokeSession = async (item) => {
    let { idToken, accessToken } = await freshCUPTokens();
    //-- Prep axios call params --//
    let url = "https://authutilities.chrt.com/revokesession"; //-- Lambda proxy for chrtRevokeRefreshToken --//
    let content = {
      accessToken: accessToken,
      deviceKey: item.DeviceKey, //-- Note - send key of device to revoke session for (not always for this device) --//
      idToken: idToken,
      //-- Note - omit refresh token except for when revokesession called during Sign Out --//
    };
    let headersObject = {
      authorization: idToken,
    };

    //-- Send Axios POST request to Auth Utilities API --//
    try {
      await axios.post(url, content, {
        headers: headersObject,
      });
    } catch (err) {
      throw new Error(
        "axios error during Auth Utilities API Sessions Manager request"
      );
    }
    getSortedDevicesList(); // await this or no??
  };

  //-- Sign Out Function --//
  //-- React Router navigation --//
  let navigate = useNavigate();
  const SignOutButton = () => {
    return (
      <Button
        variant="contained"
        onClick={() => {
          navigate("/signout");
        }}
      >
        SIGN OUT
      </Button>
    );
  };

  return (
    <Fragment>
      <Typography sx={BOLD_SX} variant={"h4"}>
        Active Sessions
      </Typography>

      <Typography>
        Your account enables you to have 4 active sessions, intended for a
        single end-user.
      </Typography>

      {/* SESSIONS TABLE */}
      <Typography sx={BOLD_UNDERLINE_SX}>
        Devices with Active Sessions
      </Typography>
      <Box>
        {devicesList ? (
          <SessionsTable />
        ) : (
          <Box sx={CENTER_SX}>
            <CircularProgress />
          </Box>
        )}
      </Box>

      {/* Sessions details */}
      <Typography sx={BOLD_SX}>A sessions begins at Sign In.</Typography>
      <Typography sx={BOLD_SX}>A sessions ends in one of four ways:</Typography>

      <Typography>(1) At Sign Out (session expires immediately)</Typography>

      <Typography>
        (2) When you revoke a session (session may remain usable for up to one
        hour before it expires, but is immediately removed from Active Sessions
        count)
      </Typography>

      <Typography>(3) Automatically 42 days after Sign In</Typography>

      <Typography>
        (4) When 4 active sessions exist at Sign In (the device with the least
        recent sign in time has its session revoked automatically)
      </Typography>
    </Fragment>
  );
}
