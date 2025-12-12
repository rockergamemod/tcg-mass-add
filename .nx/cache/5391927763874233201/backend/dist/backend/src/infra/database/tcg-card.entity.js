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
exports.TcgCard = void 0;
const core_1 = require("@mikro-orm/core");
const tcg_card_printing_entity_1 = require("./tcg-card-printing.entity");
const tcg_card_source_entity_1 = require("./tcg-card-source.entity");
const tcg_set_entity_1 = require("./tcg-set.entity");
let TcgCard = class TcgCard {
    id;
    set;
    collectorNumber;
    canonicalName;
    rarity;
    supertype;
    subtype;
    image;
    imageHigh;
    printings = new core_1.Collection(this);
    sources = new core_1.Collection(this);
};
exports.TcgCard = TcgCard;
__decorate([
    (0, core_1.PrimaryKey)({ type: 'serial', autoincrement: true }),
    __metadata("design:type", Number)
], TcgCard.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => tcg_set_entity_1.TcgSet),
    __metadata("design:type", tcg_set_entity_1.TcgSet)
], TcgCard.prototype, "set", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string' }),
    __metadata("design:type", String)
], TcgCard.prototype, "collectorNumber", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string' }),
    __metadata("design:type", String)
], TcgCard.prototype, "canonicalName", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string', nullable: true }),
    __metadata("design:type", String)
], TcgCard.prototype, "rarity", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string', nullable: true }),
    __metadata("design:type", String)
], TcgCard.prototype, "supertype", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string', nullable: true }),
    __metadata("design:type", String)
], TcgCard.prototype, "subtype", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string', nullable: true }),
    __metadata("design:type", String)
], TcgCard.prototype, "image", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string', nullable: true }),
    __metadata("design:type", String)
], TcgCard.prototype, "imageHigh", void 0);
__decorate([
    (0, core_1.OneToMany)(() => tcg_card_printing_entity_1.TcgCardPrinting, (printing) => printing.card),
    __metadata("design:type", Object)
], TcgCard.prototype, "printings", void 0);
__decorate([
    (0, core_1.OneToMany)(() => tcg_card_source_entity_1.TcgCardSource, (source) => source.card),
    __metadata("design:type", Object)
], TcgCard.prototype, "sources", void 0);
exports.TcgCard = TcgCard = __decorate([
    (0, core_1.Entity)({ tableName: 'tcg_cards' }),
    (0, core_1.Unique)({ properties: ['set', 'collectorNumber'] })
], TcgCard);
//# sourceMappingURL=tcg-card.entity.js.map