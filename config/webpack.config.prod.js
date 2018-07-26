'use strict';

const path = require('path');
const webpack = require('webpack');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === './';
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1);
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

const expressPath = path.resolve(__dirname, "..", "node_modules", "express");
const concatStreamPath = path.resolve(__dirname, "..", "node_modules", "concat-stream");

// Assert this just to be safe.
// Development builds of React are slow and not intended for production.

const isProduction = env.stringified['process.env'].NODE_ENV === '"production"'

if (!isProduction) {
    throw new Error('Production builds must have NODE_ENV=production.');
}

const include = [paths.appSrc];

const plugins = [];

if (shouldUseSourceMap) {
    var StatsPlugin = require('stats-webpack-plugin');
    // https://webpack.github.io/analyse/#modules
    plugins.push(new StatsPlugin('compilation-stats.json', {
        chunkModules: true,
        // exclude: [/node_modules[\\\/]react/]
    }));
}

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = {
    mode: isProduction ? "production" : "development",
    target: 'node',
    // Don't attempt to continue if there are any errors.
    bail: true,
    // We generate sourcemaps in production. This is slow but gives good results.
    // You can exclude the *.map files from the build during deployment.
    devtool: shouldUseSourceMap ? 'source-map' : false,
    // In production, we only want to load the polyfills and the app code.
    entry: [paths.appIndexJs],
    output: {
        // The build folder.
        path: paths.appBuild,
        // Generated JS file names (with nested folders).
        // There will be one main bundle, and one file per asynchronous chunk.
        // We don't currently advertise code splitting but Webpack supports it.
        filename: 'server.js',
        chunkFilename: '[name].[chunkhash:8].chunk.js',
        // We inferred the "public path" (such as / or /my-project) from homepage.
        publicPath: publicPath,
        // Point sourcemap entries to original disk location (format as URL on Windows)
        devtoolModuleFilenameTemplate: (info) =>
            path
                .relative(paths.appSrc, info.absoluteResourcePath)
                .replace(/\\/g, '/'),
    },
    resolve: {
        // This allows you to set a fallback for where Webpack should look for modules.
        // We placed these paths second because we want `node_modules` to "win"
        // if there are any conflicts. This matches Node resolution mechanism.
        // https://github.com/facebookincubator/create-react-app/issues/253
        modules: ['node_modules', paths.appNodeModules].concat(
            // It is guaranteed to exist because we tweak it in `env.js`
            process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
        ),
        // These are the reasonable defaults supported by the Node ecosystem.
        // We also include JSX as a common component filename extension to support
        // some tools, although we do not recommend using it, see:
        // https://github.com/facebookincubator/create-react-app/issues/290
        // `web` extension prefixes have been added for better support
        // for React Native Web.
        extensions: [
            '.mjs',
            '.web.ts',
            '.ts',
            '.web.tsx',
            '.tsx',
            '.web.js',
            '.js',
            '.json',
            '.web.jsx',
            '.jsx',
        ],
        alias: {
            "depd": path.resolve(__dirname, "..", "node_modules", "depd"),
            "object-assign": path.resolve(__dirname, "..", "node_modules", "object-assign"),
            "express": expressPath,
            "bytes": path.resolve(expressPath, "node_modules", "bytes"),
            "body-parser": path.resolve(expressPath, "node_modules", "body-parser"),
            "iconv-lite": path.resolve(expressPath, "node_modules", "iconv-lite"),
            "qs": path.resolve(expressPath, "node_modules", "qs"),
            "setprototypeof": path.resolve(expressPath, "node_modules", "setprototypeof"),
            "raw-body": path.resolve(expressPath, "node_modules", "raw-body"),

            "readable-stream": path.resolve(concatStreamPath, "node_modules", "readable-stream"),
            "isarray": path.resolve(concatStreamPath, "node_modules", "isarray"),
            "axios": path.resolve(__dirname, "..", "node_modules", "axios"),
            "debug": path.resolve(__dirname, "..", "node_modules", "debug")

            // "mime": path.resolve("..", "node_modules", "gtoken", "node_modules", "mime"),
            // "ms": path.resolve("..", "node_modules", "jsonwebtoken", "node_modules", "ms"),
        },
        plugins: [
            // Prevents users from importing files from outside of src/ (or node_modules/).
            // This often causes confusion because we only process files within src/ with babel.
            // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
            // please link the files into your node_modules/ and let module-resolution kick in.
            // Make sure your source files are compiled, as they will not be processed in any way.
            new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
            new TsconfigPathsPlugin({ configFile: paths.appTsConfig }),
        ],
    },
    module: {
        strictExportPresence: true,
        rules: [
            // TODO: Disable require.ensure as it's not a standard language feature.
            // We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
            // { parser: { requireEnsure: false } },

            // First, run the linter.
            // It's important to do this before Typescript runs.
            {
                test: /\.(ts|tsx)$/,
                loader: require.resolve('tslint-loader'),
                enforce: 'pre',
                include: include,
                exclude: [/node_modules/],
            },
            {
                test: /\.(js|jsx|mjs)$/,
                loader: require.resolve('source-map-loader'),
                enforce: 'pre',
                include: include,
                exclude: [/node_modules/],
            },
            {
                // "oneOf" will traverse all following loaders until one will
                // match the requirements. When no loader matches it will fall
                // back to the "file" loader at the end of the loader list.
                oneOf: [
                    {
                        test: /\.(js|jsx|mjs)$/,
                        include: paths.appSrc,
                        loader: require.resolve('babel-loader'),
                        options: {

                            compact: true,
                        },
                    },
                    // Compile .tsx?
                    {
                        test: /\.(ts|tsx)$/,
                        include: paths.appSrc,
                        exclude: [/node_modules/],
                        use: [
                            {
                                loader: require.resolve('ts-loader'),
                                options: {
                                    // disable type checker - we will use it in fork plugin
                                    transpileOnly: true,
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
    plugins: [
        ...plugins,
        new DuplicatePackageCheckerPlugin({
            // Also show module that is requiring each duplicate package (default: false)
            verbose: true,
            // Emit errors instead of warnings (default: false)
            emitError: false,
            // Show help message if duplicate packages are found (default: true)
            showHelp: false,
            // Warn also if major versions differ (default: true)
            strict: true,
            /**
             * Exclude instances of packages from the results.
             * If all instances of a package are excluded, or all instances except one,
             * then the package is no longer considered duplicated and won't be emitted as a warning/error.
             * @param {Object} instance
             * @param {string} instance.name The name of the package
             * @param {string} instance.version The version of the package
             * @param {string} instance.path Absolute path to the package
             * @param {?string} instance.issuer Absolute path to the module that requested the package
             * @returns {boolean} true to exclude the instance, false otherwise
             */
            exclude(instance) {
                return instance.name === "fbjs";
            }
        }),
        // Minify the code.
        new UglifyJsPlugin({
            parallel: true,
            cache: true,
            uglifyOptions: {
                ecma: 8,
                compress: {
                    warnings: false,
                    // Disabled because of an issue with Uglify breaking seemingly valid code:
                    // https://github.com/facebookincubator/create-react-app/issues/2376
                    // Pending further investigation:
                    // https://github.com/mishoo/UglifyJS2/issues/2011
                    comparisons: false,
                    // Fix es6 TypeError: Assignment to constant variable
                    inline: false,
                },
                mangle: {
                    safari10: true,
                },
                output: {
                    comments: false,
                    // Turned on because emoji and regex is not minified properly using default
                    // https://github.com/facebookincubator/create-react-app/issues/2488
                    ascii_only: true,
                },
            },
            sourceMap: shouldUseSourceMap,
        }),
        // Perform type checking and linting in a separate process to speed up compilation
        new ForkTsCheckerWebpackPlugin({
            async: false,
            tsconfig: paths.appTsConfig,
            tslint: paths.appTsLint,
        })
    ]
};
