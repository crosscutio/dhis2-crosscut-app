import React from "react";
import classes from "./App.module.css";
import { Amplify, I18n } from "aws-amplify";
import { Authenticator, AmplifyProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Layout from './layout/Layout'
import i18n from './locales/index.js'

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

const buildFields = (fields) => {
  return fields.map((field) => {
    return i18n.t(field)
  })
}

const theme = {
  name: 'dhis2-theme',
  tokens: {
    components: {
      button: {
        link: {
          color: {
            value: '#0d47a1'
          }
        },
        primary: {
          background: {
            color: {
              value: '#0d47a1'
            }
          }
        },
        _hover: {
          color: {
            value: '#0d47a1'
          }
        }
      },
      tabs: {
        item: {
          _hover: {
            color: {
              value: '#0d47a1'
            }
          },
          _active: {
            color: {
              value: '#0d47a1'
            },
            border: {
              color: {
                value: '#0d47a1'
              }
            },
          },
          _focus: {
            color: {
              value: '#0d47a1'
            },
          }
        }
      }
    }
  }
}
const MyApp = () => {

  return (
    <AmplifyProvider
    theme={theme}
    >
      <Authenticator 
        className={classes.amplify} 
        signUpAttributes={buildFields(['email', 'password', 'name'])}
        loginMechanisms={buildFields(['email'])}
      >
        {(user) => (
            <div className={classes.container}>
            <Layout token={user?.user?.signInUserSession?.idToken?.jwtToken}/>
          </div>
        )}
      </Authenticator>
    </AmplifyProvider>
  );
};

export default MyApp;
