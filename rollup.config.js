import path from 'path';
import ts from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const pkg = require('./package.json');

const banner = `/*!
  * ${pkg.name} v${pkg.version}
  * (c) ${new Date().getFullYear()} SuYan
  * @license MIT
  * @more https://lefex.gitee.io
  */`;

// all the module for build
const modules = {
    // each file name has the format: `dist/${name}.${format}.js`
    // format being a key of this object
    'esm-bundler': {
        file: pkg.module,
        format: 'es'
    },
    cjs: {
        file: pkg.main,
        format: 'cjs'
    },
    global: {
        file: pkg.unpkg,
        format: 'iife'
    },
    esm: {
        file: pkg.browser || pkg.module.replace('bundler', 'browser'),
        format: 'es'
    }
};

let hasTSChecked = false;

const allFormats = Object.keys(modules);
const packageFormats = allFormats;
const packageConfigs = packageFormats.map(format =>
    createConfig(format, modules[format])
);
// only add the production ready if we are bundling the options
packageFormats.forEach(format => {
    if (format === 'cjs') {
        packageConfigs.push(createProductionConfig(format));
    }
    else if (format === 'global') {
        packageConfigs.push(createMinifiedConfig(format));
    }
});

function createConfig(format, output, plugins = []) {
    output.sourcemap = !!process.env.SOURCE_MAP;
    output.banner = banner;
    output.externalLiveBindings = false;
    output.globals = {
        sytask: 'SyTask'
    };

    const isGlobalBuild = format === 'global';

    if (isGlobalBuild) {
        output.name = 'SYTask';
    };

    const shouldEmitDeclarations = !hasTSChecked;

    const tsPlugin = ts({
        check: !hasTSChecked,
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
        tsconfigOverride: {
            compilerOptions: {
                sourceMap: output.sourcemap,
                declaration: shouldEmitDeclarations,
                declarationMap: shouldEmitDeclarations
            },
            exclude: ['__tests__']
        }
    });
    // we only need to check TS and generate declarations once for each build.
    // it also seems to run into weird issues when checking multiple times
    // during a single build.
    hasTSChecked = true;

    const nodePlugins = [resolve(), commonjs()];

    return {
        input: 'src/index.ts',
        plugins: [
            tsPlugin,
            ...nodePlugins,
            ...plugins
        ],
        output
    };
}

function createProductionConfig(format) {
    return createConfig(format, {
        file: `dist/${pkg.name}.${format}.prod.js`,
        format: modules[format].format
    });
}

function createMinifiedConfig(format) {
    // mini
    const {terser} = require('rollup-plugin-terser');
    return createConfig(
        format,
        {
            file: `dist/${pkg.name}.${format}.prod.js`,
            format: modules[format].format
        },
        [
            terser({
                module: /^esm/.test(format),
                compress: {
                    ecma: 2015,
                    pure_getters: true
                }
            })
        ]
    );
}


export default packageConfigs;