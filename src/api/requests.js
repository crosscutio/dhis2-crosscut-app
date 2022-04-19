import ky from 'ky'
import { options, getBaseURL } from "./apiConfig"
import { getCatchmentGeoJSON } from "./crosscutRequests"

const baseURL = getBaseURL()

export const fetchOrgUnitLevels = async () => {
    const orgUnits = await ky.get(`${baseURL}/organisationUnits.json?fields=id,displayName~rename(name)&paging=false`, options).json()

    const resp = await ky.get(`${baseURL}/organisationUnitLevels.json?fields=id,displayName~rename(name),level&paging=false&order=level:asc`, options).json()
    return resp.organisationUnitLevels
}

export const fetchOrgUnitGroups = async () => {
    const resp = await ky.get(`${baseURL}/organisationUnitGroups.json?fields=id,displayName~rename(name)&paging=false`, options).json()
    return resp.organisationUnitGroups
}

export const fetchACatchmentInUse = async (id) => {
    // id is the attribute id
    const resp = await ky.get(`${baseURL}/maps.json?filter=mapViews.orgUnitField:eq:${id}`, options).json()
    return resp.maps
}

export const fetchCurrentAttributes = async () => {
    const resp = await ky.get(`${baseURL}/attributes.json?fields=id,name&filter=valueType:eq:GEOJSON&filter=organisationUnitAttribute:eq:true&paging=false`, options).json()
    return resp.attributes
}

export const fetchGeoJSON = async (levelId, groupId) => {
    let groupLink = []
    if (groupId.length > 1) {   
        groupId.forEach((id) => groupLink.push(`%3BOU_GROUP-${id}`))
    } else {
        groupLink = groupId
    }

    const resp = await ky(`${baseURL}/geoFeatures?ou=ou%3ALEVEL-${levelId}%3BOU_GROUP-${groupLink}&displayProperty=NAME`, options).json()

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

export const fetchValidPoints = async (levelId, groupId) => {
    let groupLink = []
    if (groupId.length > 1) {   
        groupId.forEach((id) => groupLink.push(`%3BOU_GROUP-${id}`))
    } else {
        groupLink = groupId
    }

    let resp = await ky(`${baseURL}/geoFeatures?ou=ou%3ALEVEL-${levelId}%3BOU_GROUP-${groupLink}&displayProperty=NAME`, options).json()

    resp = resp.filter((feature) => feature.ty === 1)

    const features = resp.map((feature) => {
        const coord = JSON.parse(feature.co)
        const lat = coord[1]
        const long = coord[0]
        return {
            id: feature.id,
            lat,
            long,
            id: feature.id,
            name: feature.na,
            level: feature.le,
            parentName: feature.pn,
            parentId: feature.pi,
            code: feature.code
        }
    })
    return features
}

export const postAttribute = async (body) => {
    console.log(body)
    const features = await getCatchmentGeoJSON(body.id)
    console.log(features)
    // this endpoint posts an attribute and returns uid
    const resp = await ky.post(`${baseURL}/attributes`, { body: JSON.stringify(body.payload), headers: options }).json()

    // use this id to store with the catchment areas
    const id = resp?.response?.uid


    // this endpoint gets all attributes
    const attributes = await ky(`${baseURL}/attributes`, options).json()
    console.log(attributes)

}