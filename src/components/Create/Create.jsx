import React, { useEffect, useState } from "react"
import { Button, Modal, ModalActions, ModalContent, ModalTitle, SingleSelect, SingleSelectOption, Field, Input, MultiSelect, MultiSelectOption } from '@dhis2/ui'
import ButtonItem from '../ButtonItem/ButtonItem'
import styles from './Create.module.css'
import { fetchOrgUnitLevels, fetchOrgUnitGroups } from '../../util/requests.js'

function Create(props) {
    const { title, action, setShowModal } = props
    const [formInputs, setFormInputs] = useState({
        country: "",
        level: "",
        group: [],
        name: ""
    })
    const [levels, setLevels] = useState([])
    const [groups, setGroups] = useState([])

    useEffect(() => {
        fetchOrgUnit()

    }, [])

    const fetchOrgUnit = async () => {
       const respLevels = await fetchOrgUnitLevels()
       respLevels.organisationUnitLevels.sort((a,b) => {
            if (a.level > b.level) return 1
            if (a.level < b.level) return -1
            return 0
        })
    
       setLevels(respLevels.organisationUnitLevels)

       const respGroups = await fetchOrgUnitGroups()
       setGroups(respGroups.organisationUnitGroups)
    }

    const close = () => {
        setShowModal(false)
    }

    const handleLevelChange = (e) => {
        console.log(e)
        setFormInputs(prevState => ({
            ...prevState,
            level: e.selected
        }))
    }

    const handleGroupChange = (e) => {
        console.log(e)
        setFormInputs(prevState => ({
            ...prevState,
            group: e.selected
        }))
    }
console.log(formInputs)
    const renderForm = () => {
        return (
            <form>
                <Field label="Select the country">
                    <SingleSelect >
                        <SingleSelectOption value="1" label="Sierra Leone"/>
                        <SingleSelectOption value="2" label="Haiti"/>
                    </SingleSelect>
                </Field>

                <Field label="Name the catchment areas">
                    <Input/>
                </Field>
                <Field label="Select the facility level">
                    <SingleSelect onChange={handleLevelChange} selected={formInputs.level}>
                        {levels && levels.map((level, index) => {
                            return <SingleSelectOption key={index} label={level.name} value={level.name}/>
                        })}
                    </SingleSelect>
                </Field>
                <Field label="Select the groups">
                    <MultiSelect onChange={handleGroupChange} selected={formInputs.group}>
                        {groups && groups.map((group) => {
                            return <MultiSelectOption key={group.id} label={group.name} value={group.name}/>
                        })}
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
        <ModalActions><ButtonItem handleClick={close} buttonText={"Cancel"} secondary={true}/><ButtonItem buttonText={action} primary={true}/></ModalActions>
    </Modal>
}

export default Create