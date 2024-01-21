import { sveltepress } from '@sveltepress/vite';
import { defaultTheme } from '@sveltepress/theme-default';
import { defineConfig } from 'vitest/config';
import sidebar from './config/sidebar.js';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            svelteplot: path.resolve(__dirname, './src/lib/index.js')
        }
    },
    plugins: [
        sveltepress({
            theme: defaultTheme({
                logo: '/favicon.png',
                github: 'https://github.com/svelteplot/svelteplot',
                themeColor: {
                    light: '#ffffff',
                    dark: '#18181b'
                },
                highlighter: {
                    themeLight: 'github-light',
                    themeDark: 'github-dark'
                },
                navbar: [
                    {
                        title: 'Home',
                        to: '/'
                    },
                    {
                        title: 'Guide',
                        to: '/guide/introduction'
                    },
                    {
                        title: 'Blog post',
                        to: 'https://vis4.net/blog'
                    }
                ],
                sidebar
            }),

            siteConfig: {
                title: 'SveltePlot',
                description: 'Demo of an imaginary new visualization toolkit'
            }
        })
    ],

    test: {
        include: ['src/**/*.{test,spec}.{js,ts}'],
        environment: 'jsdom'
    },

    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@use "src/variables.scss" as *;'
            }
        }
    }
});
