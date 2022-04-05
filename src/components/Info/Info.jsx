import React, { useState } from "react"
import { TabBar, Tab, Modal, ModalContent, ModalActions } from "@dhis2/ui"
import ButtonItem from "../ButtonItem/ButtonItem"
import i18n from '../../locales/index.js'

function Info(props) {
    const { setShowInfoModal } = props
    const [activeTab, setActiveTab] = useState(1)

    // handle switch between the tabs
    const handleTabSwitch1 = () => {
        setActiveTab(1)
    }
    const handleTabSwitch2 = () => {
        setActiveTab(2)
    }

    return <Modal>
        <ModalContent>
            <TabBar fixed>
                <Tab onClick={handleTabSwitch1} selected={activeTab === 1} dataTest="dhis2-uicore-tab">{i18n.t("User Guide")}</Tab>
                <Tab onClick={handleTabSwitch2} selected={activeTab === 2} dataTest="dhis2-uicore-tab">{i18n.t("Additional Features")}</Tab>
            </TabBar>
            {activeTab === 1 ? <div>
                <h5>How to reate new catchment areas</h5>
                <p>Click INSERT BUTTON</p>
                <p>Select the country you want to target</p>
                <p>Name the catchment areas</p>
                <p>Choose the admin level where your facilities are located</p>
                <p>Choose which groups of facilities to include</p>
                <p>You can use your catchment areas to create thematic maps and other views in the maps module of DHIS2</p>
                <p>1</p>
            </div> : 
            <div>
                <h5>Additional Features</h5>
                <li>Make changes to the catchment area borders</li>
                <li>See heat maps for walking distance for each catchment area</li>
                <p>Go to <a href="app.crosscut.io" target="_blank" >app.crosscut.io</a></p>
                <h5>Contact Us</h5>
                <p>Having trouble? Have ideas for new features?</p>
                {/* TO-DO: insert email */}
                <p>Email us at <a href=":mailto:" target="_blank">insert email</a></p>
            </div>
            }
        </ModalContent>
        <ModalActions><ButtonItem handleClick={setShowInfoModal} buttonText={i18n.t("Close")} primary={true}/></ModalActions>
    </Modal>
}

export default Info
