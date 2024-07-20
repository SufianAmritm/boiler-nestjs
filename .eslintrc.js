module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: [  'airbnb-base',
'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'import/prefer-default-export':"off",
    '@typescript-eslint/no-shadow': "off",
    "no-plusplus": "off",
    "no-param-reassign": [2, { "props": false }],
    "@typescript-eslint/no-redeclare":"warn",
    "class-methods-use-this": "off",
    "import/no-cycle":"off",
    "max-classes-per-file":"off",
    "@typescript-eslint/no-explicit-any":"warn",
    "no-restricted-syntax":"warn",
    'no-console': [
      'error',
      {
        allow: ['error', 'info']
      }
    ],
     'import/no-absolute-path': 'error'
  },
   "overrides": [
      {
        "files": ["src/**/*service.ts"],
        "rules": {
          "@typescript-eslint/return-await": "off"
        }
      },
      {
       "files": ["src/common/constants/enums/index.ts"],
        "rules": {
          "@typescript-eslint/naming-convention": "off"
        }
      },
       {
       "files": ["src/**/*interface.ts"],
        "rules": {
          "@typescript-eslint/no-redeclare": "off"
        }
      },
       {
       "files": ["src/common/**",'src/modules/ocr/**'],
        "rules": {
          "@typescript-eslint/no-explicit-any": "off"
        }
      },
       {
       "files": ["src/crons/**"],
        "rules": {
          "no-console": "off"
        }
      }
    ]
};
