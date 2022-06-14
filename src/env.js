export const getAmplifyPoolData = () => {
  const configProd = {
    userPoolId: "us-east-1_yG2VwDlFU",
    userPoolWebClientId: "75miae3s48vncm99i4m13j8ern",
  };

  const configStaging = {
    userPoolId: "us-east-1_qSuVlXKCf",
    userPoolWebClientId: "1kqueg45v60hm4aggobci2jf93",
  };
  let poolData = {};

  if (window.location.hostname === "localhost") {
    poolData = configStaging;
  } else {
    poolData = configProd;
  }

  return poolData;
};
