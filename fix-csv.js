const fs = require('fs');

try {
  const data = fs.readFileSync('./NZ_Addresses_prod.csv', 'utf8');
  const strung = data.toString();
  const allLines = strung.split(/\n/g);
  const isHeaderRow = allLines[0].startsWith('Address');

  if (allLines.length < (isHeaderRow ? 2 : 1)) {
    console.log('only one line exists. exiting early with assumption that one line is the heading.');
    return;
  }

  const lines = isHeaderRow ? allLines.slice(1) : allLines; // exclude heading row

  const combinedLines = [];
  let pair = [];

  for (const line of lines) {
    pair.push(line);

    if (pair.length < 2) {
        continue;
    }

    const combined = pair.join(' ');
    combinedLines.push(combined)
    pair = [];
  }

  const writeStream = fs.createWriteStream('./NZ_Addresses_fixed.csv');
  writeStream.write(`Address\n`);

  for (const line of combinedLines) {
      writeStream.write(`${line}\n`);
  }

} catch (err) {
  console.error(err);
}