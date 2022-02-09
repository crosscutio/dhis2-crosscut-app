import React from 'react';
import ky from 'ky';

const CROSSCUT_API = 'https://qwui27io74.execute-api.us-east-1.amazonaws.com';

class ListCatchmentJobs extends React.Component {
  render() {
    console.log(this.props);
    return <div>hi</div>
  }
  async componentDidMount() {
    const url = `${CROSSCUT_API}/catchment-jobs`;
    const json= await ky(url, {
      mode: 'no-cors',
      headers: {
        authorization: this.props.token
      }
    }).json();
    console.log(json);
  }
}

export default ListCatchmentJobs;
