const fs = require('fs');

const delimiter = ';';

try {
  const data = fs.readFileSync('./NZ_Addresses_fixed.csv', 'utf8');
  const strung = data.toString();
  const lines = strung.split(/\n/g).slice(1); // remove heading row

  const suburbMap = getNonAusSuburbCount(lines);
  const sortedSuburbs = Object.keys(suburbMap).sort();
  // console.log(sortedSuburbs)

  const writeStream = fs.createWriteStream('./NZ_Suburbs_Count.csv');
  writeStream.write(`Suburb${delimiter}Appearances \n`);

  for (const suburb of sortedSuburbs) {
      writeStream.write(`${suburb}${delimiter}${suburbMap[suburb]}\n`);
  }

} catch (err) {
  console.error(err);
}

function getValueForKey(str, key) {
  const indexKey = str.indexOf(key);
  const indexNextComma = str.indexOf(',', indexKey + 1);
  const indexNextDoubleQuote = str.indexOf('"', indexKey + 1);
  if (indexNextDoubleQuote !== -1 && indexNextDoubleQuote < indexNextComma) {
    // The value is encompassed in double quotes. Find value based on the closing double quote
    const indexEndingDoubleQuote = str.indexOf('"', indexNextDoubleQuote + 1);
    // remove "Suburb:", double quotes and surrounding whitespace
    return str.substring(indexKey + key.length + 1, indexEndingDoubleQuote).replace('"', '').trim();
  }
  // remove "Suburb:" and surrounding whitespace
  return str.substring(indexKey + key.length + 1, indexNextComma).trim();
};

function getNonAusSuburbCount(lines) {
  const suburbMap = {};
  const suburbKey = 'Suburb';
  const countryKey = 'Country';

  for (const line of lines) {
    const country = getValueForKey(line, countryKey);
    if (country.toLowerCase() === 'australia') continue;

    const suburb = getValueForKey(line, suburbKey);
    suburbMap[suburb] = (suburbMap[suburb] ?? 0) + 1; 
  }

  return suburbMap;
}
