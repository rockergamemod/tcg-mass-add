"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const database_1 = require("../../infra/database");
const types_1 = require("../../infra/database/types");
const mikro_orm_config_1 = __importDefault(require("../../mikro-orm.config"));
const sdk_1 = __importDefault(require("@tcgdex/sdk"));
async function main() {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    const em = orm.em.fork();
    const tcgdex = new sdk_1.default('en');
    const batchSize = Number(process.env['BATCH_SIZE'] ?? 100);
    console.log(`Loading in batches of ${batchSize}...`);
    const allCards = await em.find(database_1.TcgCard, { sources: { source: types_1.CardSourceType.Tcgdex } }, {
        populate: ['sources', 'set'],
        populateWhere: { sources: { source: types_1.CardSourceType.Tcgdex } },
    });
    console.log(`Found ${allCards.length} cards...`);
    for (let i = 0; i < allCards.length; i += batchSize) {
        console.log(`On batch #${i}...`);
        const batch = allCards.slice(i, i + batchSize);
        for (const card of batch) {
            const fullCard = await tcgdex.card.get(card.sources[0].sourceCardId);
            if (fullCard) {
                card.image = fullCard.getImageURL('low', 'png');
                card.imageHigh = fullCard.getImageURL('high', 'png');
            }
            else {
                console.log('TCGDex mapping error, card not found: ', card.canonicalName, card.set.name, card.sources[0].sourceCardId);
            }
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
//# sourceMappingURL=tcgdex-image-population.js.map