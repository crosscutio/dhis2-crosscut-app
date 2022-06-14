# DHIS2 Crosscut Microplanning App

A DHIS2 application to create catchment areas for health facilities. The DHIS2 Crosscut Microplanning app is designed for non-technical users.

The app lets you:

-   Create catchment areas boundaries for your health facilities and publish them to DHIS2
-   Create visualizations and maps in DHIS2 by combining the catchment areas with DHIS2 reporting data
-   Generate target population estimates for each catchment area to quickly calculate coverage estimates
-   See travel time to the health facilities within the catchment area to support outreach and session planning
-   Requirements: An account with Crosscut (a third party application) and internet access

Submit requests and issues here: [GitHub Issues](https://github.com/crosscutio/dhis2-crosscut-app/issues/new)

## User Guide

### App setup

-   Install the Microplanning app.
-   Set up a free account with Crosscut within the Microplanning app. It takes less than a minute and allows your Microplanning app to access the Crosscut analytics engine. It also allows you to manually edit catchment areas, visualize health site accessibility heat maps, and access other features at [app.crosscut.io](https://app.crosscut.io/).
-   Internet access (specifically to [api-production.app.crosscut.io](https://api-production.app.crosscut.io)) is required to use the Microplanning app.

### How to create new catchment areas

-   Click `Create catchment areas` button.
-   Select the country you want to target.
-   Name the catchment areas.
-   Choose the admin level where your facilities are located.
-   Choose which groups of facilities to include.
-   You can use your catchment areas to create thematic maps and other views in the maps module of DHIS2.

### Understanding the statuses

-   `Pending`: your catchment areas are being created.
-   `Ready`: your catchment areas have been created and ready to be published to DHIS2.
-   `Publishing`: your catchment areas is in the process of being published.
-   `Published`: your catchment areas have been published to DHIS2.

### How to delete catchment areas

-   Click delete icon to delete the catchment area.
-   If you have published the catchment areas to DHIS2 then it will be removed from DHIS2.

### Publish your catchment areas to DHIS2

-   Click `Publish` button to connect your catchments to DHIS2.
-   Once published, you can access the catchment areas in DHIS2
-   Click `Unpublish` button to remove access to the catchment areas in DHIS2.

### Catchment areas details

-   Click details icon to see details on the catchment areas.
-   Details will only show for catchment areas created in the DHIS2 app.
