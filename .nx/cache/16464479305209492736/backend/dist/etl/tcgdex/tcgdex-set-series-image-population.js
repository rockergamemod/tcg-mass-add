"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("../../mikro-orm.config"));
const sdk_1 = __importDefault(require("@tcgdex/sdk"));
const tcg_series_entity_1 = require("../../infra/database/tcg-series.entity");
async function main() {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    const em = orm.em.fork();
    const tcgdex = new sdk_1.default('en');
    const allSeries = await em.findAll(tcg_series_entity_1.TcgSeries);
    for (const series of allSeries) {
        const dexseries = await tcgdex.serie.get(series.name);
        if (!dexseries) {
            console.log('Error finding series', series.name);
            continue;
        }
        const logo = dexseries.getImageURL('png');
        if (logo === 'undefined.png') {
            series.logo = undefined;
        }
        else {
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
//# sourceMappingURL=tcgdex-set-series-image-population.js.map