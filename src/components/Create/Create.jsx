import React, { useEffect, useState } from "react"
import { Modal, ModalActions, ModalContent, ModalTitle, SingleSelect, SingleSelectOption, Field, Input, MultiSelect, MultiSelectOption } from '@dhis2/ui'
import ButtonItem from '../ButtonItem/ButtonItem'
import styles from './Create.module.css'
import { fetchOrgUnitLevels, fetchOrgUnitGroups, fetchCurrentAttributes } from '../../api/requests.js'
import { createCatchmentJob } from '../../api/crosscutRequests'
import i18n from '../../locales/index.js'

function Create(props) {
    const { title, action, setShowModal } = props
    const [formInputs, setFormInputs] = useState({
        country: "",
        level: "",
        group: [],
        name: "",
        algorithm: "site-based"
    })
    const [levels, setLevels] = useState([])
    const [groups, setGroups] = useState([])
    const [currentNames, setCurrentNames] = useState([])
    const [warningText, setWarningText] = useState(null)

    useEffect(() => {
        fetchLevels()
        fetchGroups()
        fetchCurrentNames()
    }, [])

    const fetchLevels = async () => {
       const respLevels = await fetchOrgUnitLevels()
       setLevels(respLevels)
       console.log(respLevels)
    }

    const fetchGroups = async () => {
        const respGroups = await fetchOrgUnitGroups()
        setGroups(respGroups.organisationUnitGroups)
        console.log(respGroups)
    }

    const fetchCurrentNames = async () => {
        const resp = await fetchCurrentAttributes()
        setCurrentNames(resp)
    }

    const close = () => {
        setShowModal(false)
    }


    // handle form changes
    const handleCountryChange = (e) => {
        setFormInputs(prevState => ({
            ...prevState,
            country: e.selected
        }))
    }
    const handleLevelChange = (e) => {
        setFormInputs(prevState => ({
            ...prevState,
            level: e.selected
        }))
    }

    const handleGroupChange = (e) => {
        setFormInputs(prevState => ({
            ...prevState,
            group: e.selected
        }))
    }

    const handleNameChange = async (e) => {
        // should we prevent users from name the same as catchments in general and current attributes
        // users might create a catchment without publishing it...?
        if (currentNames.find((name) => name.name === e.value) === undefined) {
            setFormInputs(prevState => ({
                ...prevState,
                name: e.value
            }))
            setWarningText(null)
        } else {
            setWarningText(i18n.t("Name is already taken"))
        }
    } 

    const handleCreate = async () => {
        // {
        //     name,
        //     csv,
        //     country,
        //     algorithm,
        //     fields: {
        //         lat,
        //         lng,
        //         name
        //     }
        // }
        await createCatchmentJob("moo", formInputs)
    }

    const renderForm = () => {
        return (
            <form>
                <Field label="Select the country" required>
                    <SingleSelect onChange={handleCountryChange} selected={formInputs.country}>
                        <SingleSelectOption value="SLE_10_All" label="Sierra Leone"/>
                    </SingleSelect>
                </Field>

                <Field label="Name the catchment areas" required validationText={warningText} warning>
                    <Input onChange={handleNameChange}/>
                </Field>
                <Field label="Select the facility level" required>
                    <SingleSelect onChange={handleLevelChange} selected={formInputs.level}>
                        {levels && levels.map((level, index) => {
                            return <SingleSelectOption key={index} label={level.name} value={level.id}/>
                        })}
                    </SingleSelect>
                </Field>
                <Field label="Select the groups" required>
                    <MultiSelect onChange={handleGroupChange} selected={formInputs.group}>
                        {groups && groups.map((group) => {
                            return <MultiSelectOption key={group.id} label={group.name} value={group.id}/>
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
        <ModalActions><ButtonItem handleClick={close} buttonText={i18n.t("Cancel")} secondary={true}/><ButtonItem buttonText={action} handleClick={handleCreate} primary={true}/></ModalActions>
    </Modal>
}

export default Create