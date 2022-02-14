"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@lvksh/logger");
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
const cheerio_1 = require("cheerio");
const node_path_1 = require("node:path");
const logger = (0, logger_1.createLogger)({
    info: chalk_1.default.blueBright ` → `,
    error: chalk_1.default.redBright ` ! `,
    result: chalk_1.default.greenBright ` = `
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const name = process.argv[2];
    if (!name)
        return logger.error("Invalid usage", `${chalk_1.default.gray((_a = (0, node_path_1.parse)(process.argv[1]).name) !== null && _a !== void 0 ? _a : "is-typed")} <package-name>`);
    logger.info("Gathering data...");
    const src = yield axios_1.default.get(`https://www.npmjs.com/package/${name}`).then(it => it.data).catch(() => false);
    if (!src)
        return logger.error("Package not found");
    const $ = (0, cheerio_1.load)(src);
    const alt = $("main div img[alt]");
    logger.result(alt);
}))();
