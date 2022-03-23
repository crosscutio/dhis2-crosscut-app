import React, { useState } from 'react'
import ListCatchmentJobs from '../pages/ListCatchmentJobs'
// import AddCatchment from '../pages/AddCatchment'
import ModalContainer from '../components/ModalContainer/ModalContainer'
import Info from '../components/Info/Info'
import Nav from '../components/Nav/Nav'

function Layout(props) {
    const [showModal, setShowModal] = useState(false)
    const [showInfoModal, setShowInfoModal] = useState(false)
    const [modalText, setModalText] = useState({ title: "", action: ""})
    
    const handleClick = () => {
        setShowModal(true) 
        setModalText({title: "Create new catchment areas", action: "Create"})
    }

    const handleInfo = () => {
        setShowInfoModal(true)
    }

    return <>
        <Nav handleClick={handleClick} handleInfo={handleInfo}/>
        { showModal === true ? <ModalContainer title={modalText.title} setShowModal={setShowModal} action={modalText.action}/> : null}
        { showInfoModal === true ? <Info setShowInfoModal={setShowInfoModal}/> : null}
        <ListCatchmentJobs token={props.token}/>
    </>
}

export default Layout