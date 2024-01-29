import type { MouseEventHandler } from 'svelte/elements';

export type ScaleType =
    | 'linear'
    | 'pow'
    | 'sqrt'
    | 'log'
    | 'symlog'
    | 'time'
    | 'point'
    | 'ordinal'
    | 'sequential'
    | 'band'
    | 'categorical'
    | 'cyclical'
    | 'threshold'
    | 'quantile'
    | 'quantize'
    | 'diverging'
    | 'diverging-log'
    | 'diverging-pow'
    | 'diverging-sqrt'
    | 'diverging-symlog';

export type ScaleName = 'x' | 'y' | 'r' | 'color' | 'opacity' | 'length' | 'symbol';

export type ChannelName = ScaledChannelName | 'z' | 'sort';

export type ScaledChannelName =
    | 'fill'
    | 'fillOpacity'
    | 'opacity'
    | 'r'
    | 'length'
    | 'stroke'
    | 'strokeOpacity'
    | 'symbol'
    | 'x'
    | 'x1'
    | 'x2'
    | 'y'
    | 'y1'
    | 'y2';

export type RawValue = number | Date | boolean | string | null;

export type ScaleOptions = {
    type: ScaleType | 'auto';
    domain?: RawValue[];
    range?: RawValue[];
    reverse: boolean;
    label?: string;
    interval?: string | number;
    // quantitative scales
    clamp: boolean;
    nice: boolean;
    zero: boolean;
    round: boolean;
    percent: boolean;
    transform?: (d: RawValue) => RawValue;
    // point & band scales
    padding: number;
    align: number;
    // band scales
    paddingInner?: number;
    paddingOuter?: number;
    // position scales
    insetLeft?: number;
    insetRight?: number;
    insetTop?: number;
    insetBottom?: number;
    ticks?: (number | Date)[];
    tickSpacing: number;
    // log scales
    base?: number;
};

export type ColorScaleOptions = ScaleOptions & {
    legend: boolean;
    type:
        | ScaleType
        | 'categorical'
        | 'sequential'
        | 'cyclical'
        | 'threshold'
        | 'quantile'
        | 'quantize'
        | 'diverging'
        | 'diverging-log'
        | 'diverging-pow'
        | 'diverging-sqrt'
        | 'diverging-symlog';
    scheme: string;
    interpolate: (d: any) => typeof d;
};

export type AxisXAnchor = 'bottom' | 'top' | 'both';
export type AxisYAnchor = 'left' | 'right' | 'both';

export type XScaleOptions = ScaleOptions & {
    grid: boolean;
    axis: AxisXAnchor | null;
};

export type YScaleOptions = ScaleOptions & {
    grid: boolean;
    axis: AxisYAnchor | null;
};

export type LegendScaleOptions = ScaleOptions & {
    legend: boolean;
};

export type PlotOptions = {
    title: string;
    subtitle: string;
    caption: string;
    maxWidth?: string;
    height: 'auto' | number;
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    marginBottom: number;
    grid: boolean;
    frame: boolean;
    inset: number;
    x: XScaleOptions;
    y: YScaleOptions;
    r: ScaleOptions;
    color: ColorScaleOptions;
    opacity: ScaleOptions;
    symbol: LegendScaleOptions;
    length: ScaleOptions;
};

export type GenericMarkOptions = Record<string, any>;

export type MarkType =
    | 'barX'
    | 'barY'
    | 'dot'
    | 'ruleX'
    | 'ruleY'
    | 'axisX'
    | 'axisY'
    | 'gridX'
    | 'gridY'
    | 'area'
    | 'tick'
    | 'frame';

export type Mark<T> = {
    id: symbol;
    type: MarkType;
    channels: ScaledChannelName[];
    scales: Set<ScaleName>;
    data: DataRecord[];
    options: T;
};

export type DataRecord = Record<string, RawValue> & {
    ___orig___?: RawValue | [RawValue, RawValue];
    ___cache___?: Map<symbol, RawValue>;
};

export type DataRow = DataRecord | RawValue | [number, number];

type PlotScale = {
    type: ScaleType;
    domain: RawValue[];
    range: RawValue[];
    autoTitle?: string;
    skip: Set<symbol>;
    fn: (d: RawValue) => RawValue;
};

export type CurveName =
    | 'basis'
    | 'basis-closed'
    | 'basis-open'
    | 'bundle'
    | 'bump-x'
    | 'bump-y'
    | 'cardinal'
    | 'cardinal-closed'
    | 'cardinal-open'
    | 'catmull-rom'
    | 'catmull-rom-closed'
    | 'catmull-rom-open'
    | 'linear'
    | 'linear-closed'
    | 'monotone-x'
    | 'monotone-y'
    | 'natural'
    | 'step'
    | 'step-after'
    | 'step-before';

export type PlotScales = Record<ScaleName, PlotScale>;

export type ChannelAccessor = RawValue | ((d: DataRow) => RawValue) | null | undefined;

export type ConstantAccessor<T> = T | ((d: DataRow) => T) | null | undefined;

export type PlotState = {
    width: number;
    height: number;
    options: PlotOptions;
    plotWidth: number;
    plotHeight: number;
    scales: PlotScales;
};

export type PlotContext = {
    addMark: (mark: Mark<GenericMarkOptions>) => void;
    updateMark: (mark: Mark<GenericMarkOptions>) => void;
    removeMark: (mark: Mark<GenericMarkOptions>) => void;
    state: () => PlotState;
};

export type BaseMarkStyleProps = Partial<{
    dx: ConstantAccessor<number>;
    dy: ConstantAccessor<number>;
    fill: ConstantAccessor<string>;
    fillOpacity: ConstantAccessor<number>;
    stroke: ConstantAccessor<string>;
    strokeWidth: ConstantAccessor<number>;
    strokeOpacity: ConstantAccessor<number>;
    strokeLinejoin: ConstantAccessor<'bevel' | 'miter' | 'miter-clip' | 'round'>;
    strokeLinecap: ConstantAccessor<'butt' | 'square' | 'round'>;
    strokeMiterlimit: ConstantAccessor<number>;
    opacity: ConstantAccessor<number>;
    strokeDasharray: ConstantAccessor<string>;
    strokeDashoffset: ConstantAccessor<number>;
    mixBlendMode: ConstantAccessor<
        | 'normal'
        | 'multiply'
        | 'screen'
        | 'overlay'
        | 'darken'
        | 'lighten'
        | 'color-dodge'
        | 'color-burn'
        | 'hard-light'
        | 'soft-light'
        | 'difference'
        | 'exclusion'
        | 'hue'
        | 'saturation'
        | 'color'
        | 'luminosity'
        | 'plus-darker'
        | 'plus-lighter'
    >;
    imageFilter: ConstantAccessor<string>;
    shapeRendering: ConstantAccessor<
        'crispEdges' | 'geometricPrecision' | 'optimizeSpeed' | 'auto'
    >;
    paintOrder: ConstantAccessor<string>;
    onclick?: MouseEventHandler<SVGPathElement>;
    onmouseenter?: MouseEventHandler<SVGPathElement>;
    onmouseleave?: MouseEventHandler<SVGPathElement>;
}>;

export type RectMarkProps = {
    rx?: ConstantAccessor<number>;
    ry?: ConstantAccessor<number>;
};
