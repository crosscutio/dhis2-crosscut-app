import React from "react"
import { Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui'

function ModalContainer() {
    return <Modal>
        <ModalTitle></ModalTitle>
        <ModalContent></ModalContent>
        <ModalActions></ModalActions>
    </Modal>
}

export default ModalContainer