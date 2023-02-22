# nz-suburb-extractor

## How to use

1. From db, run query `select l.Address from lot l left join Customer c on c.Id = l.CustomerId where c.RegionCode = 'NZ_ALL';` and export the data as csv file.
2. Add the csv file to the root of this project and rename it 'NZ_Addresses_prod.csv'.
3. In terminal run: `node fix-csv`. This should output a csv file named 'NZ_Addresses_fixed.csv'.
4. In terminal run: `node extract-suburbs`. This should output a file named 'NZ_Suburbs_Count.csv'.