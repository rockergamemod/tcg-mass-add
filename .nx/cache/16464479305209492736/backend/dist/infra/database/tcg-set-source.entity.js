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
exports.TcgSetSource = void 0;
const core_1 = require("@mikro-orm/core");
const tcg_set_entity_1 = require("./tcg-set.entity");
const types_1 = require("./types");
let TcgSetSource = class TcgSetSource {
    id;
    set;
    source;
    sourceSetId;
    sourceSetCode;
    sourceSetName;
    rawExtra;
    isPrimary;
};
exports.TcgSetSource = TcgSetSource;
__decorate([
    (0, core_1.PrimaryKey)({ type: 'serial', autoincrement: true }),
    __metadata("design:type", Number)
], TcgSetSource.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => tcg_set_entity_1.TcgSet),
    __metadata("design:type", tcg_set_entity_1.TcgSet)
], TcgSetSource.prototype, "set", void 0);
__decorate([
    (0, core_1.Enum)(() => types_1.CardSourceType),
    __metadata("design:type", String)
], TcgSetSource.prototype, "source", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string' }),
    __metadata("design:type", String)
], TcgSetSource.prototype, "sourceSetId", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string', nullable: true }),
    __metadata("design:type", String)
], TcgSetSource.prototype, "sourceSetCode", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string', nullable: true }),
    __metadata("design:type", String)
], TcgSetSource.prototype, "sourceSetName", void 0);
__decorate([
    (0, core_1.Property)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], TcgSetSource.prototype, "rawExtra", void 0);
__decorate([
    (0, core_1.Property)({ type: 'bool', default: true }),
    __metadata("design:type", Boolean)
], TcgSetSource.prototype, "isPrimary", void 0);
exports.TcgSetSource = TcgSetSource = __decorate([
    (0, core_1.Entity)({ tableName: 'tcg_set_sources' }),
    (0, core_1.Unique)({ properties: ['source', 'sourceSetId'] })
], TcgSetSource);
//# sourceMappingURL=tcg-set-source.entity.js.map