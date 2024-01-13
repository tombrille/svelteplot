export default {
    '/': [
        {
            items: [
                {
                    title: 'Guide',
                    collapsible: true,
                    items: [
                        {
                            title: 'Introduction',
                            to: '/guide/introduction'
                        }
                    ]
                },
                {
                    title: 'Features',
                    collapsible: true,
                    items: [{
                        title: 'Plot',
                        to: '/features/plot'
                    }, {
                        title: 'Scales',
                        to: '/features/scales'
                    }, {
                        title: 'Interactivity',
                        to: '/features/interactivity'
                    }]
                },
                {
                    title: 'Marks',
                    collapsible: true,
                    items: [
                        { title: 'Area', to: '/marks/area' },
                        { title: 'Axis', to: '/marks/axis' },
                        { title: 'Bar', to: '/marks/bar' },
                        { title: 'Dot', to: '/marks/dot' },
                        { title: 'Frame', to: '/marks/frame' },
                        { title: 'Grid', to: '/marks/grid' },
                        { title: 'Line', to: '/marks/line' },
                        { title: 'Rule', to: '/guide/marks/rule' },
                        { title: 'Tick', to: '/guide/marks/tick' }
                    ]
                }
            ]
        }
    ]
};
