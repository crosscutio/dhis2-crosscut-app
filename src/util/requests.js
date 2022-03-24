
import { apiFetch } from "./apiConfig";
import axios from 'axios'
const ATTRIBUTE_ID = "JTOrLhPcwuk"; // From local setup, need to find a way to get this
const ORG_UNIT_ID = "BV4IomHvri4"; // From local setup, all of Sierra Leone
import { config } from 'd2';


const baseUrl = "https://play.dhis2.org/dev/api/38"

export const fetchOrgUnitLevels = async () => {
   const resp = await axios.get(`${baseUrl}/organisationUnitLevels.json?fields=id,displayName~rename(name),level&paging=false`, {
        headers: {
          Authorization: `Basic ${btoa("admin:district")}`,
        }
      })
    return resp.data
}

export const fetchOrgUnitGroups = async () => {
    "https://play.dhis2.org/dev/api/38/organisationUnitGroups.json?fields=id,displayName~rename(name)&paging=false"
    const resp = await axios.get(`${baseUrl}/organisationUnitGroups.json?fields=id,displayName~rename(name)&paging=false`, {
        headers: {
            Authorization: `Basic ${btoa("admin:district")}`
        }
    })
    return resp.data
}