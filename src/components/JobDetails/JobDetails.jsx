import React from "react"
import { Modal, ModalActions, ModalContent, ModalTitle, SingleSelect, Field, Input, MultiSelect } from '@dhis2/ui'
import ButtonItem from '../ButtonItem/ButtonItem'
import { getCatchmentJob } from '../../api/crosscutRequests'

function JobDetails(props) {
    const { title, action, setShowJobDetailsModal, name, details } = props
    // fetch catchment details
    const close = () => {
        setShowJobDetailsModal(false)
    }

    const renderForm = () => {
        return (
            <form>
                <Field label="Select the country">
                    <SingleSelect disabled>
                    </SingleSelect>
                </Field>
                <Field label="Name the catchment areas">
                    <Input disabled/>
                </Field>
                <Field label="Select the facility level">
                    <SingleSelect disabled selected={details.levelId}>  
                    </SingleSelect>
                </Field>
                <Field label="Select the groups">
                    <MultiSelect disabled selected={details.groupId}> 
                    </MultiSelect>
                </Field>
            </form>
        )
    }

    return <Modal>
        <ModalTitle>{title}</ModalTitle>
        <ModalContent>
            {renderForm()}
        </ModalContent>
        <ModalActions><ButtonItem handleClick={close} buttonText={action} primary={true}/></ModalActions>
    </Modal>
}

export default JobDetails