import React from 'react'
import { FlyoutMenu, MenuItem } from '@dhis2/ui';

function Lang() {
    return <FlyoutMenu>
        <MenuItem label="English" />
        <MenuItem label="Français" />
    </FlyoutMenu>
}

export default Lang