import { existsSync } from "fs";
import { join } from "path";
import type { VFile } from "vfile";

export type Frontmatter = {
    layout: string;
}

export type MarkdownAstroData = {
    frontmatter: Frontmatter
}

const pascalCache: Record<string, string> = {};
function toPascalCase(str: string) {
    pascalCache[str] =
        pascalCache[str] ||
        (
            /^[\p{L}\d]+$/iu.test(str) &&
            str.charAt(0).toUpperCase() + str.slice(1)
        ) ||
        str.replace(
            /([\p{L}\d])([\p{L}\d]*)/giu,
            (_g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase()
        ).replace(/[^\p{L}\d]/giu, "");

    return pascalCache[str];
}

const layouts = new Set;
const notLayouts = new Set;
export function defaultLayout() {
    return function (_tree: any, file: any) {
        const vfile = file as VFile;
        const filePath = vfile.history[0].replace(/\/[^\/]+$/, "");
        const currentDir = join(vfile.cwd, "src/pages");
        const relativePath = filePath.slice(currentDir.length + 1);
        const directories = relativePath ? relativePath.split("/").reverse() : [];

        let layout = "MainLayout";
        for (const directory in directories) {
            const directoryLayout = toPascalCase(directory);
            if (
                layouts.has(directoryLayout) ||
                (
                    !notLayouts.has(directoryLayout) &&
                    existsSync(join("src/layouts", directoryLayout + ".astro"))
                )
            ) {
                layouts.add(directoryLayout);
                layout = directoryLayout;
                continue;
            } else {
                notLayouts.add(directoryLayout);
            }
        }

        const layoutPath = join(vfile.cwd, "src/layouts", layout + ".astro");

        (vfile.data.astro as MarkdownAstroData).frontmatter.layout = layoutPath;
    }
}