const localities = require('./localities.json');
const fs = require('fs');

const suburbMap = {};
const districtMap = {};
const localityMap = {};

for (const locality of localities) {
    const lowerLocalityName = locality.Name.toLowerCase();

    if (!localityMap[lowerLocalityName]) {
        localityMap[lowerLocalityName] = {
            LocalityId: locality.LocalityId,
            LocalityName: locality.Name,
            Count: 1
        };
    } else {
        localityMap[lowerLocalityName].Count++;
    }

    for (const district of locality.Districts) {
        const lowerDistrictName = district.Name.toLowerCase();

        if (!districtMap[lowerDistrictName]) {
            districtMap[lowerDistrictName] = [];
        }
        districtMap[lowerDistrictName].push({
            DistrictId: district.DistrictId,
            DistrictName: district.Name,
            LocalityName: locality.Name,
            LocalityId: locality.LocalityId 
        });
        
        for (const suburb of district.Suburbs) {
            const lowerCaseSuburbName = suburb.Name.toLowerCase();

            if (!suburbMap[lowerCaseSuburbName]) {
                suburbMap[lowerCaseSuburbName] = [];
            }

            suburbMap[lowerCaseSuburbName].push({
                SuburbId: suburb.SuburbId,
                SuburbName: suburb.Name,
                DistrictId: district.DistrictId,
                DistrictName: district.Name,
                LocalityName: locality.Name,
                LocalityId: locality.LocalityId
            });
        }
    }
}

const suburbKeys = Object.keys(suburbMap);
const nonUniqueSuburbNames = suburbKeys.filter(k => suburbMap[k].length !== 1);
console.log('the following suburbs occur more than once: ', nonUniqueSuburbNames)


try {
    fs.writeFileSync('suburb-map.json', JSON.stringify(reorderObjectKeys(suburbMap), null, 4));
    fs.writeFileSync('district-map.json', JSON.stringify(reorderObjectKeys(districtMap), null, 4));
    fs.writeFileSync('locality-map.json', JSON.stringify(reorderObjectKeys(localityMap), null, 4));
} catch (err) {
    console.error(err);
}

function reorderObjectKeys(unordered) {
    return Object.keys(unordered).sort().reduce(
        (obj, key) => { 
          obj[key] = unordered[key]; 
          return obj;
        }, 
        {}
    );
}