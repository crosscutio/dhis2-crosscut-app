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
    IconFileDocument24,
    IconDelete24
} from '@dhis2/ui'
import ButtonItem from "../ButtonItem/ButtonItem";
import i18n from '../../locales/index.js'


function JobDetails(props) {
    const { name, status, key } = props
    // get key when click on send
    return (
        <DataTableRow key={key}>
          <DataTableCell width="48px"><ButtonItem buttonText={<IconFileDocument24/>} borderless={true}/></DataTableCell>
          <DataTableCell dense>{name}</DataTableCell>
          <DataTableCell>{status}</DataTableCell>
          <DataTableCell>Insert date</DataTableCell>
          <DataTableCell><ButtonItem buttonText={i18n.t("Send")} primary={true}/></DataTableCell>
          <DataTableCell width="48px" dense><ButtonItem buttonText={<IconDelete24/>} borderless={true}/></DataTableCell>
        </DataTableRow>
      );
}

export default JobDetails
