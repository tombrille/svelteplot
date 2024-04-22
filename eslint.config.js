import js from '@eslint/js';
import svelteConfig from '@sveltejs/eslint-config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    ...svelteConfig,
    eslintConfigPrettier,
    {
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint'],
        parserOptions: {
            sourceType: 'module',
            ecmaVersion: 2020,
            extraFileExtensions: ['.svelte']
        },
        ignore: [
            '.DS_Store',
            'node_modules',
            '/build',
            '/.svelte-kit',
            '/package',
            '.env',
            '.env.*',
            '!.env.example',
            'pnpm-lock.yaml',
            'package-lock.json',
            'yarn.lock'
        ],
        env: {
            browser: true,
            es2017: true,
            node: true
        },
       
        overrides: [
            {
                files: ['*.svelte'],
                parser: 'svelte-eslint-parser',
                parserOptions: {
                    parser: '@typescript-eslint/parser'
                }
            }
        ]
    }
];
