
import api from "./apiConfig"


export const fetchOrgUnitLevels = async () => {
   const resp = await api.get(`/organisationUnitLevels.json?fields=id,displayName~rename(name),level&paging=false`)
    return resp.data
}

export const fetchOrgUnitGroups = async () => {
    const resp = await api.get(`/organisationUnitGroups.json?fields=id,displayName~rename(name)&paging=false`)
    return resp.data
}