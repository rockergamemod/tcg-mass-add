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
exports.TcgCardSource = void 0;
const core_1 = require("@mikro-orm/core");
const tcg_card_entity_1 = require("./tcg-card.entity");
const types_1 = require("./types");
let TcgCardSource = class TcgCardSource {
    id;
    card;
    source;
    sourceCardId;
    sourceSetCode;
    sourceSetName;
    sourceName;
    rawExtra;
    isPrimary;
};
exports.TcgCardSource = TcgCardSource;
__decorate([
    (0, core_1.PrimaryKey)({ type: 'serial', autoincrement: true }),
    __metadata("design:type", Number)
], TcgCardSource.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => tcg_card_entity_1.TcgCard),
    __metadata("design:type", tcg_card_entity_1.TcgCard)
], TcgCardSource.prototype, "card", void 0);
__decorate([
    (0, core_1.Enum)(() => types_1.CardSourceType),
    __metadata("design:type", String)
], TcgCardSource.prototype, "source", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string' }),
    __metadata("design:type", String)
], TcgCardSource.prototype, "sourceCardId", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string', nullable: true }),
    __metadata("design:type", String)
], TcgCardSource.prototype, "sourceSetCode", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string', nullable: true }),
    __metadata("design:type", String)
], TcgCardSource.prototype, "sourceSetName", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string', nullable: true }),
    __metadata("design:type", String)
], TcgCardSource.prototype, "sourceName", void 0);
__decorate([
    (0, core_1.Property)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], TcgCardSource.prototype, "rawExtra", void 0);
__decorate([
    (0, core_1.Property)({ type: 'bool', default: false }),
    __metadata("design:type", Boolean)
], TcgCardSource.prototype, "isPrimary", void 0);
exports.TcgCardSource = TcgCardSource = __decorate([
    (0, core_1.Entity)({ tableName: 'tcg_card_sources' }),
    (0, core_1.Unique)({ properties: ['source', 'sourceCardId'] })
], TcgCardSource);
//# sourceMappingURL=tcg-card-source.entity.js.map