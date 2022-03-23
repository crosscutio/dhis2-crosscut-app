import React, { useEffect, useState } from "react";
import ky from "ky";
import ButtonItem from "../components/ButtonItem/ButtonItem";
import {
  Card,
  TableCell,
  TableHead,
  TableBody,
  DataTableRow,
  DataTable,
  DataTableCell,
  Button,
  DataTableColumnHeader,
  IconFileDocument24,
  IconDelete24
} from "@dhis2/ui";
import styles from './ListCatchmentJobs.module.css'

const CROSSCUT_API = "https://qwui27io74.execute-api.us-east-1.amazonaws.com";

const CatchmentJob = (props) => {
  return (
    <DataTableRow selected={props.selected}>
      {/* <DataTableCell width="48px">
        <Checkbox checked={props.selected} onChange={props.toggleSelected} value="id_1" />
      </DataTableCell> */}
      {/* <TableCell><TableButton/></TableCell> */}
      <DataTableCell width="48px"><ButtonItem buttonText={<IconFileDocument24/>} borderless={true}/></DataTableCell>
      <DataTableCell dense>{props.name}</DataTableCell>
      <DataTableCell>{props.status}</DataTableCell>
      <DataTableCell>Date</DataTableCell>
      <DataTableCell><ButtonItem buttonText={"Send"} primary={true}/></DataTableCell>
      <DataTableCell width="48px" dense><ButtonItem buttonText={<IconDelete24/>} borderless={true}/></DataTableCell>
    </DataTableRow>
  );
};

class ListCatchmentJobs extends React.Component {

  constructor(props) {
    super(props);
    this.state = { jobs: [], selected: null };
  }

  // const [jobs, setJobs] = useState([])
  render() {
    const jobs = this.state.jobs.map((job) => (
      <CatchmentJob
        selected={this.state.selected === job.id}
        key={job.id}
        name={job.name}
        status={job.status}
      />
    ));

    const onSortIconClick = (e, b) => {
      console.log(e, b)
    }
    return (
      <div className={styles.container}>
      <Card>
        <DataTable>
          <TableHead>
            <DataTableRow>
              <DataTableColumnHeader fixed top="0" width="48px"></DataTableColumnHeader>
              <DataTableColumnHeader fixed top="0" name="name" sortIconTitle="sort by name" onSortIconClick={onSortIconClick} sortDirection="default">Name</DataTableColumnHeader>
              <DataTableColumnHeader fixed top="0" name="status" sortIconTitle="sort by status" onSortIconClick={onSortIconClick} sortDirection="desc">Status</DataTableColumnHeader>
              <DataTableColumnHeader fixed top="0">Date Created</DataTableColumnHeader>
              <DataTableColumnHeader fixed top="0">Publish DHIS2</DataTableColumnHeader>
              <DataTableColumnHeader fixed top="0" width="48px"></DataTableColumnHeader>
            </DataTableRow>
          </TableHead>
          <TableBody>{jobs}</TableBody>
        </DataTable>
      </Card>
      </div>
    );
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
