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
            </div> : <p>2</p>}
        </ModalContent>
        <ModalActions><ButtonItem handleClick={props.setShowInfoModal} buttonText={"Close"} primary={true}/></ModalActions>
    </Modal>
}

export default Info
