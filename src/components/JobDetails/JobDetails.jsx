import React, { useEffect, useState } from "react"
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
    IconFileDocument16,
    IconDelete16
} from '@dhis2/ui'
import ButtonItem from "../ButtonItem/ButtonItem";
import i18n from '../../locales/index.js'
import { deleteCatchmentJob } from '../../api/crosscutRequests'
import { fetchCatchmentsInUse } from '../../api/requests'

function JobDetails(props) {
    const { name, status, date, id, toggle } = props
   
    // get key when click on send
    const handleClick = (e) => {
        console.log(e)
        // take the value which is the catchmentId to do something about it
    }

    const handleDelete = async () => {
        // check if catchment is being used in map
        const resp = await fetchCatchmentsInUse()
        if (resp.length === 0) {
            // await deleteCatchmentJob(id)
            // reload list, but might want to do that if it succeeds?
            toggle()
        } else {
            // alert user that the map is in use
        }
    }

    const handleGetDetails = (e) => {
        console.log(e, "details")
    }

    return (
        <DataTableRow id={id}>
          <DataTableCell width="48px"><ButtonItem value={id} handleClick={handleGetDetails} buttonText={<IconFileDocument16/>} borderless={true}/></DataTableCell>
          <DataTableCell dense>{name}</DataTableCell>
          <DataTableCell>{status}</DataTableCell>
          <DataTableCell>{date}</DataTableCell>
          <DataTableCell><ButtonItem value={id} handleClick={handleClick} buttonText={i18n.t("Publish")} primary={true}/></DataTableCell>
          <DataTableCell width="48px" dense><ButtonItem value={id} handleClick={handleDelete} buttonText={<IconDelete16/>} borderless={true}/></DataTableCell>
        </DataTableRow>
      );
}

export default JobDetails
