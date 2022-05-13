import React, { useState } from "react";
import {
  Card,
  TableHead,
  TableBody,
  DataTableRow,
  DataTable,
  DataTableColumnHeader,
} from "@dhis2/ui";
import JobItem from "../components/JobItem/JobItem";
import i18n from "../locales/index"
import styles from './ListCatchmentJobs.module.css'

function ListCatchmentJobs(props) {
  const { jobs, toggle, handleJobDetails, setAlert, setPublishAlert, setUnpublishAlert, setDeleteAlert } = props
  const [{ column, direction }, setSortInstructions] = useState({
    column: 'date',
    direction: 'desc',
  })

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
    <>
    <h2 className={styles.headerTitle}>Crosscut {i18n.t("Catchment Areas")}</h2>
    <div className={styles.container}>
      <Card>
        <DataTable>
          <TableHead>
            <DataTableRow>
              <DataTableColumnHeader fixed top="0" width="48px" ></DataTableColumnHeader>
              <DataTableColumnHeader fixed top="0" name="name" sortIconTitle="sort by name" onSortIconClick={onSortIconClick} sortDirection={getSortDirection('name')}>{i18n.t("Name")}</DataTableColumnHeader>
              <DataTableColumnHeader fixed top="0" name="id" onSortIconClick={onSortIconClick} sortDirection={getSortDirection('id')}>{i18n.t("Date Created")}</DataTableColumnHeader>
              <DataTableColumnHeader fixed top="0" name="status" sortIconTitle="sort by status" onSortIconClick={onSortIconClick} sortDirection={getSortDirection('status')}>{i18n.t("Status")}</DataTableColumnHeader>
              <DataTableColumnHeader fixed top="0">{i18n.t("Publish DHIS2")}</DataTableColumnHeader>
              <DataTableColumnHeader fixed top="0" width="48px"></DataTableColumnHeader>
            </DataTableRow>
          </TableHead>
          <TableBody loading>
            {jobs && jobs.sort((a, b) => {
              const strA = a[column]
              const strB = b[column]

              if ((direction === 'asc' && strA < strB) ||(direction === 'desc' && strA > strB)) return -1
              if ((direction === 'desc' && strA < strB) ||(direction === 'asc' && strA > strB)) return 1
              return 0
          }).map((job) => {
            return <JobItem setAlert={setAlert} setPublishAlert={setPublishAlert} setUnpublishAlert={setUnpublishAlert} toggle={toggle} key={job.id} name={job.name} status={job.status} id={job.id} date={job.date} handleJobDetails={handleJobDetails} attributeId={job.attributeId} setDeleteAlert={setDeleteAlert} details={job.jobDetails}/>
          })}</TableBody>
        </DataTable>
      </Card>
    </div>
    </>
  );
}
export default ListCatchmentJobs;
