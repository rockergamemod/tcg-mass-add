"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTcgplayerCsv = parseTcgplayerCsv;
const node_fs_1 = __importDefault(require("node:fs"));
const csv_parse_1 = require("csv-parse");
async function parseTcgplayerCsv(filePath) {
    return new Promise((resolve, reject) => {
        const rows = [];
        node_fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parse_1.parse)({
            columns: true,
            trim: true,
            skip_empty_lines: true,
        }))
            .on('data', (record) => {
            rows.push({
                tcgplayerProductId: record['TCGplayer Id'],
                productLine: record['Product Line'],
                setName: record['Set Name'],
                productName: record['Product Name'],
                title: record['Title'],
                number: record['Number'],
                rarity: record['Rarity'],
                condition: record['Condition'],
                tcgMarketPrice: record['TCG Market Price'],
            });
        })
            .on('end', () => resolve(rows))
            .on('error', reject);
    });
}
//# sourceMappingURL=tcgplayer-csv-parser.js.map