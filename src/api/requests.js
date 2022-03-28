import ky from 'ky'

const baseURL = "https://play.dhis2.org/dev/api/38"
const headers = `Basic ${btoa("admin:district")}`

export const fetchOrgUnitLevels = async () => {
    const meh = await ky.get(`${baseURL}/organisationUnits.json?fields=id,displayName~rename(name)&paging=false`, { headers: { authorization: headers }}).json()
    console.log(meh)
   const resp = await ky.get(`${baseURL}/organisationUnitLevels.json?fields=id,displayName~rename(name),level&paging=false&order=level:asc`, { headers: { authorization: headers }}).json()
    return resp.organisationUnitLevels
}

export const fetchOrgUnitGroups = async () => {
    const resp = await ky.get(`${baseURL}/organisationUnitGroups.json?fields=id,displayName~rename(name)&paging=false`, { headers: { authorization: headers }}).json()
    return resp.organisationUnitGroups
}

export const fetchCatchmentsInUse = async () => {
    const resp = await ky.get(`${baseURL}/maps.json?filter=mapViews.orgUnitField:eq:ihn1wb9eho8`, { headers: { authorization: headers }}).json()
    return resp.maps
}

export const fetchCurrentAttributes = async () => {
    const resp = await ky.get(`${baseURL}/attributes.json?fields=id,name&filter=valueType:eq:GEOJSON&filter=organisationUnitAttribute:eq:true&paging=false`, { headers: { authorization: headers }}).json()
    return resp.attributes
}

export const fetchGeoJSON = async (id) => {
    const resp = await ky(`${baseURL}/geoFeatures?includeGroupSets=false&ou=ou%3ALEVEL-${id}&displayProperty=NAME`, { headers: { authorization: headers }}).json()

    const features = resp.map((feature) => {
        const coord = JSON.parse(feature.co)
        let type = "Point" 

        if (feature.ty === 2) {
            type = "Polygon"
        }

        return {
            type: "Feature",
            id: feature.id,
            geometry: {
                type,
                coordinates: coord
            },
            properties: {
                id: feature.id,
                name: feature.na,
                level: feature.le,
                parentName: feature.pn,
                parentId: feature.pi
            }
        }
    })
    const geojson = {
        type: "FeatureCollection",
        features
    }

    return geojson
}