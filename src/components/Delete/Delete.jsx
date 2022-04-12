import React from 'react'
import { Modal, ModalActions, ModalContent } from '@dhis2/ui'
import ButtonItem from '../ButtonItem/ButtonItem'
import i18n from '../../locales/index.js'
import { deleteCatchmentJob } from '../../api/crosscutRequests'

function Delete(props) {
    const { setShowDelete, toggle, id } = props


    const handleDelete = async () => {
        await deleteCatchmentJob(id)
        toggle()
        setShowDelete(false)
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