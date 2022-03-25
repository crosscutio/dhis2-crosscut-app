
import api from "./apiConfig"

export const fetchOrgUnitLevels = async () => {
   const resp = await api.get(`/organisationUnitLevels.json?fields=id,displayName~rename(name),level&paging=false`)
    return resp.data
}

export const fetchOrgUnitGroups = async () => {
    const resp = await api.get(`/organisationUnitGroups.json?fields=id,displayName~rename(name)&paging=false`)
    return resp.data
}



export const fetchCatchmentsInUse = async () => {
    const resp = await api.get(`/maps.json?filter=mapViews.orgUnitField:eq:ihn1wb9eho8`)
    return resp.data
}

export const fetchCurrentAttributes = async () => {
    const resp = await api.get(`/attributes.json?fields=id,name&filter=valueType:eq:GEOJSON&filter=organisationUnitAttribute:eq:true&paging=false`)
    return resp.data.attributes
}