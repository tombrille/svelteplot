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
                { title: 'Area', url: '/marks/area' },
                { title: 'Axis', url: '/marks/axis' },
                { title: 'Dot', url: '/marks/dot' },
                { title: 'Frame', url: '/marks/frame' },
                { title: 'Grid', url: '/marks/grid' },
                { title: 'Line', url: '/marks/line' },
                { title: 'Rule', url: '/marks/rule' }
            ]
        });
    }
}
