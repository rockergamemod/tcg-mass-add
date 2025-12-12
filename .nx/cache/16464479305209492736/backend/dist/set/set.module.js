"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetModule = void 0;
const common_1 = require("@nestjs/common");
const set_service_1 = require("./set.service");
const set_controller_1 = require("./set.controller");
const nestjs_1 = require("@mikro-orm/nestjs");
const database_1 = require("../infra/database");
let SetModule = class SetModule {
};
exports.SetModule = SetModule;
exports.SetModule = SetModule = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_1.MikroOrmModule.forFeature([database_1.TcgSet])],
        controllers: [set_controller_1.SetController],
        providers: [set_service_1.SetService],
    })
], SetModule);
//# sourceMappingURL=set.module.js.map