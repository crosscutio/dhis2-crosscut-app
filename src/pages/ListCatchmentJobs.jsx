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
import JobDetails from "../components/JobDetails/JobDetails";

const CROSSCUT_API = "https://qwui27io74.execute-api.us-east-1.amazonaws.com";

function ListCatchmentJobs(props) {
  const [jobs, setJobs] = useState(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    const url = `${CROSSCUT_API}/catchment-jobs`;
    const resp = await ky(url, {
      mode: "cors",
      headers: {
        authorization: props.token,
      },
    }).json();
    setJobs(resp.jobs)
  }

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
        <TableBody>{jobs && jobs.map((job) => {
          return <JobDetails key={job.id} name={job.name} status={job.status} id={job.id}/>
        })}</TableBody>
      </DataTable>
    </Card>
    </div>
  );
}
export default ListCatchmentJobs;
