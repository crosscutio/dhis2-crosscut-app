import React, { useEffect, useState } from "react";
import {
  Card,
  TableHead,
  TableBody,
  DataTableRow,
  DataTable,
  DataTableColumnHeader,
} from "@dhis2/ui";
import styles from './ListCatchmentJobs.module.css'
import JobItem from "../components/JobItem/JobItem";
// import { fetchCatchmentJobs } from "../api/crosscutRequests";
// import { useToggle } from "../hooks/useToggle"
import i18n from "../locales/index"

function ListCatchmentJobs(props) {
  const { jobs, toggle, handleJobDetails } = props
  // const [jobs, setJobs] = useState(null)
  // const [isToggled, toggle] = useToggle(false)
  const [{ column, direction }, setSortInstructions] = useState({
    column: 'date',
    direction: 'desc',
  })

  // useEffect(() => {
  //   fetchJobs()
  // }, [isToggled])

  // const fetchJobs = async () => {
  //   const resp = await fetchCatchmentJobs()
  //   setJobs(resp)
  // }

  // handle sorting of columns
  const getSortDirection = (columnName) => {
    return columnName === column ? direction : 'default'
  }

  const onSortIconClick = ({ name, direction }) => {
      setSortInstructions({
          column: name,
          direction,
      })
  }

  return (
    <div className={styles.container}>
      <Card>
        <DataTable>
          <TableHead>
            <DataTableRow>
              <DataTableColumnHeader fixed top="0" width="48px" ></DataTableColumnHeader>
              <DataTableColumnHeader fixed top="0" name="name" sortIconTitle="sort by name" onSortIconClick={onSortIconClick} sortDirection={getSortDirection('name')}>{i18n.t("Name")}</DataTableColumnHeader>
              <DataTableColumnHeader fixed top="0" name="date" onSortIconClick={onSortIconClick} sortDirection={getSortDirection('date')}>{i18n.t("Date Created")}</DataTableColumnHeader>
              <DataTableColumnHeader fixed top="0" name="status" sortIconTitle="sort by status" onSortIconClick={onSortIconClick} sortDirection={getSortDirection('status')}>{i18n.t("Status")}</DataTableColumnHeader>
              <DataTableColumnHeader fixed top="0">{i18n.t("Publish DHIS2")}</DataTableColumnHeader>
              <DataTableColumnHeader fixed top="0" width="48px"></DataTableColumnHeader>
            </DataTableRow>
          </TableHead>
          <TableBody>{jobs && jobs.sort((a, b) => {
              const strA = a[column]
              const strB = b[column]

              if ((direction === 'asc' && strA < strB) ||(direction === 'desc' && strA > strB)) return -1
              if ((direction === 'desc' && strA < strB) ||(direction === 'asc' && strA > strB)) return 1
              return 0
          }).map((job) => {
            return <JobItem toggle={toggle} key={job.id} name={job.name} status={job.status} id={job.id} date={job.date} handleJobDetails={handleJobDetails}/>
          })}</TableBody>
        </DataTable>
      </Card>
    </div>
  );
}
export default ListCatchmentJobs;
