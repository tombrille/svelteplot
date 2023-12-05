export default class Nav {
    pageGroups: { title: string; pages: { title: string; url: string }[] }[] = $state([]);
    // pages: { title: string; url: string }[] = $state([]);

    constructor() {
        this.pageGroups.push({
            title: 'Introduction',
            pages: [{ title: 'What is SveltePlot', url: '/' }]
        });
        this.pageGroups.push({
            title: 'Features',
            pages: [
                { title: 'Plot', url: '/features/plot' },
                { title: 'Scales', url: '/features/scales' },
                { title: 'Interaction', url: '/features/interactivity' }
            ]
        });
        this.pageGroups.push({
            title: 'Marks',
            pages: [
                { title: 'Frame', url: '/marks/frame' },
                { title: 'Axis', url: '/marks/axis' },
                { title: 'Grid', url: '/marks/grid' },
                { title: 'Dot', url: '/marks/dot' },
                { title: 'Line', url: '/marks/line' },
                { title: 'Rule', url: '/marks/rule' }
            ]
        });
    }
}
