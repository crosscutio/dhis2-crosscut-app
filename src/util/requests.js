import { apiFetch } from "./apiConfig";

export const fetchOrgUnitFields = () =>
apiFetch(
    `/attributes.json?fields=id,name&filter=valueType:eq:GEOJSON&filter=organisationUnitAttribute:eq:true`
).then(({ attributes }) => attributes);