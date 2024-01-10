import { sveltepress } from '@sveltepress/vite';
import { defaultTheme } from '@sveltepress/theme-default';
import { defineConfig } from 'vitest/config';
import sidebar from './config/sidebar.js';

export default defineConfig({
    plugins: [sveltepress({
        theme: defaultTheme({
            logo: '/favicon.png',
            github: 'https://github.com/svelteplot/svelteplot',
            navbar: [{
                title: 'Guide',
                to: '/guide/introduction'
            }],
            sidebar
        }),
        
        siteConfig: {
            title: 'SveltePlot',
            description: 'Demo of an imaginary new visualization toolkit'
        }
    })],

    test: {
        include: ['src/**/*.{test,spec}.{js,ts}']
    },

    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@use "src/variables.scss" as *;'
            }
        }
    }
});
