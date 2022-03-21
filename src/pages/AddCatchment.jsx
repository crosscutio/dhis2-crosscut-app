const ATTRIBUTE_ID = "JTOrLhPcwuk"; // From local setup, need to find a way to get this
const ORG_UNIT_ID = "BV4IomHvri4"; // From local setup, all of Sierra Leone

import React from "react";
import ky from "ky";

function AddCatchment (props) {
  const handleClick = async () => {
    const geojson = JSON.stringify({
      type: "Polygon",
      coordinates: [
        [
          [-11.194, 7.884],
          [-11.192, 7.87],
          [-11.177, 7.875],
          [-11.194, 7.884],
        ],
      ],
    });

    const url = `http://localhost:8080/api/organisationUnits/${ORG_UNIT_ID}`;
    const res = await ky
      .patch(url, {
        headers: {
          Authorization: `Basic ${btoa("admin:district")}`,
          "content-type": "application/json-patch+json",
        },
        body: JSON.stringify([{
          op: "add",
          path: "/attributeValues/-",
          value: {
            value: geojson,
            attribute: {
              id: ATTRIBUTE_ID,
            },
          },
        }]),
      }).json();

    const unit = await ky(url, {
      headers: {
        Authorization: `Basic ${btoa("admin:district")}`,
      },
    }).json();
  }

  return <button onClick={handleClick}>Add Catchment</button>
}
// class AddCatchment extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     return <button onClick={this.click}>Add Catchment</button>;
//   }
//   async click() {
//     const geojson = JSON.stringify({
//       type: "Polygon",
//       coordinates: [
//         [
//           [-11.194, 7.884],
//           [-11.192, 7.87],
//           [-11.177, 7.875],
//           [-11.194, 7.884],
//         ],
//       ],
//     });

//     const url = `http://localhost:8080/api/organisationUnits/${ORG_UNIT_ID}`;
//     const res = await ky
//       .patch(url, {
//         headers: {
//           Authorization: `Basic ${btoa("admin:district")}`,
//           "content-type": "application/json-patch+json",
//         },
//         body: JSON.stringify([{
//           op: "add",
//           path: "/attributeValues/-",
//           value: {
//             value: geojson,
//             attribute: {
//               id: ATTRIBUTE_ID,
//             },
//           },
//         }]),
//       })
//       .json();
//     console.log(res);
//     const unit = await ky(url, {
//       headers: {
//         Authorization: `Basic ${btoa("admin:district")}`,
//       },
//     }).json();
//     console.log(unit);
//   }
// }

export default AddCatchment;
