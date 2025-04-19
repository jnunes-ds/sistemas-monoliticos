const pluginJs = require("@eslint/js");

module.exports = [
    pluginJs.configs.recommended,

    {
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "warn"
        }
    }
];