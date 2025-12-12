"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const globalPrefix = process.env['GLOBAL_PREFIX'];
    if (globalPrefix && globalPrefix.startsWith('/')) {
        app.setGlobalPrefix(globalPrefix);
    }
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map