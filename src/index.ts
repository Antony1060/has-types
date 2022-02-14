import { createLogger } from "@lvksh/logger";
import axios from "axios"
import chalk from "chalk";
import { load } from "cheerio";
import { parse } from "node:path";

const logger = createLogger({
    info: chalk.blueBright` → `,
    error: chalk.redBright` ! `,
    result: chalk.greenBright` = `
});

const DT_REGEX = /^DefinitelyTyped icon/g;
const BUILT_IN_REGEX = /^TypeScript icon/g;

(async () => {
    const name = process.argv[2];
    if(!name)
        return logger.error("Invalid usage", `${chalk.gray(parse(process.argv[1]).name ?? "is-typed")} <package-name>`);

    logger.info("Gathering data...");
    const src: string | false = await axios.get(`https://www.npmjs.com/package/${name}`).then(it => it.data).catch(() => false);
    if(!src)
        return logger.error("Package not found");

    const $ = load(src);
    const alt = $("main div h2 img").attr("alt");

    if(BUILT_IN_REGEX.test(alt))
        logger.result("built-in")
    else if (DT_REGEX.test(alt))
        logger.result("definitely typed")
    else
        logger.result("no types :(")
})();