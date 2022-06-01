import React from "react"
import { 
    Modal, 
    ModalActions, 
    ModalContent, 
    ModalTitle, 
} from '@dhis2/ui'
import ButtonItem from '../ButtonItem/ButtonItem'
import i18n from '../../locales/index.js'

function Popup(props) {
    const { title, content, setShow } = props

    const close = () => {
        setShow(prevState => !prevState)
    }
    
    return <Modal>
        <ModalTitle>{title}</ModalTitle>
        <ModalContent>
        {content}
        </ModalContent>
        <ModalActions><ButtonItem handleClick={close} buttonText={i18n.t("Close")} secondary={true}/></ModalActions>
    </Modal>
}

export default Popup