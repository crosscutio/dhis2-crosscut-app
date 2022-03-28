import React, { useEffect, useState } from "react";
import ky from "ky";
import ButtonItem from "../components/ButtonItem/ButtonItem";
import {
  Card,
  TableHead,
  TableBody,
  DataTableRow,
  DataTable,
  DataTableColumnHeader,
} from "@dhis2/ui";
import styles from './ListCatchmentJobs.module.css'
import JobDetails from "../components/JobDetails/JobDetails";
import { fetchCatchmentJobs } from "../api/crosscutRequests";
import { useToggle } from "../hooks/useToggle"

function ListCatchmentJobs(props) {
  const [jobs, setJobs] = useState(null)
  const [isToggled, toggle] = useToggle(false)

  useEffect(() => {
    fetchJobs()
  }, [isToggled])

  const fetchJobs = async () => {
    const resp = await fetchCatchmentJobs()
    setJobs(resp)
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
          return <JobDetails toggle={toggle} key={job.id} name={job.name} status={job.status} id={job.id}/>
        })}</TableBody>
      </DataTable>
    </Card>
    </div>
  );
}
export default ListCatchmentJobs;
