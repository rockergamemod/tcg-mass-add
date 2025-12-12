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
exports.SetController = void 0;
const common_1 = require("@nestjs/common");
const set_service_1 = require("./set.service");
const types_1 = require("../infra/database/types");
let SetController = class SetController {
    pokemonSetService;
    constructor(pokemonSetService) {
        this.pokemonSetService = pokemonSetService;
    }
    findAll(gameKey, seriesId) {
        return this.pokemonSetService.findAll(gameKey, seriesId);
    }
    findOne(gameKey, seriesId, setId) {
        return this.pokemonSetService.findOne(gameKey, seriesId, setId);
    }
};
exports.SetController = SetController;
__decorate([
    (0, common_1.Get)('/games/:gameKey/series/:seriesId/sets'),
    __param(0, (0, common_1.Param)('gameKey')),
    __param(1, (0, common_1.Param)('seriesId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], SetController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/games/:gameKey/series/:seriesId/sets/:setId'),
    __param(0, (0, common_1.Param)('gameKey')),
    __param(1, (0, common_1.Param)('seriesId')),
    __param(2, (0, common_1.Param)('setId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], SetController.prototype, "findOne", null);
exports.SetController = SetController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [set_service_1.SetService])
], SetController);
//# sourceMappingURL=set.controller.js.map