import React, { useEffect, useState } from "react"
import { 
    Modal, 
    ModalActions, 
    ModalContent, 
    ModalTitle, 
    SingleSelect, 
    SingleSelectOption, 
    Field, 
    Input, 
    MultiSelect, 
    MultiSelectOption,  
    TableHead,
    TableBody,
    DataTableRow,
    DataTable, 
    DataTableColumnHeader,
    DataTableCell,
    Divider,
    AlertBar
} from '@dhis2/ui'
import ButtonItem from '../ButtonItem/ButtonItem'
import { fetchOrgUnitLevels, fetchOrgUnitGroups, fetchCurrentAttributes } from '../../api/requests.js'
import { createCatchmentJob, fetchSupportedBoundaries, updateCatchmentItem } from '../../api/crosscutRequests'
import i18n from '../../locales/index.js'
import papaparse from "papaparse"

function Create(props) {
    const { title, action, setShowCreateModal, jobs, toggle, setCreateAlert } = props
    const [formInputs, setFormInputs] = useState({
        country: "",
        level: "",
        group: [],
        csv: "",
        name: "",
    })
    const [boundaries, setBoundaries] = useState(null)
    const [levels, setLevels] = useState([])
    const [groups, setGroups] = useState([])
    const [currentNames, setCurrentNames] = useState([])
    const [nameText, setNameText] = useState(null)
    const [countryText, setCountryText] = useState(null)
    const [levelText, setLevelText] = useState(null)
    const [errorData, setErrorData] = useState(null)
    const [hasErrors, setHasErrors] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [alertError, setAlertError] = useState(null)

    useEffect(() => {
        fetchBoundaries()
        fetchLevels()
        fetchGroups()
        fetchCurrentNames()
        return () => {
            // This is the cleanup function
          }
    }, [])

    useEffect(() => {
        if (formInputs.csv !== "") {
            handleCreate()
        }
        return () => {
            // This is the cleanup function
          }
    }, [formInputs.csv])

    const fetchBoundaries = async () => {
        const respBoundaries = await fetchSupportedBoundaries()
        setBoundaries(respBoundaries)
    }

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

    // clear out error data and message
    const clearErrors = () => {
        setHasErrors(false)
        setErrorData(null)
    }

    // handle form changes
    const handleCountryChange = (e) => {
        // if there are errors then clear out groups and levels as that should be different
        if (hasErrors === true) {
            setFormInputs(prevState => ({
                ...prevState,
                country: e.selected,
                level: "",
                groups: []
            }))
            clearErrors()
        } else {
            setFormInputs(prevState => ({
                ...prevState,
                country: e.selected
            }))
        }
    }
    const handleLevelChange = (e) => {
        setFormInputs(prevState => ({
            ...prevState,
            level: e.selected,
            csv: ""
        }))
        // if the user changes level then clear out errors
        if (hasErrors === true) {
           clearErrors()
        }
    }

    const handleGroupChange = (e) => {
        setFormInputs(prevState => ({
            ...prevState,
            group: e.selected,
            csv: ""
        }))
        // if the user changes group then clear out errors
        if (hasErrors === true) {
            clearErrors()
        }
    }

    const handleNameChange = async (e) => {
        const catchmentNames = jobs?.find((name) => name.name.toLowerCase() === e.value.toLowerCase())
        const publishedNames = currentNames.find((name) => name.name.toLowerCase().split("crosscut ")[1] === e.value.toLowerCase())

        if (publishedNames !== undefined || catchmentNames !== undefined) {
             setNameText(i18n.t("Name is already in use"))
            setFormInputs(prevState => ({
                ...prevState,
                name: ""
            }))
        } else {
             setFormInputs(prevState => ({
                ...prevState,
                name: e.value
            }))
            setNameText(null)
        }
    } 

    // handle create catchment
    const handleCreate = async () => {
        if (formInputs.country === "") {
            setCountryText(i18n.t("Country required"))
            return
        }
        if (formInputs.name === "") {
            setNameText(i18n.t("Name required"))
            return
        }
        if (formInputs.level === "") {
            setLevelText(i18n.t("Level required"))
            return
        }
        
        setIsLoading(true)
        try {
            const resp = await createCatchmentJob(formInputs).catch( async (err) => {
                const data = JSON.parse(await err.response.text())
                if (data.csv) {
                    const resp = papaparse.parse(data.csv.trim(), { header: true })
                    return { error: resp }
                } else {
                    setAlertError({ text: i18n.t(data.message), critical: true })
                    return { error: data }
                }
            })

            // if there are errors then set the error
            if (resp?.error) {
                if (resp.error.data) {
                    const errors = resp.error.data.filter((data) => data["cc:ErrorMessage"] !== "") 
                    const clean = resp.error.data.filter((data) => data["cc:ErrorMessage"] === "")
        
                    if (clean.length === 0) {
                        setErrorMessage({ message: i18n.t("There are no valid sites."), proceed: false })
                    } else {
                        setErrorMessage({ message: i18n.t("Click proceed to continue. The sites with errors will be removed if you proceed, or click cancel to go back.") , proceed: true })
                    }
                    setErrorData({ data: resp.error.data, fields: resp.error.meta.fields, errors: errors})
                    setHasErrors(true)
                } else if (resp.error.status === 204) {
                    setAlertError({ text: i18n.t("No sites were found"), critical: true })
                }
            
                setIsLoading(false)
            } else {
                // close the modal
                close()
                // toggle to fetch for jobs
                toggle()
                setIsLoading(false)
                setCreateAlert({ text: i18n.t("Your catchment areas are being created. It should be ready in a few minutes."), success: true})
            }  
        } catch (err) {
            setAlertError({ text: i18n.t(err.message), critical: true })
            return { error: err.message }
        }
    }

    // remove rows with errors and create
    const createWithoutErrors = () => {
        let newData = errorData.data.filter((d) => {
            return d["cc:ErrorMessage"] === ""
        })
        newData.map((d) => {
            delete d["cc:ErrorMessage"]
            return d
        }) 

        setFormInputs(prevState => ({
            ...prevState,
            csv: newData
        }))
        setHasErrors(false)
    }

    // form to create a catchment
    const renderForm = () => {
        return (
            <form>
                <Field label="Select the country" required validationText={countryText} error>
                    <SingleSelect onChange={handleCountryChange} selected={formInputs.country}>
                        {boundaries && boundaries.map((bound, index) => {
                            return <SingleSelectOption key={`boundary-${index}`} value={bound.id} label={`${bound.countryName}`}/>
                        })}
                    </SingleSelect>
                </Field>

                <Field label="Name the catchment areas" required validationText={nameText} warning>
                    <Input onChange={handleNameChange}/>
                </Field>
                <Field label="Select the facility level" required validationText={levelText} error>
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

    // data table with sites
    const renderTable = () => {
        return (
            <>
            <DataTable scrollHeight="350px">
                <TableHead>
                    <DataTableRow>
                        {errorData && errorData.fields.map((field, index) => {
                             return (
                             <DataTableColumnHeader key={index} fixed top="0">
                                 {field === "cc:ErrorMessage" ? i18n.t("Error Message") : field}
                             </DataTableColumnHeader>
                             )
                        })}
                    </DataTableRow>
                </TableHead>
                <TableBody>
                    {errorData && errorData.errors.map((rowData, index) => {
                        return (
                            <DataTableRow key={`row-${index}`}>
                                {Object.values(rowData).map((error, index) => {
                                    return <DataTableCell key={`cell-${index}`}>{error}</DataTableCell>
                                })}
                            </DataTableRow>
                            )
                    })}
                </TableBody>
            </DataTable>
            </>
        )
    }
    return <Modal>
        <ModalTitle>{title}</ModalTitle>
        <ModalContent>
            {alertError ? <AlertBar critical={alertError.critical} alert={alertError.alert}>{alertError.text}</AlertBar> : null}
            {renderForm()}
            <Divider/>
            {hasErrors && <Modal>
                <ModalTitle>{errorData.errors.length} {i18n.t("sites with errors were found")}</ModalTitle>
                <ModalContent>
                    {errorMessage.message}
                    {renderTable()}
                </ModalContent>
                <ModalActions><ButtonItem buttonText={i18n.t("Cancel")} handleClick={clearErrors}/>{errorMessage.proceed ? <ButtonItem buttonText={"Proceed"} primary={true} handleClick={createWithoutErrors}/> : null }</ModalActions>
            </Modal>
            }
        </ModalContent>
        <ModalActions><ButtonItem handleClick={close} buttonText={i18n.t("Cancel")} secondary={true}/><ButtonItem buttonText={action} handleClick={handleCreate} disabled={hasErrors} primary={true} loading={isLoading}/></ModalActions>
    </Modal>
}

export default Create