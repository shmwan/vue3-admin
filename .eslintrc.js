module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    // 0 不提示 1 警告 2 错误
    "rules": {
        "quotes": 0,                        // 非双引号报错
        "semi": 0,                          // 无分号就警告
        "no-console": 1,                    // 有console.log就警告
        "space-before-function-paren": 0,   // 函数前空格忽略
        "@typescript-eslint/no-this-alias": [       //_this = this,报错屏蔽
            "off",
            // {
            //     "allowDestructuring": false,
            //     "allowedNames": ["_this", "self", "that"]
            // }
        ],

    }
};
