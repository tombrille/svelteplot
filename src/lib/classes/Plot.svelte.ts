import { createScale, createColorScale } from '$lib/helpers/createScale';
import mergeDeep from '$lib/helpers/mergeDeep';
import type { SymbolType } from 'd3-shape';
import type {
    BaseMarkProps,
    Margins,
    PositionChannelOptions,
    RawValue,
    AxisXAnchor,
    AxisYAnchor
} from '../types';
import { Channel } from './Channel.svelte';
import type { Mark } from './Mark.svelte';

export const DEFAULT_PLOT_OPTIONS: {
    title: string;
    subtitle: string;
    caption: string;
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    marginBottom: number;
    inset: number;
    radius: { range?: [number, number] };
    symbol: { range?: (string | SymbolType)[] };
    x: PositionChannelOptions & {
        axis?: AxisXAnchor;
    };
    y: PositionChannelOptions & {
        axis?: AxisYAnchor;
    };
} = {
    title: '',
    subtitle: '',
    caption: '',
    marginLeft: 0,
    marginRight: 0,
    marginTop: 30,
    marginBottom: 0,
    radius: { range: [1, 10] },
    symbol: {},
    x: {
        domain: undefined,
        grid: false,
        ticks: undefined,
        tickSpacing: 80,
        axis: 'bottom',
        log: false,
        reverse: false
    },
    y: {
        domain: undefined,
        grid: false,
        ticks: undefined,
        tickSpacing: 60,
        axis: 'left',
        log: false,
        reverse: false
    }
};

export class Plot {
    width = $state(600);
    _height = $state<number | 'auto'>(400);

    options = $state(DEFAULT_PLOT_OPTIONS);

    marks = $state<Mark<BaseMarkProps>[]>([]);

    readonly hasChannelX = $derived(!!this.marks.find((mark) => mark.channels.has('x')));
    readonly hasChannelY = $derived(!!this.marks.find((mark) => mark.channels.has('y')));

    readonly hasFilledDotMarks = $derived<boolean>(
        !!this.marks.find((d) => d.type === 'dot' && d.props?.fill)
    );

    readonly manualMarks = $derived(this.marks.filter((mark) => !mark.automatic));

    readonly singlePosChannelMark = $derived<boolean>(
        this.manualMarks.length === 1 &&
            (!this.manualMarks[0].channels.has('x') || !this.manualMarks[0].channels.has('y'))
    );

    readonly height = $derived(
        this._height === 'auto' ? (this.hasChannelY ? 400 : 90) : this._height
    );

    readonly inset = $derived(
        typeof this.options.inset === 'number'
            ? this.options.inset
            : this.singlePosChannelMark
              ? 10
              : 0
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
            this.options?.x?.domain || this.x.domain,
            this.options?.x?.reverse
                ? [this.margins.left + this.plotWidth - this.inset, this.margins.left + this.inset]
                : [this.margins.left + this.inset, this.margins.left + this.plotWidth - this.inset],
            this.x.scaleType === 'linear' && this.options.x.log ? { base: 10 } : {}
        )
    );

    readonly yScale = $derived(
        createScale(
            this.y.scaleType === 'linear' && this.options.y.log ? 'log' : this.y.scaleType,
            this.options.y?.domain || this.y.domain,
            this.options.y?.reverse
                ? [this.margins.top + this.inset, this.height - this.margins.bottom - this.inset]
                : [this.height - this.margins.bottom - this.inset, this.margins.top + this.inset],
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

    readonly symbolScale = $derived(
        createScale(
            'ordinal',
            this.symbol.domain,
            this.options.symbol?.range || this.hasFilledDotMarks
                ? ['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']
                : ['circle', 'plus', 'times', 'triangle2', 'asterisk', 'square2', 'diamond2']
        )
    );

    readonly colorScale = $derived(
        createColorScale(this.color.scaleType, this.color.domain)
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

    addMark(mark: Mark<BaseMarkProps>) {
        // console.log('addMark: ' + mark);
        this.marks = [...this.marks, mark];
        // add mark to respective channels
    }

    removeMark(removeMark: Mark<BaseMarkProps>) {
        this.marks = this.marks.filter((mark) => mark.id !== removeMark.id);
    }
}
