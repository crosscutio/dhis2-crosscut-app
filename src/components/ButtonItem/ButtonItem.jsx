import React from 'react'
import { Button } from '@dhis2/ui'
import styles from './ButtonItem.module.css'

function ButtonItem(props) {
    const { handleClick, buttonText, primary, secondary, borderless, value } = props
    return <div className={styles.button}>
        <Button value={value} className={borderless === true ? styles.borderless : null} onClick={handleClick} primary={primary} secondary={secondary}>{buttonText}</Button>
    </div>
}

export default ButtonItem
