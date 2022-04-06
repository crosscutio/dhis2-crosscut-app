import React, { useState, useEffect } from 'react'
import ListCatchmentJobs from '../pages/ListCatchmentJobs'
import Create from '../components/Create/Create'
import Info from '../components/Info/Info'
import Nav from '../components/Nav/Nav'
import i18n from '../locales/index.js'
import JobDetails from '../components/JobDetails/JobDetails'

function Layout() {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showInfoModal, setShowInfoModal] = useState(false)
    const [showJobDetailsModal, setShowJobDetailsModal] = useState(false)
    const [modalText, setModalText] = useState({ title: "", action: ""})


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
        <Nav handleClick={handleCreate} handleInfo={handleInfo}/>
        { showCreateModal === true ? <Create title={modalText.title} setShowCreateModal={setShowCreateModal} action={modalText.action}/> : null}
        { showInfoModal === true ? <Info setShowInfoModal={setShowInfoModal}/> : null}
        { showJobDetailsModal === true ? <JobDetails setShowJobDetailsModal={setShowJobDetailsModal} title={modalText.title} action={modalText.action}/> : null}
        <ListCatchmentJobs handleJobDetails={handleJobDetails}/>
    </>
}

export default Layout