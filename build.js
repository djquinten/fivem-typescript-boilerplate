const esbuild = require('esbuild');
const fs = require('fs');
const production = process.argv.findIndex(argItem => argItem === '--mode=production') >= 0;

const onRebuild = (context) => {
    return async (err, res) => {
        if (err) return console.error(`[${context}]: Rebuild failed`, err);
        console.log(`[${context}]: Rebuild succeeded, warnings:`, res.warnings);
    }
}

const server = {
    platform: 'node',
    target: ['node16'],
    format: 'cjs',
};

const client = {
    platform: 'browser',
    target: ['chrome93'],
    format: 'iife',
};

function collectFiles(directory) {
    const files = fs.readdirSync(directory);
    const result = [];

    for (const file of files) {
        let filePath = `${directory}/${file}`;
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            const subFiles = collectFiles(filePath);
            result.push(...subFiles);
        } else if (stat.isFile() && filePath.endsWith('.ts')) {
            result.push(filePath);
        }
    }
    return result;
}

for (const context of ['client', 'server']) {
    const entryPoints = collectFiles(context);

    const entryFileContent = entryPoints.map((entryPoint) => {
        return `import '../${entryPoint}';`;
    }).join('\n');

    if (!fs.existsSync('./cache')) fs.mkdirSync('./cache');
    fs.writeFileSync(`./cache/${context}.ts`, entryFileContent);

    esbuild.build({
        bundle: true,
        entryPoints: [`cache/${context}.ts`],
        outfile: `dist/${context}.js`,
        watch: production ? false : {
            onRebuild: onRebuild(context),
        },
        ...(context === 'client' ? client : server),
    }).then(() => {
        if (production) {
            fs.unlinkSync(`./cache/${context}.ts`);
            const files = fs.readdirSync('./cache');
            if (files.length === 0) fs.rmdirSync('./cache');
        }
    }).catch((e) => {
        console.error(e);
        process.exit(1);
    });
}