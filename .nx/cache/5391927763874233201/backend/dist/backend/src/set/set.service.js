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
exports.SetService = void 0;
const nestjs_1 = require("@mikro-orm/nestjs");
const postgresql_1 = require("@mikro-orm/postgresql");
const common_1 = require("@nestjs/common");
const database_1 = require("../infra/database");
let SetService = class SetService {
    tcgSetRepo;
    constructor(tcgSetRepo) {
        this.tcgSetRepo = tcgSetRepo;
    }
    findAll(gameKey, seriesId) {
        return this.tcgSetRepo.find({ game: { key: gameKey }, series: { id: seriesId } }, { orderBy: { releaseDate: 'DESC' }, populate: ['game', 'series'] });
    }
    findOne(gameKey, seriesId, setId) {
        return this.tcgSetRepo.findOne({
            game: { key: gameKey },
            series: { id: seriesId },
            id: setId,
        }, {
            populate: ['cards', 'series'],
        });
    }
};
exports.SetService = SetService;
exports.SetService = SetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectRepository)(database_1.TcgSet)),
    __metadata("design:paramtypes", [postgresql_1.EntityRepository])
], SetService);
//# sourceMappingURL=set.service.js.map