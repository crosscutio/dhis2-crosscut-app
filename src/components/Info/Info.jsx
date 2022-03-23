import React, { useState } from "react"
import { TabBar, Tab, Modal, ModalContent, ModalActions } from "@dhis2/ui"
import ButtonItem from "../ButtonItem/ButtonItem"

function Info(props) {
    const [activeTab, setActiveTab] = useState(1)

    const handleTabSwitch1 = () => {
        setActiveTab(1)
    }
    const handleTabSwitch2 = () => {
        setActiveTab(2)
    }

    return <Modal>
        <ModalContent>
            <TabBar fixed>
                <Tab onClick={handleTabSwitch1} selected={activeTab === 1} dataTest="dhis2-uicore-tab">User Guide</Tab>
                <Tab onClick={handleTabSwitch2} selected={activeTab === 2} dataTest="dhis2-uicore-tab">Additional Features</Tab>
            </TabBar>
            {activeTab === 1 ? <div>
                <p>1</p>
            </div> : 
            <div>
                <h5>Additional Features</h5>
                <li>Make changes to the catchment area borders</li>
                <li>See heat maps for walking distance for each catchment area</li>
                <p>Go to <a href="app.crosscut.io" target="_blank" >app.crosscut.io</a></p>
                <h5>Contact Us</h5>
                <p>Having trouble? Have ideas for new features?</p>
                <p>Email us at <a href=":mailto:" target="_blank">insert email</a></p>
            </div>
            }
        </ModalContent>
        <ModalActions><ButtonItem handleClick={props.setShowInfoModal} buttonText={"Close"} primary={true}/></ModalActions>
    </Modal>
}

export default Info
