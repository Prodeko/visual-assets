#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import SVGSpriter from 'svg-sprite';

async function build(srcDir, outDir, spriteName) {
    // Configure to emit a symbol-mode sprite
    const spriter = new SVGSpriter({
        dest: outDir,
        mode: {
            symbol: {
                dest: '.',
                sprite: spriteName
            }
        },
        shape: {
            id: {
                // id each <symbol> after its filename (no extension)
                generator: filePath => path.basename(filePath, '.svg')
            },
            transform: [
                {
                    svgo: {
                        plugins: [
                            // remove any <style> blocks
                            { name: 'removeStyleElement', active: true },
                            // strip out class attributes too
                            { name: 'removeAttrs', params: { attrs: 'class' } },
                            // add fill="currentColor" on the <symbol> root
                            {
                                name: 'addAttributesToSVGElement',
                                params: { attributes: [{ fill: 'currentColor' }] }
                            }
                        ]
                    }
                }
            ]
        }
    });

    // Register every SVG in srcDir
    const files = await fs.promises.readdir(srcDir);
    for (const file of files.filter(f => f.endsWith('.svg'))) {
        const full = path.join(srcDir, file);
        spriter.add(full, null, fs.readFileSync(full, 'utf-8'));
    }

    // Compile—and write out sprite
    const { result } = await spriter.compileAsync();
    for (const mode in result) {
        for (const resource in result[mode]) {
            const { path: outPath, contents } = result[mode][resource];
            await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
            await fs.promises.writeFile(outPath, contents);
        }
    }
}

(async () => {
    await build(path.resolve('assets/logos'), path.resolve('dist'), 'logos.svg');
    await build(path.resolve('assets/icons'), path.resolve('dist'), 'icons.svg');
})();