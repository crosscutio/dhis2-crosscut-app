import React, { useEffect, useState } from "react"
import { Modal, ModalActions, ModalContent, ModalTitle, SingleSelect, SingleSelectOption, Field, Input, MultiSelect, MultiSelectOption,   TableHead,
    TableBody,
    DataTableRow,
    DataTable, 
    DataTableColumnHeader,
    DataTableCell,
    Divider} from '@dhis2/ui'
import ButtonItem from '../ButtonItem/ButtonItem'
import { fetchOrgUnitLevels, fetchOrgUnitGroups, fetchCurrentAttributes } from '../../api/requests.js'
import { createCatchmentJob } from '../../api/crosscutRequests'
import i18n from '../../locales/index.js'
import papaparse from "papaparse"

function Create(props) {
    const { title, action, setShowCreateModal, jobs, toggle } = props
    const [formInputs, setFormInputs] = useState({
        country: "",
        level: "",
        group: [],
        csv: "",
        name: "",
        algorithm: "site-based"
    })
    const [levels, setLevels] = useState([])
    const [groups, setGroups] = useState([])
    const [currentNames, setCurrentNames] = useState([])
    const [nameText, setNameText] = useState(null)
    const [countryText, setCountryText] = useState(null)
    const [levelText, setLevelText] = useState(null)
    const [errorData, setErrorData] = useState(null)
    const [hasErrors, setHasErrors] = useState(false)

    useEffect(() => {
        fetchLevels()
        fetchGroups()
        fetchCurrentNames()
        return () => {
            // This is the cleanup function
          }
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
        
        const resp = await createCatchmentJob(formInputs).catch( async (err) => {
            const data = JSON.parse(await err.response.text())
            const resp = papaparse.parse(data.csv.trim(), { header: true })
            return { error: resp }
        })
        
        // if there are errors then set the error
        if (resp?.error) {
            resp.error.data.sort((a, b) => {
                const ae = a["cc:ErrorMessage"] || ""
                const be = b["cc:ErrorMessage"] || ""
                return be.length - ae.length
            })
            setErrorData({ data: resp.error.data, fields: resp.error.meta.fields})
            setHasErrors(true)
        } else {
            // close the modal
            close()
            // toggle to fetch for jobs
            toggle()
        }
     
    }

    // remove rows with errors
    const removeErrors = () => {
        let newData = errorData.data.filter((d) => {
            return d["cc:ErrorMessage"] === ""
        })
        newData.map((d) => {
            delete d["cc:ErrorMessage"]
            return d
        }) 
        const errorIndex = errorData.fields.indexOf("cc:ErrorMessage")
        errorData.fields.splice(errorIndex, 1)
        setErrorData(prevState => ({
            ...prevState,
            data: newData,
        }))

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
                        <SingleSelectOption value="SLE_10_ALL" label="Sierra Leonne"/>
                        {/* TO-DO: add countries supported */}
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
            {hasErrors ? <ButtonItem primary={true} buttonText={i18n.t("Remove rows with errors")} handleClick={removeErrors}/> : null}
            <DataTable scrollHeight="350px">
                <TableHead>
                    <DataTableRow>
                        {errorData && errorData.fields.map((field, index) => {
                             return (
                             <DataTableColumnHeader key={index} fixed top="0">
                                 {field}
                             </DataTableColumnHeader>
                             )
                        })}
                    </DataTableRow>
                </TableHead>
                <TableBody>
                    {errorData && errorData.data.map((rowData, index) => {
                        return (
                        <DataTableRow key={`row-${index}`}>
                            {Object.values(rowData).map((data, index) => {
                                return <DataTableCell key={`cell-${index}`}>{data}</DataTableCell>
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
            {renderForm()}
            <Divider/>
            {errorData && renderTable()}
        </ModalContent>
        <ModalActions><ButtonItem handleClick={close} buttonText={i18n.t("Cancel")} secondary={true}/><ButtonItem buttonText={action} handleClick={handleCreate} primary={true}/></ModalActions>
    </Modal>
}

export default Create