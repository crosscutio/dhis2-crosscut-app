import d2 from 'd2';

export const fetchOrgUnits = async () => {
    const d2 = await d2();
    const collection = await d2.models.organisationUnits.list({
        userDataViewFallback: true,
        fields:
            'id,path,displayName,children[id,path,displayName,children::isNotEmpty]',
    });
    return collection.toArray();
};