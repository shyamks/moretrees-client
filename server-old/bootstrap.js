require('ignore-styles');

// process.env.BABEL_ENV = 'development'
// process.env.NODE_ENV = 'development'
require('@babel/register')({
    // ignore: [ /(node_modules)/ ],
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
        'syntax-dynamic-import',
        'dynamic-import-node',
        '@babel/plugin-proposal-class-properties',
        'react-loadable/babel'
    ]
});

require('./index');