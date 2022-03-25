
import api from "./apiConfig"

export const fetchOrgUnitLevels = async () => {
    const meh = await api.get(`/organisationUnits.json?fields=id,displayName~rename(name)&paging=false`)
    console.log(meh)
   const resp = await api.get(`/organisationUnitLevels.json?fields=id,displayName~rename(name),level&paging=false&order=level:asc`)
    return resp.data.organisationUnitLevels
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

export const fetchGeoJSON = async (id) => {
    const resp = await api.get(`/geoFeatures?includeGroupSets=false&ou=ou%3ALEVEL-${id}&displayProperty=NAME`)
    return resp.data
}