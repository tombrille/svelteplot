export default {
    '/': [
        {
            title: 'Guide',
            collapsible: false,
            items: [
                {
                    title: 'Getting started',
                    to: '/getting-started/'
                },
                {
                    title: 'Why SveltePlot?',
                    to: '/why-svelteplot/'
                },
                {
                    title: 'Introduction',
                    to: '/introduction/'
                }
            ]
        },
        {
            title: 'Features',
            collapsible: true,
            items: [
                {
                    title: 'Plot',
                    to: '/features/plot/'
                },
                {
                    title: 'Scales',
                    to: '/features/scales/'
                },
                {
                    title: 'Facets',
                    to: '/features/facets/'
                },
                {
                    title: 'Markers',
                    to: '/features/markers/'
                },
                {
                    title: 'Transforms',
                    to: '/features/transforms/'
                },
                {
                    title: 'Interactivity',
                    to: '/features/interactivity/'
                }
            ]
        },
        {
            title: 'Marks',
            collapsible: true,
            items: [
                { title: 'Area', to: '/marks/area/' },
                { title: 'Arrow', to: '/marks/arrow/' },
                { title: 'Axis', to: '/marks/axis/' },
                { title: 'Bar', to: '/marks/bar/' },
                { title: 'Bollinger', to: '/marks/bollinger/' },
                { title: 'Cell', to: '/marks/cell/' },
                { title: 'Dot', to: '/marks/dot/' },
                { title: 'Frame', to: '/marks/frame/' },
                { title: 'Grid', to: '/marks/grid/' },
                { title: 'Line', to: '/marks/line/' },
                { title: 'Link', to: '/marks/link/' },
                { title: 'Rect', to: '/marks/rect/' },
                { title: 'Regression', to: '/marks/regression/' },
                { title: 'Rule', to: '/marks/rule/' },
                { title: 'Text', to: '/marks/text/' },
                { title: 'Tick', to: '/marks/tick/' }
            ]
        },
        {
            title: 'Transforms',
            collapsible: true,
            items: [
                { title: 'Bin', to: '/transforms/bin/' },
                { title: 'Filter', to: '/transforms/filter/' },
                { title: 'Group', to: '/transforms/group/' },
                { title: 'Interval', to: '/transforms/interval/' },
                { title: 'Map', to: '/transforms/map/' },
                { title: 'Select', to: '/transforms/select/' },
                { title: 'Sort', to: '/transforms/sort/' },
                { title: 'Stack', to: '/transforms/stack/' },
                { title: 'Window', to: '/transforms/window/' }
            ]
        }
    ]
};
