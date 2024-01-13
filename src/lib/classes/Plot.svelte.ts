import { createScale, createColorScale } from '$lib/helpers/createScale.js';
import mergeDeep from '$lib/helpers/mergeDeep.js';
import type { SymbolType } from 'd3-shape';
import type {
    BaseMarkProps,
    Margins,
    PositionScaleOptions,
    RawValue,
    AxisXAnchor,
    AxisYAnchor,
    ColorScheme,
    ScaleType
} from '../types.js';
import { Scale } from './Scale.svelte.js';
import type { Mark } from './Mark.svelte.js';
import pick from 'underscore/modules/pick.js';

export const DEFAULT_PLOT_OPTIONS: {
    title: string;
    subtitle: string;
    caption: string;
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    marginBottom: number;
    inset?: number;
    radius: { range?: [number, number] };
    symbol: { range?: (string | SymbolType)[]; legend?: boolean } | null;
    color: { scheme?: ColorScheme; range?: string[]; domain?: RawValue[]; legend?: boolean } | null;
    x: PositionScaleOptions & {
        axis?: AxisXAnchor;
    };
    y: PositionScaleOptions & {
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
    color: {},
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

    readonly hasScaleX = $derived(
        !!this.marks.find((mark) => !mark.automatic && mark.scales.has('x'))
    );
    readonly hasScaleY = $derived(
        !!this.marks.find((mark) => !mark.automatic && mark.scales.has('y'))
    );

    readonly hasFilledDotMarks = $derived<boolean>(
        !!this.marks.find((d) => d.type === 'dot' && d.props?.fill)
    );

    readonly manualMarks = $derived(this.marks.filter((mark) => !mark.automatic));

    readonly singlePosScaleMark = $derived<boolean>(
        this.manualMarks.length === 1 &&
            (!this.manualMarks[0].channels.has('x') || !this.manualMarks[0].channels.has('y'))
    );

    readonly height = $derived(
        this._height === 'auto'
            ? this.hasScaleY
                ? this.y.scaleType === 'band'
                    ? this.y.domain.length * 30
                    : this.y.scaleType === 'point'
                      ? this.y.domain.length * 18
                      : 400
                : 90
            : this._height
    );

    readonly inset = $derived(
        typeof this.options.inset === 'number'
            ? this.options.inset
            : this.singlePosScaleMark
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

    x = new Scale('x', this);
    y = new Scale('y', this);
    radius = new Scale('radius', this);
    color = new Scale('color', this);
    symbol = new Scale('symbol', this);

    readonly colorSymbolRedundant = $derived(
        this.color.uniqueMarkProps.length === 1 &&
            this.symbol.uniqueMarkProps.length === 1 &&
            this.color.uniqueMarkProps[0] === this.symbol.uniqueMarkProps[0]
    );

    readonly xScale = $derived(
        createScale(
            this.x.scaleType,
            this.options?.x?.domain || this.x.domain,
            this.options?.x?.reverse
                ? [this.margins.left + this.plotWidth - this.inset, this.margins.left + this.inset]
                : [this.margins.left + this.inset, this.margins.left + this.plotWidth - this.inset],
            // options
            getScaleOptions(this.x.scaleType, this.options.x)
        )
    );

    readonly yScale = $derived(
        createScale(
            this.y.scaleType,
            this.options.y?.domain || this.y.domain,
            this.options.y?.reverse
                ? [this.margins.top + this.inset, this.height - this.margins.bottom - this.inset]
                : [this.height - this.margins.bottom - this.inset, this.margins.top + this.inset],
            // options
            getScaleOptions(this.y.scaleType, this.options.y)
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
                : ['circle', 'plus', 'times', 'triangle2', 'asterisk', 'square2', 'diamond2'],
            getScaleOptions(this.symbol.scaleType, this.options.symbol || {})
        )
    );

    readonly colorScale = $derived(
        createColorScale(
            this.color.scaleType,
            this.color.domain,
            this.options.color?.range || null,
            this.options.color?.scheme
        )
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
        this.marks = [...this.marks, mark];
    }

    removeMark(removeMark: Mark<BaseMarkProps>) {
        this.marks = this.marks.filter((mark) => mark.id !== removeMark.id);
    }
}

/**
 * users can pass options to the D3 scale function
 */
function getScaleOptions(scaleType: ScaleType, options: Record<string, any> = {}) {
    return scaleType === 'linear'
        ? pick(options, ['clamp', 'unknown'])
        : scaleType === 'pow'
          ? pick(options, ['exponent'])
          : scaleType === 'log'
            ? { base: 10, ...pick(options, ['base']) }
            : scaleType === 'symlog'
              ? pick(options, ['constant'])
              : scaleType === 'point'
                ? pick(options, ['padding', 'align', 'round'])
                : scaleType === 'band'
                  ? pick(options, ['padding', 'paddingInner', 'paddingOuter', 'align', 'round'])
                  : {};
}
