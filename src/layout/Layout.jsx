import React, { useState, useEffect } from "react";
import ListCatchmentJobs from "../pages/ListCatchmentJobs";
import Create from "../components/Create/Create";
import Info from "../components/Info/Info";
import Nav from "../components/Nav/Nav";
import i18n from "../locales/index.js";
import { AlertBar, CircularLoader } from "@dhis2/ui";
import { fetchCatchmentJobs } from "../api/crosscutRequests";
import { useToggle } from "../hooks/useToggle";
import { setToken, setUser, deleteToken } from "../services/JWTManager";
import { Auth } from "aws-amplify";

function Layout(props) {
  const [alert, setAlert] = useState(null);
  const [publishAlert, setPublishAlert] = useState(null);
  const [unpublishAlert, setUnpublishAlert] = useState(null);
  const [createAlert, setCreateAlert] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalText, setModalText] = useState({ title: "", action: "" });
  const [jobs, setJobs] = useState(null);
  const [isToggled, toggle] = useToggle(false);

  const { token, user } = props;
  setToken(token);
  setUser(user);

  let poller;

  useEffect(() => {
    checkTokenExpire();
    return () => {
      // this is a clean up function
    };
  }, [token]);

  useEffect(() => {
    // poll every 5s
    poller = setInterval(() => {
      fetchJobs();
    }, 5000);
    return () => {
      // this is a clean up function
    };
  }, [isToggled]);

  // force logout if token is expired
  const checkTokenExpire = () => {
    const expiration = JSON.parse(atob(token.split(".")[1])).exp * 1000;
    const date = new Date().getTime();
    const expirationDate = new Date(expiration).getTime();

    setTimeout(() => {
      Auth.signOut();
      deleteToken();
    }, expirationDate - date);
  };

  const fetchJobs = async () => {
    const resp = await fetchCatchmentJobs();
    setJobs(resp);

    // check for loading jobs
    const foundLoading = resp.find((job) => job.status === "Pending");

    if (foundLoading === undefined) {
      clearInterval(poller);
    }
  };

  // handle create modal
  const handleCreate = () => {
    setShowCreateModal(true);
    setModalText({
      title: i18n.t("Create new catchment areas"),
      action: i18n.t("Create"),
    });
  };

  const handleInfo = () => {
    setShowInfoModal(true);
  };

  return (
    <>
      <Nav handleClick={handleCreate} jobs={jobs} handleInfo={handleInfo} />
      {showCreateModal === true ? (
        <Create
          title={modalText.title}
          setShowCreateModal={setShowCreateModal}
          action={modalText.action}
          toggle={toggle}
          setAlert={setAlert}
          setCreateAlert={setCreateAlert}
        />
      ) : null}
      {showInfoModal === true ? (
        <Info setShowInfoModal={setShowInfoModal} />
      ) : null}
      {alert ? (
        <AlertBar
          critical={alert.critical}
          alert={alert.alert}
          success={alert.success}
        >
          {alert.text}
        </AlertBar>
      ) : null}
      {publishAlert ? (
        <AlertBar alert={publishAlert.alert} critical={publishAlert.critical}>
          {publishAlert.text}
        </AlertBar>
      ) : null}
      {unpublishAlert ? (
        <AlertBar
          alert={unpublishAlert.alert}
          critical={unpublishAlert.critical}
        >
          {unpublishAlert.text}
        </AlertBar>
      ) : null}
      {deleteAlert ? (
        <AlertBar alert={deleteAlert.alert}>{deleteAlert.text}</AlertBar>
      ) : null}
      {createAlert ? (
        <AlertBar success={createAlert.success}>{createAlert.text}</AlertBar>
      ) : null}
      {jobs === null ? (
        <CircularLoader large />
      ) : (
        <ListCatchmentJobs
          jobs={jobs}
          toggle={toggle}
          setAlert={setAlert}
          setPublishAlert={setPublishAlert}
          setUnpublishAlert={setUnpublishAlert}
          setDeleteAlert={setDeleteAlert}
        />
      )}
    </>
  );
}

export default Layout;
