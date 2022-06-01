import React, { useState, useEffect } from "react";
import classes from "./App.module.css";
import { Card } from '@dhis2/ui'
import { Amplify, I18n } from "aws-amplify";
import { Authenticator, AmplifyProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Layout from './layout/Layout'
import Popup from './components/Popup/Popup'
import ButtonItem from "./components/ButtonItem/ButtonItem";
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

// theme added to match the blue for text/tabs/buttons on the login page
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
  const [learnMoreModal, setLearnMoreModal] = useState(false)
  
  const handleLearnMore = () => {
    setLearnMoreModal(prevState => !prevState)
  }
  
  const learnMoreText = i18n.t("Creating a Crosscut account in the DHIS2 interface creates an account on Crosscut. This allows you to create and access your catchments on Crosscut and DHIS2.")

  const components = {
    Footer() {
      return (
        <Card>
        <div className={classes.instructions}>
        <div className={classes.instructionText}>
          <p>{i18n.t("To use this application, you need to log in to your Crosscut account. Don't have an account? Create a Crosscut account in Create Account or ")}
          <a style={{ color: '#0d47a1'}} href="https://app.crosscut.io/" target="_blank" >app.crosscut.io</a>.
          </p>
        </div>
        <div className={classes.learnBtn}>
          <ButtonItem handleClick={handleLearnMore} buttonText={i18n.t("Learn More")} small={true}/>
        </div>
        </div>
      </Card>
      )
    }
  }

  return (
    <AmplifyProvider
    theme={theme}
    >
      { learnMoreModal === true ? <Popup title={i18n.t("Learn More")} content={learnMoreText} setShow={setLearnMoreModal}/> : null }
      <Authenticator 
        className={classes.amplify} 
        components={components}
        signUpAttributes={buildFields(['email', 'password', 'name'])}
        loginMechanisms={buildFields(['email'])}
      >
        {(user) => (
            <div className={classes.container}>
            <Layout token={user?.user?.signInUserSession?.idToken?.jwtToken} user={user?.user?.attributes?.email}/>
          </div>
        )}
      </Authenticator>
    </AmplifyProvider>
    
  );
};

export default MyApp;
