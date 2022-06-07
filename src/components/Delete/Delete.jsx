import React, { useState } from "react";
import { Modal, ModalActions, ModalContent } from "@dhis2/ui";
import ButtonItem from "../ButtonItem/ButtonItem";
import i18n from "../../locales/index.js";
import { deleteCatchmentJob } from "../../api/crosscutRequests";
import { fetchCurrentAttributes } from "../../api/requests";

function Delete(props) {
  const {
    setShowDelete,
    toggle,
    id,
    handleUnpublish,
    attributeId,
    setIsDeleting,
    setDeleteAlert,
  } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    setIsLoading(true);
    // check to see if the catchment has been published
    if (attributeId !== null) {
      const allAttributes = await fetchCurrentAttributes();
      const found = allAttributes.find((att) => att.id === attributeId);

      if (found !== undefined) {
        await handleUnpublish();
      }
    }
    await deleteCatchmentJob(id);
    toggle();
    setIsLoading(false);
    setShowDelete(false);
    setDeleteAlert(null);
    setDeleteAlert({ text: i18n.t("Deleted") });
    setTimeout(() => {
      setDeleteAlert(null);
      // 5s
    }, 5000);
  };

  const close = () => {
    setShowDelete(false);
  };

  return (
    <Modal>
      <ModalContent>
        {i18n.t(
          "Deleting will delete the catchment areas from the app and remove the catchment areas from DHIS2 if published."
        )}
      </ModalContent>
      <ModalActions>
        <ButtonItem
          handleClick={close}
          buttonText={i18n.t("Cancel")}
          secondary={true}
        />
        <ButtonItem
          buttonText={i18n.t("Delete Forever")}
          loading={isLoading}
          handleClick={handleDelete}
          primary={true}
        />
      </ModalActions>
    </Modal>
  );
}

export default Delete;
