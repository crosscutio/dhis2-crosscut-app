const ATTRIBUTE_ID = "JTOrLhPcwuk"; // From local setup, need to find a way to get this
const ORG_UNIT_ID = "ImspTQPwCqd"; // From local setup, all of Sierra Leone

import React from "react";
import ky from "ky";

class AddCatchment extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <button onClick={this.click}>Add Catchment</button>;
  }
  async click() {
    const geojson = JSON.stringify({
      type: "Polygon",
      coordinates: [
        [
          [-13.414, 6.85],
          [-9.909, 6.85],
          [-9.909, 9.86],
          [-13.414, 9.86],
          [-13.414, 6.85],
        ],
      ],
    });

    const url = `http://localhost:8080/api/organisationUnits/${ORG_UNIT_ID}`;
    const res = await ky
      .patch(url, {
        headers: {
          Authorization: `Basic ${btoa('admin:district')}`
        },
        json: {
          op: "add",
          path: "/attributeValues/-",
          value: {
            value: geojson,
            attribute: {
              id: ATTRIBUTE_ID,
            },
          },
        },
      })
      .json();
    console.log(res);
    const unit = await ky(url, {
        headers: {
          Authorization: `Basic ${btoa('admin:district')}`
        },
      })
      .json();
    console.log(unit);
  }
}

export default AddCatchment;
