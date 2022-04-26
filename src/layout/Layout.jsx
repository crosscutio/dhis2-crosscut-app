import React, { useState, useEffect } from 'react'
import ListCatchmentJobs from '../pages/ListCatchmentJobs'
import Create from '../components/Create/Create'
import Info from '../components/Info/Info'
import Nav from '../components/Nav/Nav'
import i18n from '../locales/index.js'
import { AlertBar, CircularLoader  } from "@dhis2/ui"
import JobDetails from '../components/JobDetails/JobDetails'
import { fetchCatchmentJobs } from "../api/crosscutRequests"
import { useToggle } from "../hooks/useToggle"
import { setToken } from "../services/JWTManager";

function Layout(props) {
    const [alert, setAlert] = useState(null)
    const [publishAlert, setPublishAlert] = useState(null)
    const [unpublishAlert, setUnpublishAlert] = useState(null)
    const [createAlert, setCreateAlert] = useState(null)

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showInfoModal, setShowInfoModal] = useState(false)
    const [showJobDetailsModal, setShowJobDetailsModal] = useState(false)
    const [modalText, setModalText] = useState({ title: "", action: ""})
    const [jobs, setJobs] = useState(null)
    const [isToggled, toggle] = useToggle(false)
    const { token } = props
    setToken(token)

    let poller 
    useEffect(() => {
        // poll every 5s
        poller = setInterval(() => {
            fetchJobs()
        }, 5000)
        return () => {
            // this is a clean up function
        }
      }, [isToggled])
    
      const fetchJobs = async () => {
        const resp = await fetchCatchmentJobs()
        setJobs(resp)
        
        // check for loading jobs
        const foundLoading = resp.find((job) => job.status === "Pending")

        if (foundLoading === undefined) {
           clearInterval(poller)
        }
      }

    // handle create modal
    const handleCreate = () => {
        setShowCreateModal(true) 
        setModalText({title: i18n.t("Create new catchment areas"), action: i18n.t("Create")})
    }

    const handleInfo = () => {
        setShowInfoModal(true)
    }

    const handleJobDetails = () => {
        setShowJobDetailsModal(true)
        setModalText({ title: i18n.t("Catchment details"), action: i18n.t("Close")})
    }
    return <>
        <Nav handleClick={handleCreate} jobs={jobs} handleInfo={handleInfo}/>
        { showCreateModal === true ? <Create title={modalText.title} setShowCreateModal={setShowCreateModal} action={modalText.action} toggle={toggle} setAlert={setAlert} setCreateAlert={setCreateAlert}/> : null}
        { showInfoModal === true ? <Info setShowInfoModal={setShowInfoModal}/> : null}
        { showJobDetailsModal === true ? <JobDetails setShowJobDetailsModal={setShowJobDetailsModal} title={modalText.title} action={modalText.action}/> : null}
        {alert ? <AlertBar critical={alert.critical} alert={alert.alert} success={alert.success}>{alert.text}</AlertBar> : null}
        {publishAlert ? <AlertBar alert={publishAlert.alert}>{publishAlert.text}</AlertBar> : null}
        {unpublishAlert ? <AlertBar alert={unpublishAlert.alert}>{unpublishAlert.text}</AlertBar> : null}
        {createAlert ? <AlertBar success={createAlert.alert}>{createAlert.text}</AlertBar> : null}
        {jobs === null ? <CircularLoader large/> : <ListCatchmentJobs handleJobDetails={handleJobDetails} jobs={jobs} toggle={toggle} setAlert={setAlert} setPublishAlert={setPublishAlert} setUnpublishAlert={setUnpublishAlert}/>}
    </>
}

export default Layout