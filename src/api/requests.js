import ky from 'ky'
import { options } from "./apiConfig"
import { getCatchmentGeoJSON, updateCatchmentItem } from "./crosscutRequests"
import i18n from "../locales/index"


let dhis2Api = {
    get: () => {
        throw new Error("Call setupDHIS2Api before using API!");
    },
    post: () => {
        throw new Error("Call setupDHIS2Api before using API!");
    },
};

export const setupDHIS2Api = ({ baseUrl, apiVersion }) => {
    dhis2Api = ky.create({
        prefixUrl: `${baseUrl}/api/${apiVersion}`,
    });
};


export const fetchOrgUnits = async () => {
    const orgUnits = await dhis2Api.get(`organisationUnits.json?fields=%3Aall&paging=false`, { ...options }).json()
    return orgUnits.organisationUnits
}

export const fetchOrgUnitLevels = async () => {
    const resp = await dhis2Api.get(`organisationUnitLevels.json?fields=id,displayName~rename(name),level&paging=false&order=level:asc`, { ...options }).json()
    return resp.organisationUnitLevels
}

export const fetchOrgUnitGroups = async () => {
    const resp = await dhis2Api.get(`organisationUnitGroups.json?fields=id,displayName~rename(name)&paging=false`, { ...options }).json()
    return resp.organisationUnitGroups
}

export const fetchACatchmentInUse = async (id) => {
    // id is the attribute id
    const resp = await dhis2Api.get(`maps.json?filter=mapViews.orgUnitField:eq:${id}`, { ...options }).json()
    return resp.maps
}

export const fetchCurrentAttributes = async () => {
    const resp = await dhis2Api.get(`attributes.json?fields=id,name&filter=valueType:eq:GEOJSON&filter=organisationUnitAttribute:eq:true&paging=false`, { ...options }).json()
    return resp.attributes
}

export const fetchValidPoints = async (levelId, groupId) => {
    let url
    if (levelId !== "" && groupId.length === 0) {
        url = `geoFeatures?ou=ou%3ALEVEL-${levelId}&displayProperty=NAME`
    } else if (levelId === "" && groupId.length > 0) {
        let groupLink = []
        if (groupId.length > 1) {
            groupId.forEach((id) => groupLink.push(`%3BOU_GROUP-${id}`))
        } else {
            groupLink = groupId
        }
        url = `geoFeatures?ou=ou%3AOU_GROUP-${groupLink}&displayProperty=NAME`
    }

    let resp = await dhis2Api(`${url}`, { ...options }).json()
    resp = resp.filter((feature) => feature.ty === 1)

    const features = resp.map((feature) => {
        const coord = JSON.parse(feature.co)
        const lat = coord[1]
        const long = coord[0]
        return {
            id: feature.id,
            lat,
            long,
            name: feature.na,
            level: feature.le,
            parentName: feature.pn,
            parentId: feature.pi,
            code: feature.code
        }
    })
    return features
}

export const deleteAttribute = async (id) => {
    await dhis2Api.delete(`attributes/${id}`, { ...options }).json()
}

export const publishCatchment = async (body) => {
    let attributeId = null
    try {
        // need a way to check if the country is available on DHIS2
        const features = await getCatchmentGeoJSON(body.id)
        const orgUnits = await fetchOrgUnits()

        const validFeatures = features.filter((feature) => orgUnits.find((unit) => unit.id === feature.properties["user:orgUnitId"]))

        if (validFeatures.length === 0) {
            throw { message: "Nothing to publish" }
        }

        let des
        if (body.details.levelId === "" && body.details.groupId.length >= 1) {
            const groups = await fetchOrgUnitGroups()
            des = body.details.groupId.map((g) => {
                return groups.find((group) => group.id === g).name
            })
        } else if (body.details.groupId.length === 0 && body.details.levelId !== "") {
            const levels = await fetchOrgUnitLevels()
            des = levels.find((level) => level.id === body.details.levelId).name
        }

        // format: groups: Clinic | email@crosscut.io | 2022-05-05
        body.payload.description = Array.isArray(des) ? `groups: ${des.join(", ")} | ${body.user} | ${body.date}` : `level: ${des} | ${body.user} | ${body.date}`

        // this endpoint posts an attribute and returns uid
        const resp = await dhis2Api.post(`attributes`, { json: body.payload, ...options }).json()

        // use this id to store with the catchment areas
        attributeId = resp?.response?.uid

        const json = validFeatures.reduce((acc, val) => {
            const orgId = val.properties["user:orgUnitId"]
            const exists = orgUnits.find((unit) => unit.id === orgId)
            const geojson = JSON.stringify(val.geometry)
            exists.attributeValues.push({
                attribute: {
                    id: attributeId
                },
                value: geojson
            })
            acc.push(exists)
            return acc
        }, [])

        // update multiple catchments at once
        await dhis2Api.post(`metadata`, {
            ...options,
            json: { organisationUnits: json }
        }).json()

        body.setStatus(i18n.t("Unpublish from DHIS2"))

        // add attribute id to catchment areas on Crosscut
        await updateCatchmentItem(body.id, { field: "attributeId", value: attributeId })
    } catch (err) {
        // delete attribute if publish fails
        if (attributeId !== null) {
            await deleteAttribute(attributeId)
        }
        body.setStatus(i18n.t("Publish to DHIS2"))
        throw err
    }
}

export const unPublishCatchment = async (body) => {
    try {
        // remove attributes from each org unit and attribute
        const features = await getCatchmentGeoJSON(body.id)

        const orgUnits = await fetchOrgUnits()

        const validFeatures = features.filter((feature) => orgUnits.find((unit) => unit.id === feature.properties["user:orgUnitId"]))

        const json = validFeatures.reduce((acc, val) => {
            const orgId = val.properties["user:orgUnitId"]
            const orgUnit = orgUnits.find((unit) => unit.id === orgId)
            const filtered = orgUnit.attributeValues.filter((value) => value.attribute.id !== body.attributeId)
            acc.push({ ...orgUnit, ...{ attributeValues: filtered } })
            return acc
        }, [])

        await dhis2Api.post(`metadata`, {
            ...options,
            json: { organisationUnits: json }
        }).json()
        // delete attribute
        await deleteAttribute(body.attributeId)

        body.setStatus(i18n.t("Publish to DHIS2"))

        // remove the attribute id from the catchment ares on Crosscut
        await updateCatchmentItem(body.id, { field: "attributeId" })
    } catch (err) {
        body.setStatus(i18n.t("Unpublish from DHIS2"))
        throw err
    }

}