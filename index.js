import { existsSync } from "fs";
import { join } from "path";
const pagesDir = "src/pages";
const layoutDir = "src/layouts";
const defaultLayout = "MainLayout";
const pascalCache = {};
function toPascalCase(str) {
    pascalCache[str] =
        pascalCache[str] ||
            (/^[\p{L}\d]+$/iu.test(str) &&
                str.charAt(0).toUpperCase() + str.slice(1)) ||
            str.replace(/([\p{L}\d])([\p{L}\d]*)/giu, (_g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase()).replace(/[^\p{L}\d]/giu, "");
    return pascalCache[str];
}
const layouts = new Set;
const notLayouts = new Set;
export function defaultLayoutPlugin() {
    return function (_tree, file) {
        const filePath = file.history[0].replace(/\/[^\/]+$/, "");
        const currentDir = join(file.cwd, pagesDir);
        const relativePath = filePath.slice(currentDir.length + 1);
        const directories = relativePath ? relativePath.split("/").reverse() : [];
        let layout = defaultLayout;
        for (const directory in directories) {
            const directoryLayout = toPascalCase(directory);
            if (layouts.has(directoryLayout) ||
                (!notLayouts.has(directoryLayout) &&
                    existsSync(join(layoutDir, directoryLayout + ".astro")))) {
                layouts.add(directoryLayout);
                layout = directoryLayout;
                continue;
            }
            else {
                notLayouts.add(directoryLayout);
            }
        }
        let ascend = "";
        for (let i = 0; i < directories.length; i++) {
            ascend += "../";
        }
        file.data.astro.frontmatter.layout = `${ascend}layouts/${layout}.astro`;
    };
}
