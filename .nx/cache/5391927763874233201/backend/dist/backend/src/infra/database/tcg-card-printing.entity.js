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
exports.TcgCardPrinting = void 0;
const core_1 = require("@mikro-orm/core");
const tcg_card_entity_1 = require("./tcg-card.entity");
const types_1 = require("./types");
const tcg_card_source_entity_1 = require("./tcg-card-source.entity");
let TcgCardPrinting = class TcgCardPrinting {
    id;
    card;
    finishType;
    artVariant;
    isDefault;
    source;
};
exports.TcgCardPrinting = TcgCardPrinting;
__decorate([
    (0, core_1.PrimaryKey)({ type: 'number', autoincrement: true }),
    __metadata("design:type", Number)
], TcgCardPrinting.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => tcg_card_entity_1.TcgCard),
    __metadata("design:type", tcg_card_entity_1.TcgCard)
], TcgCardPrinting.prototype, "card", void 0);
__decorate([
    (0, core_1.Enum)(() => types_1.CardFinishType),
    __metadata("design:type", String)
], TcgCardPrinting.prototype, "finishType", void 0);
__decorate([
    (0, core_1.Enum)({ items: () => types_1.CardArtVariant, nullable: true }),
    __metadata("design:type", String)
], TcgCardPrinting.prototype, "artVariant", void 0);
__decorate([
    (0, core_1.Property)({ default: true, type: 'bool' }),
    __metadata("design:type", Boolean)
], TcgCardPrinting.prototype, "isDefault", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => tcg_card_source_entity_1.TcgCardSource, { nullable: true }),
    __metadata("design:type", tcg_card_source_entity_1.TcgCardSource)
], TcgCardPrinting.prototype, "source", void 0);
exports.TcgCardPrinting = TcgCardPrinting = __decorate([
    (0, core_1.Entity)({ tableName: 'tcg_card_printings' })
], TcgCardPrinting);
//# sourceMappingURL=tcg-card-printing.entity.js.map