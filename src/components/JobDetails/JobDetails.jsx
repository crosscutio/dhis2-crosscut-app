import React from "react"
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


function JobDetails(props) {
    const { name, status, id } = props
    // get key when click on send
    const handleClick = (e) => {
        console.log(e)
        // take the value which is the catchmentId to do something about it
    }

    const handleDelete = (e) => {
        console.log(e, "delete")
    }

    const handleGetDetails = (e) => {
        console.log(e, "details")
    }
    
    return (
        <DataTableRow id={id}>
          <DataTableCell width="48px"><ButtonItem value={id} handleClick={handleGetDetails} buttonText={<IconFileDocument16/>} borderless={true}/></DataTableCell>
          <DataTableCell dense>{name}</DataTableCell>
          <DataTableCell>{status}</DataTableCell>
          <DataTableCell>Insert date</DataTableCell>
          <DataTableCell><ButtonItem value={id} handleClick={handleClick} buttonText={i18n.t("Send")} primary={true}/></DataTableCell>
          <DataTableCell width="48px" dense><ButtonItem value={id} handleClick={handleDelete} buttonText={<IconDelete16/>} borderless={true}/></DataTableCell>
        </DataTableRow>
      );
}

export default JobDetails
