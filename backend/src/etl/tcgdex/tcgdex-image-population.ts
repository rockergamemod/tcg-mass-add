import { MikroORM } from '@mikro-orm/core';
import { TcgCard, TcgCardSource } from 'src/infra/database';
import { CardSourceType } from 'src/infra/database/types';
import mikroOrmConfig from 'src/mikro-orm.config';

async function main() {
  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();
  // Instantiate the SDK

  const allCards = await em.find(
    TcgCard,
    { sources: { source: CardSourceType.Tcgdex } },
    { populate: ['sources'] },
  );

  for (const card of allCards) {
    card.image = card.sources[0].rawExtra?.['data']['image']
      ? card.sources[0].rawExtra?.['data']['image'] + '/low.png'
      : undefined;
    em.persist(card);
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
