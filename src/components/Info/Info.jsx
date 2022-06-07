import React, { useState } from "react";
import {
  TabBar,
  Tab,
  Modal,
  ModalContent,
  ModalActions,
  ModalTitle,
  IconDelete16,
  IconFileDocument16,
  Divider,
} from "@dhis2/ui";
import ButtonItem from "../ButtonItem/ButtonItem";
import i18n from "../../locales/index.js";
import styles from "./Info.module.css";

function Info(props) {
  const { setShowInfoModal } = props;
  const [activeTab, setActiveTab] = useState(1);

  // handle switch between the tabs
  const handleTabSwitch1 = () => {
    setActiveTab(1);
  };
  const handleTabSwitch2 = () => {
    setActiveTab(2);
  };

  // TO-DO: refactor this code to improve how we're handling text
  return (
    <Modal>
      <TabBar fixed>
        <Tab
          onClick={handleTabSwitch1}
          selected={activeTab === 1}
          dataTest="dhis2-uicore-tab"
        >
          {i18n.t("User Guide")}
        </Tab>
        <Tab
          onClick={handleTabSwitch2}
          selected={activeTab === 2}
          dataTest="dhis2-uicore-tab"
        >
          {i18n.t("Additional Features")}
        </Tab>
      </TabBar>
      <ModalContent className={styles.info}>
        {activeTab === 1 ? (
          <div>
            <ModalTitle>
              {i18n.t("How to create new catchment areas")}
            </ModalTitle>
            <p className={styles.align}>
              {i18n.t("Click")}
              <ButtonItem
                primary={true}
                buttonText={i18n.t("Create catchment areas")}
              />
            </p>
            <p>{i18n.t("Select the country you want to target.")}</p>
            <p>{i18n.t("Name the catchment areas.")}</p>
            <p>
              {i18n.t(
                "Choose the admin level where your facilities are located."
              )}
            </p>
            <p>{i18n.t("Choose which groups of facilities to include.")}</p>
            <p>
              {i18n.t(
                "You can use your catchment areas to create thematic maps and other views in the maps module of DHIS2."
              )}
            </p>
            <Divider />
            <ModalTitle>{i18n.t("Understanding the statuses")}</ModalTitle>
            <p>
              <b>{i18n.t("Pending")}</b>:{" "}
              {i18n.t("your catchment areas are being created.")}
            </p>
            <p>
              <b>{i18n.t("Ready")}</b>:{" "}
              {i18n.t(
                "your catchment areas have been created and ready to be published to DHIS2."
              )}
            </p>
            <p>
              <b>{i18n.t("Publishing")}</b>:{" "}
              {i18n.t(
                "your catchment areas is in the process of being published."
              )}
            </p>
            <p>
              <b>{i18n.t("Published")}</b>:{" "}
              {i18n.t("your catchment areas have been published to DHIS2.")}
            </p>
            <Divider />
            <ModalTitle>{i18n.t("How to delete catchment areas")}</ModalTitle>
            <p className={styles.align}>
              {i18n.t("Click")}
              <ButtonItem buttonText={<IconDelete16 />} borderless={true} />
              {i18n.t("to delete the catchment area.")}
            </p>
            <p>
              {i18n.t(
                "If you have published the catchment areas to DHIS2 then it will be removed from DHIS2."
              )}
            </p>
            <Divider />
            <ModalTitle>
              {i18n.t("Publish your catchment areas to DHIS2")}
            </ModalTitle>
            <p className={styles.align}>
              {i18n.t("Click")}
              <ButtonItem buttonText={i18n.t("Publish")} primary={true} />
              {i18n.t("to connect your catchments to DHIS2.")}
            </p>
            <p>
              {i18n.t(
                "Once published, you can access the catchment areas in DHIS2"
              )}
            </p>
            <p className={styles.align}>
              {i18n.t("Click")}
              <ButtonItem buttonText={i18n.t("Unpublish")} primary={true} />
              {i18n.t("to remove access to the catchment areas in DHIS2.")}
            </p>
            <Divider />
            <ModalTitle>{i18n.t("Catchment areas details")}</ModalTitle>
            <p>
              {i18n.t(
                "Details will only show for catchment areas created in the DHIS2 app."
              )}
            </p>
            <p className={styles.align}>
              {i18n.t("Click")}
              <ButtonItem
                buttonText={<IconFileDocument16 />}
                borderless={true}
              />
              {i18n.t("to see details on the catchment areas.")}
            </p>
          </div>
        ) : (
          <div>
            <ModalTitle>{i18n.t("Additional Features")}</ModalTitle>
            <li>{i18n.t("Make changes to the catchment area borders.")}</li>
            <li>
              {i18n.t(
                "See heat maps for walking distance for each catchment area."
              )}
            </li>
            <p>
              {i18n.t("Go to")}{" "}
              <a
                style={{ color: "#0d47a1" }}
                href="https://app.crosscut.io/"
                target="_blank"
              >
                app.crosscut.io
              </a>
            </p>
            <Divider />
            <ModalTitle>{i18n.t("Contact Us")}</ModalTitle>
            <p>{i18n.t("Having trouble? Have ideas for new features?")}</p>
            <p>
              {i18n.t("Email us at")}{" "}
              <a
                style={{ color: "#0d47a1" }}
                href="mailto:coite@crosscut.io"
                target="_blank"
              >
                coite@crosscut.io
              </a>
            </p>
          </div>
        )}
      </ModalContent>
      <ModalActions>
        <ButtonItem
          handleClick={setShowInfoModal}
          buttonText={i18n.t("Close")}
          primary={true}
        />
      </ModalActions>
    </Modal>
  );
}

export default Info;
