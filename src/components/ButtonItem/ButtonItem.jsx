import React from 'react'
import { Button } from '@dhis2/ui'
import styles from './ButtonItem.module.css'

function ButtonItem(props) {
    const { handleClick, buttonText } = props
    return <div className={styles.button}>
        <Button onClick={handleClick} primary>{buttonText}</Button>
    </div>
}

export default ButtonItem
