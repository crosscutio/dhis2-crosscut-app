import React from "react"
import { Modal, ModalActions, ModalContent, ModalTitle, SingleSelect, SingleSelectOption, Field, Input } from '@dhis2/ui'
import ButtonItem from '../ButtonItem/ButtonItem'

function ModalContainer(props) {
    const { title, action, setShowModal } = props
    const close = () => {
        setShowModal(false)
    }

    const renderForm = () => {
        return (
            <div>
            <Field label="Select the country">
            <SingleSelect>
                <SingleSelectOption value="1" label="Sierra Leone"/>
                <SingleSelectOption value="2" label="Haiti"/>
            </SingleSelect>
            </Field>

            <Field label="Name the catchment areas">
                <Input/>
            </Field>
        </div>
        )
    }
    return <Modal>
        <ModalTitle>{title}</ModalTitle>
        <ModalContent>
            {renderForm()}
        </ModalContent>
        <ModalActions><ButtonItem handleClick={close} buttonText={"Cancel"}/><ButtonItem buttonText={action}/></ModalActions>
    </Modal>
}

export default ModalContainer