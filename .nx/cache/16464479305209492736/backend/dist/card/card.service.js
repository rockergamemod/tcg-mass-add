"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardService = void 0;
const nestjs_1 = require("@mikro-orm/nestjs");
const postgresql_1 = require("@mikro-orm/postgresql");
const common_1 = require("@nestjs/common");
const database_1 = require("../infra/database");
const types_1 = require("../infra/database/types");
let CardService = class CardService {
    cardRepo;
    constructor(cardRepo) {
        this.cardRepo = cardRepo;
    }
    async findAll(gameKey, seriesId, setId, options = {
        page: 0,
        limit: 1000,
    }) {
        const queryOptions = {
            limit: options.limit,
            offset: options.limit * options.page,
        };
        const cards = await this.cardRepo.find({ set: { id: setId, game: { key: gameKey }, series: { id: seriesId } } }, {
            fields: [
                '*',
                'printings.*',
                'printings.source.id',
                'set.*',
                'sources.sourceName',
                'sources.sourceSetCode',
            ],
            populate: ['printings', 'set', 'sources'],
            populateWhere: {
                sources: {
                    source: types_1.CardSourceType.Tcgplayer,
                },
            },
            ...queryOptions,
        });
        return cards;
    }
    findOne(gameKey, seriesId, setId, cardId) {
        return this.cardRepo.findOne(cardId, {
            populate: ['printings', 'set'],
        });
    }
};
exports.CardService = CardService;
exports.CardService = CardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectRepository)(database_1.TcgCard)),
    __metadata("design:paramtypes", [postgresql_1.EntityRepository])
], CardService);
//# sourceMappingURL=card.service.js.map