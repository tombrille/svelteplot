export default class Nav {
    pages: { title: string; url: string }[] = $state([]);

    constructor() {
        this.pages.push({ title: 'Lines', url: '/marks/line' });
        this.pages.push({ title: 'Rules', url: '/marks/rule' });
    }
}
