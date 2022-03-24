import React from "react";
import classes from "./App.module.css";
import Amplify from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";
import Layout from './layout/Layout'

const poolDate = {
  userPoolId: "us-east-1_qSuVlXKCf",
  userPoolWebClientId: "1kqueg45v60hm4aggobci2jf93",
};

Amplify.configure(poolDate);

const query = {
  me: {
    resource: "me",
  },
};

const MyApp = (props) => {
  const token = props?.authData?.signInUserSession?.accessToken?.jwtToken;
  console.log(props);
  return (
    <div className={classes.container}>
      <Layout token={token}/>
    </div>
  );
};

export default withAuthenticator(MyApp);
