import { createScale } from '$lib/helpers/createScale';
import mergeDeep from '$lib/helpers/mergeDeep';
import type { BaseMarkProps, Margins } from '../types';
import { Channel } from './Channel.svelte';
import type { Mark } from './Mark.svelte';

export const DEFAULT_PLOT_OPTIONS = {
    title: '',
    subtitle: '',
    caption: '',
    marginLeft: 0,
    marginRight: 0,
    marginTop: 30,
    marginBottom: 0,
    radius: { range: [1, 10] },
    symbol: {},
    x: { domain: null, grid: false, tickSpacing: 80, axis: 'bottom', log: false, reverse: false },
    y: { domain: null, grid: false, tickSpacing: 60, axis: 'left', log: false, reverse: false }
};

export class Plot {
    width = $state(600);
    _height = $state<number | 'auto'>(400);

    options = $state(DEFAULT_PLOT_OPTIONS);

    marks = $state<Mark<BaseMarkProps>[]>([]);

    readonly hasChannelX = $derived(!!this.marks.find((mark) => mark.channels.has('x')));
    readonly hasChannelY = $derived(!!this.marks.find((mark) => mark.channels.has('y')));

    readonly hasFilledDotMarks = $derived<boolean>(!!this.marks.find(d => d.type === 'dot' && d.props?.fill))

    readonly height = $derived(
        this._height === 'auto' ? (this.hasChannelY ? 400 : 90) : this._height
    );

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

    x = new Channel('x', this);
    y = new Channel('y', this);
    radius = new Channel('radius', this);
    color = new Channel('color', this);
    symbol = new Channel('symbol', this);

    readonly xScale = $derived(
        createScale(
            this.x.scaleType === 'linear' && this.options.x.log ? 'log' : this.x.scaleType,
            this.options.x?.domain || this.x.domain,
            this.options.x?.reverse
                ? [this.margins.left + this.plotWidth, this.margins.left]
                : [this.margins.left, this.margins.left + this.plotWidth],
            this.x.scaleType === 'linear' && this.options.x.log ? { base: 10 } : {}
        )
    );

    readonly yScale = $derived(
        createScale(
            this.y.scaleType === 'linear' && this.options.y.log ? 'log' : this.y.scaleType,
            this.options.y?.domain || this.y.domain,
            this.options.y?.reverse
                ? [this.margins.top, this.height - this.margins.bottom]
                : [this.height - this.margins.bottom, this.margins.top],
            this.y.scaleType === 'linear' && this.options.y.log ? { base: '10' } : {}
        )
    );

    readonly radiusScale = $derived(
        createScale(
            this.radius.scaleType,
            [0, Math.max(this.radius.domain[0], this.radius.domain[1])],
            this.options.radius.range
        )
    );

    readonly symbolScale = $derived(createScale(
        'ordinal',
        this.symbol.domain,
        this.options.symbol?.range ||
        this.hasFilledDotMarks ? 
        ['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'] : 
        ['circle', 'plus', 'times', 'triangle2', 'asterisk', 'square2', 'diamond2']
    ))

    readonly colorScale = $derived(
        createScale(this.color.scaleType, this.color.domain, ['white', 'blue'])
    );

    readonly hasAxisXMark = $derived(
        !!this.marks.find((mark) => mark.type === 'axis-x' && !mark.automatic)
    );
    readonly hasAxisYMark = $derived(
        !!this.marks.find((mark) => mark.type === 'axis-y' && !mark.automatic)
    );

    constructor(width: number, height: number, options: Partial<typeof DEFAULT_PLOT_OPTIONS>) {
        const opts = mergeDeep({}, DEFAULT_PLOT_OPTIONS, options) as typeof DEFAULT_PLOT_OPTIONS;
        this.width = width;
        this._height = height;
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
        console.log(mark, this.hasFilledDotMarks);
    }

    removeMark(removeMark: Mark<BaseMarkProps>) {
        this.marks = this.marks.filter((mark) => mark.id !== removeMark.id);
        this.updateChannels();
    }
}
