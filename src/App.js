import React from "react";
import classes from "./App.module.css";
import { Amplify, I18n } from "aws-amplify";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Layout from './layout/Layout'

const poolDate = {
  userPoolId: "us-east-1_qSuVlXKCf",
  userPoolWebClientId: "1kqueg45v60hm4aggobci2jf93",
};

Amplify.configure({
  Auth: { 
    region: "us-east-1", 
  ...poolDate
  }
});

// TODO: figure out how to integrate DHIS2 i18n with amplify
I18n.putVocabulariesForLanguage('en', {
  'Sign In': 'Crosscut Login', // Tab header
  'Sign in': 'Login', // Button label
  Password: 'Enter your password', // Password label
  'Forgot your password?': 'Reset Password',
});

const MyApp = () => {

  return (
    <Authenticator 
      className={classes.amplify} 
      signUpAttributes={['email', 'password', 'name']}
      loginMechanisms={['email']}
    >
      {(user) => (
          <div className={classes.container}>
          <Layout token={user?.user?.signInUserSession?.idToken?.jwtToken}/>
        </div>
      )}
    </Authenticator>
  );
};

export default MyApp;