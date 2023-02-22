const fs = require('fs');

try {
  const data = fs.readFileSync('./NZ_Addresses.csv', 'utf8');
  const strung = data.toString();
  const allLines = strung.split(/\n/g);
  if (allLines.length < 2) {
    console.log('only one line exists. exiting early with assumption that one line is the heading.');
    return;
  }

  const lines = allLines.slice(1); // exclude heading row

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
  writeStream.write(`${allLines[0]}\n`);

  for (const line of combinedLines) {
      writeStream.write(`${line}\n`);
  }

} catch (err) {
  console.error(err);
}