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

type TypeResult = "definitely" | "built-in" | "no";

const checkTypes = async (name: string): Promise<TypeResult | null> => {
    const src: string | false = await axios.get(`https://www.npmjs.com/package/${name}`).then(it => it.data).catch(() => false);
    if(!src)
        return null;

    const $ = load(src);
    const alt = $("main div h2 img").attr("alt")?.trim();

    if(!alt)
        return "no";

    if (alt.match(BUILT_IN_REGEX))
        return "built-in"
    else if (alt.match(DT_REGEX))
        return "definitely"
    else
        return "no"
}

(async () => {
    const names = process.argv.slice(2);
    if(!names.length)
        return logger.error("Invalid usage", `${chalk.gray(parse(process.argv[1]).name ?? "is-typed")} ...package-names`);

    logger.info("Gathering data...");
    const all = await Promise.all(names.map(async name => ({ name, result: await checkTypes(name) })));

    for (const res of all) {
        if (!res.result)
            logger.error(chalk.gray(res.name) + " Package not found");
        else if (res.result === "built-in")
            logger.result(chalk.gray(res.name) + " built-in")
        else if (res.result === "definitely")
            logger.result(chalk.gray(res.name) + " definitely typed")
        else
            logger.result(chalk.gray(res.name) + " no types :(")
    }
})();