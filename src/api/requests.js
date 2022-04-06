import ky from 'ky'
import { options, getBaseURL } from "./apiConfig"

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

export const fetchGeoJSON = async (id) => {
    const resp = await ky(`${baseURL}/geoFeatures?includeGroupSets=false&ou=ou%3ALEVEL-${id}&displayProperty=NAME`, options).json()

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