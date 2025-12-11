import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from 'src/mikro-orm.config';
import TCGdex from '@tcgdex/sdk';
import { TcgSeries } from 'src/infra/database/tcg-series.entity';

async function main() {
  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();
  // Instantiate the SDK

  const tcgdex = new TCGdex('en');

  const allSeries = await em.findAll(TcgSeries);

  for (const series of allSeries) {
    const dexseries = await tcgdex.serie.get(series.name);
    if (!dexseries) {
      console.log('Error finding series', series.name);
      continue;
    }

    const logo = dexseries.getImageURL('png');
    if (logo === 'undefined.png') {
      series.logo = undefined;
    } else {
      series.logo = logo;
    }
    em.persist(series);
  }

  await em.flush();

  await orm.close();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(() => {
    console.log('Import completed');
  });
