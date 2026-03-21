# TCGPlayer Mass Add

## ETL How To

First start the docker-compose stack, this gives you a database to use for the data to land:

```bash
docker compose up
```

Then you need to ensure the migrations are up on this database. The port is forwarded to `15433`, so use that port.

```bash
cd apps/backend
DB_PORT=15433 npm run db:prepare
```

Now we can start loading data. You will need an export of the TCGPlayer pricing CSV. This can be found by:

1. Navigating to https://store.tcgplayer.com/admin/pricing
2. Click "Export Filtered CSV"
3. Select:
   - Category: "Pokemon"
   - Set Names: "All Set Names"
   - Conditions: "Near Mint"
   - Rarities: "All Rarities"
   - Languages: "English"
   - Printings: "All Printings"
4. Click "Export Filtered CSV"

This CSV will be used to provide all the TCGPlayer related data needed to populate the database.

Finally, we can run the ETL job. This will take a few minutes so be patient:

```bash
cd apps/backend
DB_PORT=15433 npm run etl:load:all -- /path/to/tcgplayer-csv
```

Done!
