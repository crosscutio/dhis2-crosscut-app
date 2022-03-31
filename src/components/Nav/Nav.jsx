import React, { useState } from 'react'
import ButtonItem from '../ButtonItem/ButtonItem'
import Lang from '../Lang/Lang'
import { IconInfo24, IconMail24, IconWorld24, Button } from '@dhis2/ui';
import styles from './Nav.module.css';
import i18n from '../../locales/index.js'

function Nav(props) {
    const [showLang, setShowLang] = useState(false)
    const sendEmail = () => {
        // need to update email with an info email
        window.location = "mailto:test@crosscut.io";
    }

    const openLang = () => {
        setShowLang(prevState => !prevState)
    }
    
    return <>
        <nav className={styles.navbar}>
            <div>
                <ButtonItem buttonText={i18n.t("Create")} handleClick={props.handleClick} primary={true}/>
            </div>
            <div className={styles.sidebar} >
                <ButtonItem handleClick={sendEmail} buttonText={<IconMail24/>} borderless={true}/> 
                <ButtonItem handleClick={props.handleInfo} buttonText={<IconInfo24/>} borderless={true}/>
                <ButtonItem handleClick={openLang} buttonText={<IconWorld24/>} borderless={true}/>                 
            </div>   
        </nav>
        
        {showLang === true ? 
        <div className={styles.lang}>
            <Lang/>
        </div> 
        : null
        } 
    </>
}

export default Nav
