import React, { useState } from "react"
import {
    DataTableRow,
    DataTableCell,
    IconFileDocument16,
    IconDelete16
} from '@dhis2/ui'
import ButtonItem from "../ButtonItem/ButtonItem";
import i18n from '../../locales/index.js'
import Delete from "../Delete/Delete"
import { deleteCatchmentJob } from '../../api/crosscutRequests'
import { fetchACatchmentInUse, fetchCurrentAttributes, postAttribute } from '../../api/requests'

function JobItem(props) {
    const { name, status, date, id, toggle, handleJobDetails, setWarning } = props
    const [showDelete, setShowDelete] = useState(false)
    // TODO: publish and unpublish
    // get key when click on to publish/unpublish
    const handleConnectionDHIS2 = async () => {
        // take the value which is the catchmentId to do something about it
        const resp = await fetchCurrentAttributes()
        const found = resp.find((attribute) => attribute.name.toLowerCase() === name.toLowerCase())
        console.log(found)
        if (found !== undefined) {
            // alert the user if the name is already in use
            setWarning({text: i18n.t("Name is already in use. Create a new catchment with a different name."), critical: true})
            setTimeout(() => {
                setWarning(null)
            }, 5000)
            return
        }

        if (found === undefined) {
        //    const ugh = await postAttribute()
        //    console.log(ugh)
            const resp = await postAttribute({
                id,
                payload: {  
                    name,
                    organisationUnitAttribute: true,
                    shortName: name,
                    valueType: "GEOJSON"
                }
            })
        }
    }

    const handleDelete = async () => {
        // v1
        setShowDelete(true)

        // TODO: the following for v2
        // check if catchment is being used in map, pass in the id to check
        // TODO: pass in the id to check if its in use
        // will need to know how to get id
        // const resp = await fetchACatchmentInUse("ihn1wb9eho8")

        // if (resp.length === 0) {
            // await deleteCatchmentJob(id)
            // reload list, but might want to do that if it succeeds
            // toggle()
        // } else {
            // alert user that the map is in use
        // }
    }

    const handleGetDetails = (e) => {
        handleJobDetails()
        // get details of catchment
    }

    return (
        <DataTableRow id={id}>
           {showDelete ? <Delete setShowDelete={setShowDelete} toggle={toggle} id={id}/> : null}
          <DataTableCell width="48px"><ButtonItem value={id} handleClick={handleGetDetails} buttonText={<IconFileDocument16/>} borderless={true}/></DataTableCell>
          <DataTableCell dense>{name}</DataTableCell>
          <DataTableCell>{date}</DataTableCell>
          <DataTableCell>{status}</DataTableCell>
          <DataTableCell><ButtonItem value={id} handleClick={handleConnectionDHIS2} buttonText={i18n.t("Publish")} primary={true}/></DataTableCell>
          <DataTableCell width="48px" dense><ButtonItem value={id} handleClick={handleDelete} buttonText={<IconDelete16/>} borderless={true}/></DataTableCell>
        </DataTableRow>
      );
}

export default JobItem
