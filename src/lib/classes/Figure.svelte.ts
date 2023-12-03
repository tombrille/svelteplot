import { createScale } from '$lib/helpers/createScale';
import mergeDeep from '$lib/helpers/mergeDeep';
import type { BaseMarkProps, Margins } from '../types';
import { Channel } from './Channel.svelte';
import type { Mark } from './Mark.svelte';

export const DEFAULT_FIGURE_OPTIONS = {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 30,
    marginBottom: 0,
    radius: { range: [1, 10] },
    x: { domain: null, grid: false, autoTickDist: 80, axis: 'bottom' },
    y: { domain: null, grid: false, autoTickDist: 60, axis: 'left' }
};
export class Figure {
    width = $state(600);
    height = $state(400);

    options = $state(DEFAULT_FIGURE_OPTIONS);

    marks = $state<Mark<BaseMarkProps>[]>([]);
    // derived props
    readonly margins = $derived<Margins>({
        top: this.options.marginTop,
        left: this.options.marginLeft,
        bottom: this.options.marginBottom,
        right: this.options.marginRight
    });
    // margins = $state<Margins>({ left: 0, right: 0, top: 0, bottom: 0 });
    readonly plotWidth = $derived(this.width - this.margins.left - this.margins.right);
    readonly plotHeight = $derived(this.height - this.margins.top - this.margins.bottom);

    x = new Channel('x');
    y = new Channel('y');
    radius = new Channel('radius');
    color = new Channel('color');

    readonly xScale = $derived(
        createScale(this.x.scaleType, this.options.x?.domain || this.x.domain, [
            this.margins.left,
            this.margins.left + this.plotWidth
        ])
    );

    readonly yScale = $derived(
        createScale(this.y.scaleType, this.options.y?.domain || this.y.domain, [
            this.height - this.margins.bottom,
            this.margins.top
        ])
    );

    readonly radiusScale = $derived(
        createScale(
            this.radius.scaleType,
            [0, Math.max(this.radius.domain[0], this.radius.domain[1])],
            this.options.radius.range
        )
    );

    readonly hasAxisXMark = $derived(
        !!this.marks.find((mark) => mark.type === 'axis-x' && !mark.automatic)
    );
    readonly hasAxisYMark = $derived(
        !!this.marks.find((mark) => mark.type === 'axis-y' && !mark.automatic)
    );

    constructor(
        width: number,
        height: number,
        options: {
            marginTop: number;
            marginLeft: number;
            marginRight: number;
            marginBottom: number;
            radius?: { range: [number, number] };
        }
    ) {
        const opts = mergeDeep(
            {},
            DEFAULT_FIGURE_OPTIONS,
            options
        ) as typeof DEFAULT_FIGURE_OPTIONS;
        this.width = width;
        this.height = height;
        this.options = opts;
    }

    private updateChannels() {
        this.x.marks = this.marks;
        this.y.marks = this.marks;
        this.radius.marks = this.marks;
        this.color.marks = this.marks;
    }

    addMark(mark: Mark<BaseMarkProps>) {
        // console.log('addMark: ' + mark);
        this.marks = [...this.marks, mark];
        // add mark to respective channels
        this.updateChannels();
        if (mark.channels.size > 0 && this.y) {
            console.log(mark.channels, this.y.activeMarks, this.y.dataValues, this.y.domain);
        }
    }

    removeMark(removeMark: Mark<BaseMarkProps>) {
        console.log('removeMark: ' + removeMark);
        this.marks = this.marks.filter((mark) => mark.id !== removeMark.id);
        this.updateChannels();
    }
}
