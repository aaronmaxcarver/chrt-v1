// //-- React --//
// import { useState } from "react";

// //-- AWS SDK --//

// //-- CHRT Components --//
// import MainContainer from "../MainContainer/MainContainer";

// //-- npm Package Functions --//
// import * as yup from "yup";

// //-- npm Package Components --//
// import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import Link from "@mui/material/Link";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import Tooltip from "@mui/material/Tooltip";
// import Typography from "@mui/material/Typography";

// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import HighlightOffIcon from "@mui/icons-material/HighlightOff";
// import InfoIcon from "@mui/icons-material/Info";

// //-- localStorage --//

// //-- SX --//
// const MARGIN_SX = {
//   marginY: "8px",
// };
// const TEXT_FIELD_SX = {
//   marginX: "8px",
//   marginY: "8px",
//   width: "336px",
// };
// const BUTTON_SX = {
//   marginX: "8px",
//   marginY: "8px",
//   width: "300px",
// };
// const LIST_ITEM_ICON_SX = { minWidth: "0px", marginRight: "8px" };

// export default function SignUp() {
//   //-- Email State and Schema --//
//   const [email_value, email_setValue] = useState("");
//   const [email_error, email_setError] = useState(false);
//   const [email_helperText, email_setHelperText] = useState(false);
//   const [email_inFocus, email_setInFocus] = useState(false);
//   const [email_hasBlurred, email_setHasBlurred] = useState(false);
//   const email_schema = yup.object({
//     email: yup
//       .string()
//       .email("Must be valid email (i.e. ___@__.__)")
//       .required("Email required"),
//   });
//   //-- Password State and Schema--//
//   const [password_value, password_setValue] = useState("");
//   const [password_error, password_setError] = useState(false);
//   const [password_inFocus, password_setInFocus] = useState(false);
//   const [password_hasBlurred, password_setHasBlurred] = useState(false);
//   const password_schema = yup.object({
//     password: yup.string().required("Password required"),
//   });

//   //-- req1 --//
//   const password_req1 = "at least 8 characters";
//   const [password_req1_error, password_req1_setError] = useState(true);
//   const password_req1_schema = yup.object({
//     password: yup.string().min(8),
//   });
//   //-- req2 --//
//   const password_req2 = "contains a lowercase character";
//   const [password_req2_error, password_req2_setError] = useState(true);
//   const password_req2_schema = yup.object({
//     password: yup.string().matches(/[a-z]/),
//   });
//   //-- req3 --//
//   const password_req3 = "contains an uppercase character";
//   const [password_req3_error, password_req3_setError] = useState(true);
//   const password_req3_schema = yup.object({
//     password: yup.string().matches(/[A-Z]/),
//   });
//   //-- req4 --//
//   const password_req4 = "contains a number";
//   const [password_req4_error, password_req4_setError] = useState(true);
//   const password_req4_schema = yup.object({
//     password: yup.string().matches(/[0-9]/),
//   });
//   //-- req5 --//
//   const password_req5 = "contains a special character";
//   const [password_req5_error, password_req5_setError] = useState(true);
//   const password_req5_schema = yup.object({
//     password: yup.string().matches(/[\^$*.[\]{}()?\-"!@#%&\/\\,><':;\|_~`\+=]/),
//   });

//   //-- Email onChange Handler --//
//   const email_onChangeHandler = (event) => {
//     //-- Set Value --//
//     email_setValue(event.target.value);

//     //-- Validate value with yup --//
//     email_schema
//       .validate({ email: event.target.value })
//       .then((value) => {
//         email_setError(false);
//       })
//       .catch((err) => {
//         email_setError(true);
//         email_setHelperText(err.errors);
//       });
//   };
//   //-- Password onChange Handler --//
//   const password_onChangeHandler = (event) => {
//     //-- Set Value --//
//     password_setValue(event.target.value);

//     //-- Validate password value with yup --//
//     password_schema
//       .validate({ password: event.target.value })
//       .then((value) => {
//         password_setError(false);
//       })
//       .catch((err) => {
//         password_setError(true);
//         // password_setHelperText(err.errors);
//       });

//     //-- Check password req1 --//
//     password_req1_schema
//       .validate({ password: event.target.value })
//       .then((value) => {
//         password_req1_setError(false);
//       })
//       .catch((err) => {
//         password_req1_setError(true);
//       });
//     //-- Check password req2 --//
//     password_req2_schema
//       .validate({ password: event.target.value })
//       .then((value) => {
//         password_req2_setError(false);
//       })
//       .catch((err) => {
//         password_req2_setError(true);
//       });
//     //-- Check password req3 --//
//     password_req3_schema
//       .validate({ password: event.target.value })
//       .then((value) => {
//         password_req3_setError(false);
//       })
//       .catch((err) => {
//         password_req3_setError(true);
//       });
//     //-- Check password req4 --//
//     password_req4_schema
//       .validate({ password: event.target.value })
//       .then((value) => {
//         password_req4_setError(false);
//       })
//       .catch((err) => {
//         password_req4_setError(true);
//       });
//     //-- Check password req5 --//
//     password_req5_schema
//       .validate({ password: event.target.value })
//       .then((value) => {
//         password_req5_setError(false);
//       })
//       .catch((err) => {
//         password_req5_setError(true);
//       });
//   };

