import React from 'react'
import ButtonItem from '../ButtonItem/ButtonItem'
import { IconInfo24, IconMail24, IconWorld24 } from '@dhis2/ui';
import styles from './Nav.module.css';

function Nav(props) {
    return <nav className={styles.navbar}>
        <div>
            <ButtonItem buttonText={"Create"} handleClick={props.handleClick} type={"primary"}/>
        </div>
        <div className={styles.sidebar}>
            <IconMail24/>
            <IconInfo24 />
            <IconWorld24/>
        </div> 
    </nav>
}

export default Nav
