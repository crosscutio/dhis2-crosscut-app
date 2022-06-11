import React from "react";
import classes from "./App.module.css";
import { Card } from '@dhis2/ui'
import { Amplify, I18n } from "aws-amplify";
import { Authenticator, AmplifyProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Layout from './layout/Layout'
import i18n from './locales/index.js'
import { useConfig } from '@dhis2/app-runtime'
import { setupDHIS2Api } from "./api/requests";
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
  'Create Account': 'Create Account', // Tab header
  'Forgot your password?': 'Reset Password',
});

const formFields = {
  signIn: {
    username: {
      labelHidden: true,
      placeholder: i18n.t("Email"),
      isRequired: true,
    },
    password: {
      labelHidden: true,
      placeholder: i18n.t("Enter your password")
    }
  },
  signUp: {
    email: {
      labelHidden: true,
      placeholder: i18n.t("Email"),
      isRequired: true
    },
    password: {
      labelHidden: true,
      placeholder: i18n.t("Enter your password"),
      isRequired: true
    },
    name: {
      labelHidden: true,
      placeholder: i18n.t("Name"),
      isRequired: true
    }
  }
}

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
  const config = useConfig()
  setupDHIS2Api(config)

  const components = {
    Footer() {
      return (
        <Card>
        <div className={classes.instructions}>
          <p className={classes.instructionText}>{i18n.t("To use the Microplanning app, you need to log in to your Crosscut account. Don't have an account? You can create one for free by clicking the 'Create Account' tab above or visit ")}
          <a style={{ color: '#0d47a1'}} href="https://app.crosscut.io/" target="_blank" >app.crosscut.io</a>.
          </p>
          </div>
      </Card>
      )
    }
  }

  return (
    <AmplifyProvider
    theme={theme}
    >
      <Authenticator 
      formFields={formFields}
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