//   //-- onSubmit Handler --//
//   const disableSignUpButton =
//     email_error ||
//     password_error ||
//     password_req1_error ||
//     password_req2_error ||
//     password_req3_error ||
//     password_req4_error ||
//     password_req5_error;

//   const onSubmitHandler = () => {
//     console.log("email: " + email_value + " password: " + password_value); // DEV
//     // TODO - Cognito API calls
//   };

//   return (
//     <MainContainer>
//       <Typography variant="h6" sx={MARGIN_SX}>
//         Sign up with a new account
//       </Typography>
//       <TextField
//         // id="email"
//         label="Email"
//         variant="outlined"
//         error={email_error && email_hasBlurred && !email_inFocus}
//         helperText={
//           email_error &&
//           email_hasBlurred &&
//           !email_inFocus &&
//           `${email_helperText}`
//         }
//         value={email_value}
//         onFocus={() => {
//           email_setInFocus(true);
//         }}
//         onChange={email_onChangeHandler}
//         onBlurCapture={() => {
//           email_setInFocus(false);
//           email_setHasBlurred(true);
//         }}
//         sx={TEXT_FIELD_SX}
//       />
//       <TextField
//         // id="password"
//         label="Password"
//         type="password"
//         variant="outlined"
//         error={password_error && password_hasBlurred && !password_inFocus}
//         value={password_value}
//         onFocus={() => {
//           password_setInFocus(true);
//         }}
//         onChange={password_onChangeHandler}
//         onBlurCapture={() => {
//           password_setInFocus(false);
//           password_setHasBlurred(true);
//         }}
//         sx={TEXT_FIELD_SX}
//       />
//       <Box>
//         <List dense>
//           {/* Req 1 */}
//           <ListItem>
//             <ListItemIcon sx={LIST_ITEM_ICON_SX}>
//               {password_req1_error ? (
//                 <HighlightOffIcon color="warning" fontSize="small" />
//               ) : (
//                 <CheckCircleOutlineIcon color="success" fontSize="small" />
//               )}
//             </ListItemIcon>
//             <Typography>{password_req1}</Typography>
//           </ListItem>

//           {/* Req 2 */}
//           <ListItem>
//             <ListItemIcon sx={LIST_ITEM_ICON_SX}>
//               {password_req2_error ? (
//                 <HighlightOffIcon color="warning" fontSize="small" />
//               ) : (
//                 <CheckCircleOutlineIcon color="success" fontSize="small" />
//               )}
//             </ListItemIcon>
//             <Typography>{password_req2}</Typography>
//           </ListItem>

//           {/* Req 3 */}
//           <ListItem>
//             <ListItemIcon sx={LIST_ITEM_ICON_SX}>
//               {password_req3_error ? (
//                 <HighlightOffIcon color="warning" fontSize="small" />
//               ) : (
//                 <CheckCircleOutlineIcon color="success" fontSize="small" />
//               )}
//             </ListItemIcon>
//             <Typography>{password_req3}</Typography>
//           </ListItem>

//           {/* Req 4 */}
//           <ListItem>
//             <ListItemIcon sx={LIST_ITEM_ICON_SX}>
//               {password_req4_error ? (
//                 <HighlightOffIcon color="warning" fontSize="small" />
//               ) : (
//                 <CheckCircleOutlineIcon color="success" fontSize="small" />
//               )}
//             </ListItemIcon>
//             <Typography>{password_req4}</Typography>
//           </ListItem>

//           {/* Req 5 */}
//           <ListItem>
//             <ListItemIcon sx={LIST_ITEM_ICON_SX}>
//               {password_req5_error ? (
//                 <HighlightOffIcon color="warning" fontSize="small" />
//               ) : (
//                 <CheckCircleOutlineIcon color="success" fontSize="small" />
//               )}
//             </ListItemIcon>
//             <Typography>{password_req5}</Typography>
//             <Tooltip
//               placement="top-end"
//               title={
//                 <Typography>
//                   {`^ $ * . [ ] { } ( ) ? - " ! @ # % & / \\ , > < ' : ; | _ ~ \` + =`}
//                 </Typography>
//               }
//             >
//               <InfoIcon htmlColor="#555" sx={{ marginLeft: "58px" }} />
//             </Tooltip>
//           </ListItem>
//         </List>
//       </Box>
//       <Button
//         variant={"contained"}
//         onClick={onSubmitHandler}
//         disabled={disableSignUpButton}
//         sx={BUTTON_SX}
//       >
//         SIGN UP
//       </Button>
//       <Typography variant="body2" sx={MARGIN_SX}>
//         Already have an account?{" "}
//         <Link href="https://authz.chrt.com/signin" underline="none">
//           Sign In
//         </Link>
//       </Typography>
//     </MainContainer>
//   );
// }

// // TODO - icon in typography instead of not-so-dense list?
