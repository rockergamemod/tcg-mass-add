import { EntityManager } from '@mikro-orm/postgresql';
import { TcgplayerCsvRow } from './tcgplayer-csv-parser';
import { CardSourceType, GameKey } from 'src/infra/database/types';
import {
  TcgCard,
  TcgCardSource,
  TcgGame,
  TcgplayerProduct,
  TcgSet,
} from 'src/infra/database';

interface ImportOptions {
  gameKey?: GameKey;
}

export async function importTcgplayerCsvRows(
  em: EntityManager,
  rows: TcgplayerCsvRow[],
  opts: ImportOptions = {},
) {
  const gameKey = opts.gameKey ?? GameKey.Pokemon;

  const game = await em.findOneOrFail(TcgGame, { key: gameKey });

  // Basic simple loop; you can optimize with batch lookups later
  for (const row of rows) {
    if (row.productLine !== 'Pokemon') continue; // filter if CSV has multiple lines

    // 1. Upsert set
    let set = await em.findOne(TcgSet, {
      game,
      code: row.setName,
    });

    if (!set) {
      set = em.create(TcgSet, {
        game,
        code: row.setName,
        name: row.setName,
      });
      em.persist(set);
    }

    // 2. Upsert card (set + number)
    let card = await em.findOne(TcgCard, {
      set,
      number: row.number,
    });

    if (!card) {
      card = em.create(TcgCard, {
        set,
        number: row.number,
        canonicalName: row.productName, // you can clean later from other sources
      });
      em.persist(card);
    }

    // 3. Upsert TcgCardSource for TCGplayer
    let source = await em.findOne(TcgCardSource, {
      card,
      source: CardSourceType.Tcgplayer,
      sourceCardId: row.tcgplayerProductId,
    });

    if (!source) {
      source = em.create(TcgCardSource, {
        card,
        source: CardSourceType.Tcgplayer,
        sourceCardId: row.tcgplayerProductId,
        sourceSetCode: row.setCode,
        sourceSetName: row.setName,
        sourceName: row.productName,
        isPrimary: true,
      });
      em.persist(source);
    } else {
      // keep mapping but update provider fields if changed
      source.sourceSetCode = row.setCode;
      source.sourceSetName = row.setName;
      source.sourceName = row.productName;
    }

    // 4. Upsert TcgplayerProduct
    let product = await em.findOne(TcgplayerProduct, {
      tcgplayerProductId: Number(row.tcgplayerProductId),
    });

    if (!product) {
      product = em.create(TcgplayerProduct, {
        tcgplayerProductId: Number(row.tcgplayerProductId),
        cardSource: source,
        productLine: row.productLine,
        productName: row.productName,
        setName: row.setName,
        setCode: row.setCode,
        number: row.number,
        isActive: true,
        lastSeenAt: new Date(),
      });
      em.persist(product);
    } else {
      product.cardSource = source;
      product.productLine = row.productLine;
      product.productName = row.productName;
      product.setName = row.setName;
      product.setCode = row.setCode;
      product.number = row.number;
      product.isActive = true;
      product.lastSeenAt = new Date();
    }
  }

  await em.flush();
}
