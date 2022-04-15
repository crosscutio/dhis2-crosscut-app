import React, { useEffect, useState } from "react"
import { Modal, ModalActions, ModalContent, ModalTitle, SingleSelect, SingleSelectOption, Field, Input, MultiSelect, MultiSelectOption } from '@dhis2/ui'
import ButtonItem from '../ButtonItem/ButtonItem'
import { fetchOrgUnitLevels, fetchOrgUnitGroups, fetchCurrentAttributes } from '../../api/requests.js'
import { createCatchmentJob } from '../../api/crosscutRequests'
import i18n from '../../locales/index.js'

function Create(props) {
    const { title, action, setShowCreateModal, jobs } = props
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
    }

    const fetchGroups = async () => {
        const respGroups = await fetchOrgUnitGroups()
        setGroups(respGroups)
    }

    const fetchCurrentNames = async () => {
        const resp = await fetchCurrentAttributes()
        setCurrentNames(resp)
    }

    const close = () => {
        setShowCreateModal(false)
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
        const catchmentNames = jobs?.find((name) => name.name.toLowerCase() === e.value.toLowerCase())
        const publishedNames = currentNames.find((name) => name.name.toLowerCase() === e.value.toLowerCase())

        if (publishedNames !== undefined || catchmentNames !== undefined) {
             setWarningText(i18n.t("Name is already in use"))
            setFormInputs(prevState => ({
                ...prevState,
                name: ""
            }))
        } else {
             setFormInputs(prevState => ({
                ...prevState,
                name: e.value
            }))
            setWarningText(null)
        }
    } 

    // handle create catchment
    const handleCreate = async () => {
        if (formInputs.name === "" ) return
        if (formInputs.country === "") return
        // TODO: to create catchment, will need data from DHIS2
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
        await createCatchmentJob(formInputs)
    }

    const renderForm = () => {
        return (
            <form>
                <Field label="Select the country" required>
                    <SingleSelect onChange={handleCountryChange} selected={formInputs.country}>
                        {/* TODO: add countries supported */}
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
                        {groups && groups.map((group, index) => {
                            return <MultiSelectOption key={index} label={group.name} value={group.id}/>
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