import React, { useState } from 'react'
import ListCatchmentJobs from '../pages/ListCatchmentJobs'
// import AddCatchment from '../pages/AddCatchment'
import Create from '../components/Create/Create'
import Info from '../components/Info/Info'
import Nav from '../components/Nav/Nav'
import i18n from '../locales/index.js'

function Layout(props) {
    const [showModal, setShowModal] = useState(false)
    const [showInfoModal, setShowInfoModal] = useState(false)
    const [modalText, setModalText] = useState({ title: "", action: ""})

    const handleClick = () => {
        setShowModal(true) 
        setModalText({title: i18n.t("Create new catchment areas"), action: i18n.t("Create")})
    }

    const handleInfo = () => {
        setShowInfoModal(true)
    }

    return <>
        <Nav handleClick={handleClick} handleInfo={handleInfo}/>
        { showModal === true ? <Create title={modalText.title} setShowModal={setShowModal} action={modalText.action}/> : null}
        { showInfoModal === true ? <Info setShowInfoModal={setShowInfoModal}/> : null}
        <ListCatchmentJobs token={props.token}/>
    </>
}

export default Layout