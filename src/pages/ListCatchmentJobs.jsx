import React, { useEffect, useState } from "react";
import ky from "ky";
import {
  Checkbox,
  TableHead,
  TableBody,
  DataTableRow,
  DataTable,
  DataTableCell,
  DataTableColumnHeader,
} from "@dhis2/ui";

const CROSSCUT_API = "https://qwui27io74.execute-api.us-east-1.amazonaws.com";

const CatchmentJob = (props) => {
  return (
    <DataTableRow selected={props.selected}>
      <DataTableCell width="48px">
        <Checkbox checked={props.selected} onChange={props.toggleSelected} value="id_1" />
      </DataTableCell>
      <DataTableCell>{props.name}</DataTableCell>
      <DataTableCell>{props.status}</DataTableCell>
    </DataTableRow>
  );
};

// function ListCatchmentJobs (props) {
//   const [jobs, setJobs] = useState()
//   useEffect(() => {
//     const url = `${CROSSCUT_API}/catchment-jobs`;
//     const { jobs } = await ky(url, {
//       mode: "cors",
//       headers: {
//         authorization: this.props.token,
//       },
//     }).json();
//     setJobs(jobs)
//   }, [])
//   return <div></div>
// }

class ListCatchmentJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { jobs: [], selected: null };
  }
  render() {
    const jobs = this.state.jobs.map((job) => (
      <CatchmentJob
        selected={this.state.selected === job.id}
        key={job.id}
        name={job.name}
        status={job.status}
        toggleSelected={() => this.toggleSelected(job.id)}
      />
    ));

    return (
      <DataTable>
        <TableHead>
          <DataTableRow>
            <DataTableColumnHeader width="48px"></DataTableColumnHeader>
            <DataTableColumnHeader>Name</DataTableColumnHeader>
            <DataTableColumnHeader>Status</DataTableColumnHeader>
          </DataTableRow>
        </TableHead>
        <TableBody>{jobs}</TableBody>
      </DataTable>
    );
  }
  toggleSelected(job) {
    const selected = this.state.selected === job ? null : job;
    this.setState({selected});
  }
  async componentDidMount() {
    const url = `${CROSSCUT_API}/catchment-jobs`;
    const { jobs } = await ky(url, {
      mode: "cors",
      headers: {
        authorization: this.props.token,
      },
    }).json();
    this.setState({ jobs });
  }
}

export default ListCatchmentJobs;
