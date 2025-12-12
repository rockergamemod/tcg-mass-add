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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcgSet = void 0;
const core_1 = require("@mikro-orm/core");
const tcg_game_entity_1 = require("./tcg-game.entity");
const tcg_card_entity_1 = require("./tcg-card.entity");
const tcg_series_entity_1 = require("./tcg-series.entity");
const types_1 = require("./types");
let TcgSet = class TcgSet {
    id;
    game;
    code;
    series;
    name;
    releaseDate;
    isUserVisible;
    logo;
    type;
    cards = new core_1.Collection(this);
};
exports.TcgSet = TcgSet;
__decorate([
    (0, core_1.PrimaryKey)({ type: 'serial', autoincrement: true }),
    __metadata("design:type", Number)
], TcgSet.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => tcg_game_entity_1.TcgGame),
    __metadata("design:type", tcg_game_entity_1.TcgGame)
], TcgSet.prototype, "game", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string', nullable: true }),
    __metadata("design:type", Object)
], TcgSet.prototype, "code", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => tcg_series_entity_1.TcgSeries, { nullable: true }),
    __metadata("design:type", tcg_series_entity_1.TcgSeries)
], TcgSet.prototype, "series", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string' }),
    __metadata("design:type", String)
], TcgSet.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string', nullable: true }),
    __metadata("design:type", Date)
], TcgSet.prototype, "releaseDate", void 0);
__decorate([
    (0, core_1.Property)({ type: 'bool', default: true }),
    __metadata("design:type", Boolean)
], TcgSet.prototype, "isUserVisible", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string', nullable: true }),
    __metadata("design:type", Object)
], TcgSet.prototype, "logo", void 0);
__decorate([
    (0, core_1.Enum)(() => types_1.TcgSetType),
    __metadata("design:type", String)
], TcgSet.prototype, "type", void 0);
__decorate([
    (0, core_1.OneToMany)(() => tcg_card_entity_1.TcgCard, (card) => card.set),
    __metadata("design:type", Object)
], TcgSet.prototype, "cards", void 0);
exports.TcgSet = TcgSet = __decorate([
    (0, core_1.Entity)({ tableName: 'tcg_sets' }),
    (0, core_1.Unique)({ properties: ['game', 'code', 'series'] })
], TcgSet);
//# sourceMappingURL=tcg-set.entity.js.map