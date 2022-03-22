import React, { useState } from 'react'
import ListCatchmentJobs from '../pages/ListCatchmentJobs'
// import AddCatchment from '../pages/AddCatchment'
import ModalContainer from '../components/ModalContainer/ModalContainer'
import Nav from '../components/Nav/Nav'

function Layout(props) {
    const [showModal, setShowModal] = useState(false)
    const [modalText, setModalText] = useState({ title: "", action: ""})
    const handleClick = () => {
        setShowModal(true) 
        setModalText({title: "Create new catchment areas", action: "Create"})
    }


    return <>
        <Nav handleClick={handleClick}/>
        { showModal === true ? <ModalContainer title={modalText.title} setShowModal={setShowModal} action={modalText.action}/> : null}
        <ListCatchmentJobs token={props.token}/>
    </>
}

export default Layout