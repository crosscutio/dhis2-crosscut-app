import React, { useState, useEffect } from "react"
import {
    DataTableRow,
    DataTableCell,
    IconFileDocument16,
    IconDelete16
} from '@dhis2/ui'
import ButtonItem from "../ButtonItem/ButtonItem";
import i18n from '../../locales/index.js'
import Delete from "../Delete/Delete"
import { fetchCurrentAttributes, publishCatchment, unPublishCatchment } from '../../api/requests'

function JobItem(props) {
    const { name, status, date, id, toggle, handleJobDetails, setAlert, properties, attributeId, setPublishAlert, setUnpublishAlert, setDeleteAlert } = props
    const [showDelete, setShowDelete] = useState(false)
    const [publishStatus, setPublishStatus] = useState(i18n.t("Publish"))
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        if (attributeId !== undefined) {
            setPublishStatus(i18n.t("Unpublish"))
        }
    }, [attributeId])

    const handleConnectionDHIS2 = async () => {
        if (publishStatus === i18n.t("Publish")) {
            await handlePublish()
        } else if (publishStatus === i18n.t("Unpublish")) {
            await handleUnpublish() 
        }
    }   

    const handleUnpublish = async () => {
        setIsLoading(true)
        setPublishStatus(null)
        try {
            await unPublishCatchment({
            id,
            attributeId,
            name,
            setStatus: setPublishStatus
            })
            toggle()
            setIsLoading(false)
            setUnpublishAlert({ text: i18n.t("Unpublished")})
            setTimeout(() => {
                setUnpublishAlert(null)
                // 5s
            }, 5000)
        } catch (err) {
            setPublishAlert({ text: i18n.t(err.message), critical: true })
            setTimeout(() => {
                setPublishAlert(null)
                // 5s
            }, 5000)
            setIsLoading(false)
            setPublishStatus(i18n.t("Unpublish"))
        }  
    }

    const handlePublish = async () => {
        setIsLoading(true)
        // take the value which is the catchmentId to do something about it
        try { 
            const resp = await fetchCurrentAttributes()
            const found = resp.find((attribute) => attribute.name.toLowerCase().split("crosscut ")[1] === name.toLowerCase())

            if (found !== undefined) {
                // alert the user if the name is already in use
                setAlert({text: i18n.t("Name is already in use. Create a new catchment with a different name."), critical: true})
                setTimeout(() => {
                    setAlert(null)
                }, 5000)
                setIsLoading(false)
                return
            }

            if (found === undefined) {
                setPublishStatus(null)
                await publishCatchment({
                    id,
                    payload: {  
                        name: `Crosscut ${name}`,
                        organisationUnitAttribute: true,
                        shortName: `Crosscut ${name}`,
                        valueType: "GEOJSON"
                    },
                    setStatus: setPublishStatus
                })            
            }
            toggle()
            setIsLoading(false)
            setPublishAlert({ text: i18n.t("Published")})
            setTimeout(() => {
                setPublishAlert(null)
                // 5s
            }, 5000)
        } catch (err) {
            setPublishAlert({ text: i18n.t(err.message), critical: true })
            setTimeout(() => {
                setPublishAlert(null)
                // 5s
            }, 5000)
            setPublishStatus(i18n.t("Publish"))
            setIsLoading(false)
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
           {showDelete ? <Delete setShowDelete={setShowDelete} setDeleteAlert={setDeleteAlert} toggle={toggle} id={id} handleUnpublish={handleUnpublish} attributeId={attributeId} setIsDeleting={setIsDeleting}/> : null}
          <DataTableCell width="48px"><ButtonItem value={id} handleClick={handleGetDetails} buttonText={<IconFileDocument16/>} borderless={true}/></DataTableCell>
          <DataTableCell dense>{name}</DataTableCell>
          <DataTableCell>{date}</DataTableCell>
          <DataTableCell>{status}</DataTableCell>
          <DataTableCell><ButtonItem value={id} disabled={status === i18n.t("Pending") || status === i18n.t("Failed")} handleClick={handleConnectionDHIS2} loading={isLoading} buttonText={publishStatus} primary={true}/></DataTableCell>
          <DataTableCell width="48px" dense><ButtonItem value={id} loading={isDeleting} handleClick={handleDelete} buttonText={<IconDelete16/>} borderless={true}/></DataTableCell>
        </DataTableRow>
      );
}

export default JobItem
