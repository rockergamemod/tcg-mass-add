import { MikroORM } from '@mikro-orm/core';
import { TcgCard, CardSourceType } from '@repo/shared-types';
import mikroOrmConfig from 'src/mikro-orm.config';
import TCGdex from '@tcgdex/sdk';

async function main() {
  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();
  // Instantiate the SDK

  const tcgdex = new TCGdex('en');

  const batchSize = Number(process.env['BATCH_SIZE'] ?? 100);
  console.log(`Loading in batches of ${batchSize}...`);

  const allCards = await em.find(
    TcgCard,
    {
      sources: { source: CardSourceType.Tcgdex },
      $or: [
        { image: null },
        { image: '' },
        { imageHigh: null },
        { imageHigh: '' },
      ],
    },
    {
      populate: ['sources', 'set'],
      populateWhere: { sources: { source: CardSourceType.Tcgdex } },
    },
  );

  console.log(`Found ${allCards.length} cards needing images...`);

  for (let i = 0; i < allCards.length; i += batchSize) {
    console.log(`On batch #${i}...`);
    const batch = allCards.slice(i, i + batchSize);
    for (const card of batch) {
      if (card.image?.trim() && card.imageHigh?.trim()) {
        continue;
      }
      const sourceCardId = card?.sources?.[0].sourceCardId;
      if (!sourceCardId) {
        continue;
      }
      const fullCard = await tcgdex.card.get(sourceCardId);
      if (fullCard) {
        card.image = fullCard.getImageURL('low', 'png');
        card.imageHigh = fullCard.getImageURL('high', 'png');
      } else {
        console.log(
          'TCGDex mapping error, card not found: ',
          card.canonicalName,
          card.set.name,
          sourceCardId,
        );
      }
      // card.image = card.sources[0].rawExtra?.['data']['image']
      //   ? card.sources[0].rawExtra?.['data']['image'] + '/low.png'
      //   : undefined;
      em.persist(card);
    }

    await em.flush();
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
