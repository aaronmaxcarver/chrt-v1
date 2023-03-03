//-- AWS SDK --//
import { S3Client as S3Client_ } from "@aws-sdk/client-s3";

import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

//-- Constants --//
const REGION = "us-east-1";
const USER_POOL_ID = "us-east-1_nGMFSXaES";

//-- Get idToken from localStorage --//
const cognito_sub = localStorage.getItem("chrt-currentUser-cognito_sub") || "";
let idToken = localStorage.getItem(`chrt-${cognito_sub}-idToken`) || "";

//-- Build credentials params object --//
let credentialsParams = {
  clientConfig: { region: REGION }, //-- for CognitoIdentityClient --//
  identityPoolId: "us-east-1:4d74b742-ede3-4fcc-a691-f49ea4bddac0",
  logins: {
    [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken,
  },
};

//-- This function is called to provide the SDK Client with the new idToken --//
//-- (It's exported so it can be called by freshCUPTokens() upon exchange of refreshToken for idToken) --//
export function freshIDToken_S3Client(newIDToken) {
  credentialsParams.logins[
    `cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`
  ] = newIDToken;
}

//-- S3 SDK Client --//
const S3Client = new S3Client_({
  region: REGION,
  credentials: fromCognitoIdentityPool(credentialsParams),
});

export default S3Client;
