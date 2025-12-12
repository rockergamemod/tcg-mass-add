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
exports.TcgSeries = void 0;
const core_1 = require("@mikro-orm/core");
const tcg_game_entity_1 = require("./tcg-game.entity");
const tcg_set_entity_1 = require("./tcg-set.entity");
let TcgSeries = class TcgSeries {
    id;
    game;
    code;
    name;
    logo;
    displayOrder;
    isHidden;
    releaseDate;
    sets = new core_1.Collection(this);
};
exports.TcgSeries = TcgSeries;
__decorate([
    (0, core_1.PrimaryKey)({ type: 'serial', autoincrement: true }),
    __metadata("design:type", Number)
], TcgSeries.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => tcg_game_entity_1.TcgGame),
    __metadata("design:type", tcg_game_entity_1.TcgGame)
], TcgSeries.prototype, "game", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string' }),
    __metadata("design:type", String)
], TcgSeries.prototype, "code", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string' }),
    __metadata("design:type", String)
], TcgSeries.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string', nullable: true }),
    __metadata("design:type", Object)
], TcgSeries.prototype, "logo", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string', nullable: true }),
    __metadata("design:type", Number)
], TcgSeries.prototype, "displayOrder", void 0);
__decorate([
    (0, core_1.Property)({ type: 'bool', default: false }),
    __metadata("design:type", Boolean)
], TcgSeries.prototype, "isHidden", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string', nullable: true }),
    __metadata("design:type", String)
], TcgSeries.prototype, "releaseDate", void 0);
__decorate([
    (0, core_1.OneToMany)(() => tcg_set_entity_1.TcgSet, (set) => set.series),
    __metadata("design:type", Object)
], TcgSeries.prototype, "sets", void 0);
exports.TcgSeries = TcgSeries = __decorate([
    (0, core_1.Entity)({ tableName: 'tcg_series' }),
    (0, core_1.Unique)({ properties: ['game', 'code'] })
], TcgSeries);
//# sourceMappingURL=tcg-series.entity.js.map