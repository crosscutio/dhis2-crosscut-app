import React from 'react'
import { Modal, ModalActions, ModalContent } from '@dhis2/ui'
import ButtonItem from '../ButtonItem/ButtonItem'
import i18n from '../../locales/index.js'
import { deleteCatchmentJob, getCatchmentJobAttributeId } from '../../api/crosscutRequests'
import { fetchCurrentAttributes } from '../../api/requests'

function Delete(props) {
    const { setShowDelete, toggle, id, handleUnpublish, attribute, setAlert } = props

    const handleDelete = async () => {
        // check to see if the catchment has been published
        if (attribute !== null) {
            const allAttributes = await fetchCurrentAttributes()
            const found = allAttributes.find((att) => att.id === attribute.value)

            if (found !== undefined) {
                await handleUnpublish()
            }
        }      
        await deleteCatchmentJob(id)
        toggle()
        setShowDelete(false) 
        setAlert({ text: i18n.t("Deleted")})
    }

    const close = () => {
        setShowDelete(false)
    }

    return ( 
        <Modal>
            <ModalContent>{i18n.t("Deleting will delete the catchment area from the app and remove the catchment area from DHIS2 if published.")}</ModalContent>
            <ModalActions><ButtonItem handleClick={close} buttonText={i18n.t("Cancel")} secondary={true}/><ButtonItem buttonText={i18n.t("Delete Forever")} handleClick={handleDelete} primary={true}/></ModalActions>
        </Modal>
    )
}

export default Delete