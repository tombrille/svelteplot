import type { Snippet } from 'svelte';
import type { SCALE_TYPES } from './contants.js';
import type { Plot } from './classes/Plot.svelte.js';
import type { MouseEventHandler } from 'svelte/elements';

declare module 'underscore/modules/isEqual' {
    const isEqual: (a: any, b: any) => boolean;
    export = isEqual;
}

export type ScaleName = 'x' | 'y' | 'r' | 'color' | 'opacity' | 'length' | 'symbol';

/**
 * these are all the channels that are (potentially) bound to scales
 */
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

export type ChannelName = ScaledChannelName | 'z' | 'sort';

export type Datasets = {
    aapl: {
        Date: Date;
        High: number;
        Low: number;
        Open: number;
        Close: number;
        'Adj Close': number;
    }[];
    alphabet: {
        letter: string;
        frequency: number;
    }[];
    cars: {
        name: string;
        'economy (mpg)': number;
        cylinders: number;
        'displacement (cc)': number;
        'power (hp)': number;
        'weight (lb)': number;
        '0-60 mph (s)': number;
        year: number;
    }[];
    penguins: {
        species: string;
        island: string;
        culmen_length_mm: number;
        culmen_depth_mm: number;
        flipper_length_mm: number;
        body_mass_g: number;
        sex: string;
    }[];
    bls: {
        division: string;
        date: Date;
        unemployment: number;
    }[];
    stageage: {
        state: string;
        age: string;
        population: number;
        pop_share: number;
    }[];
    stocks: {
        Symbol: string;
        Date: Date;
        Open: number;
        High: number;
        Low: number;
        Close: number;
        'Adj Close': number;
        Volume: number;
    }[];
    riaa: {
        format: string;
        group: string;
        year: Date;
        revenue: number;
    }[];
};

export type AxisXAnchor = 'bottom' | 'top' | 'both';
export type AxisYAnchor = 'left' | 'right' | 'both';

export type PositionScaleOptions = Partial<{
    label?: string | null;
    domain?: [number, number] | null;
    grid?: boolean;
    ticks?: RawValue[];
    tickSpacing?: number;
    log?: boolean;
    reverse?: boolean;
}>;

export type ScaleType =
    | 'auto'
    | 'linear'
    | 'pow'
    | 'sqrt'
    | 'log'
    | 'symlog'
    | 'time'
    | 'point'
    | 'band';

export type PositionScaleType = ScaleType | ('point' | 'band');

export type ColorScaleType =
    | ScaleType
    | (
          | 'categorical'
          | 'sequential'
          | 'sequentialSymlog'
          | 'sequentialLog'
          | 'sequentialPow'
          | 'sequentialSqrt'
          | 'sequentialQuantile'
          | 'cyclical'
          | 'threshold'
          | 'quantile'
          | 'quantize'
          | 'diverging'
          | 'divergingLog'
          | 'divergingPow'
          | 'divergingSqrt'
          | 'divergingSymlog'
      );

/*
 * these are the props that can be set by the user on the <Plot> element directly
 */
export type PlotProps = {
    testid?: string;
    height?: number | 'auto';
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    maxWidth?: string;
    inset?: number;
    grid?: boolean;
    frame?: boolean;
    title?: string;
    subtitle?: string;
    caption?: string;
    // events
    onmousemove?: MouseEventHandler<SVGElement>;
    // snippets
    header?: Snippet<Plot>;
    footer?: Snippet<Plot>;
    children?: Snippet<Plot>;
    overlay?: Snippet<Plot>;
    // options for scales
    radius?: { range?: [number, number] };
    x?: PositionScaleOptions & {
        type?: PositionScaleType;
        axis?: AxisXAnchor | { anchor: AxisXAnchor; tickSpacing: number };
    };
    y?: PositionScaleOptions & {
        type?: PositionScaleType;
        axis?: AxisYAnchor | { anchor: AxisYAnchor; tickSpacing: number };
    };
    symbol?: {
        range?: string[];
        legend?: boolean;
    } | null;
    color?: {
        type?: ColorScaleType;
        range?: string[];
        domain: RawValue[];
        scheme?: ColorScheme;
        legend?: boolean;
    } | null;
};

export type Margins = {
    top: number;
    left: number;
    bottom: number;
    right: number;
};

export type GridProps = {
    tickFormat?: (d: any) => string;
};

export type DataRecord = Record<string, RawValue> & {
    ___orig___?: RawValue | [RawValue, RawValue];
};
export type DataRow = DataRecord | RawValue | [number, number];

export type ChannelAccessor = RawValue | ((d: DataRow) => RawValue) | null | undefined;

export type ConstantAccessor<T> = T | ((d: DataRow) => T) | null | undefined;

export type RawValue = number | Date | boolean | string | null;

// list of all prossible style props on marks
export type MarkStyleProps =
    | 'strokeDasharray'
    | 'opacity'
    | 'fill'
    | 'fillOpacity'
    | 'fontWeight'
    | 'fontSize'
    | 'stroke'
    | 'strokeWidth'
    | 'strokeOpacity'
    | 'x'
    | 'y'
    | 'angle'
    | 'radius'
    | 'symbol'
    | 'textAnchor'
    | 'width';

export type MarkProps2 = 'x' | 'y' | 'r' | 'rotate' | 'symbol';

export type ValueOf<T> = T[keyof T];

export type ChannelType = ValueOf<typeof SCALE_TYPES>;

export interface MarkProps {
    data: DataRow[];
    onclick?: MouseEventHandler<SVGPathElement>;
    onmouseenter?: MouseEventHandler<SVGPathElement>;
    onmouseleave?: MouseEventHandler<SVGPathElement>;
    dx: ConstantAccessor<number>;
    dy: ConstantAccessor<number>;
}

export type BaseRectMarkProps = {
    inset?: ConstantAccessor<number>;
    insetLeft?: ConstantAccessor<number>;
    insetRight?: ConstantAccessor<number>;
    insetTop?: ConstantAccessor<number>;
    insetBottom?: ConstantAccessor<number>;
    rx?: ConstantAccessor<number>;
    ry?: ConstantAccessor<number>;
};

export type BaseMarkProps = MarkProps & {
    type: string;
    channels: ScaledChannelName[];
    automatic: boolean;
};

export type BaseMarkStyleProps = Partial<{
    fill: ChannelAccessor;
    fillOpacity: ChannelAccessor;
    stroke: ChannelAccessor;
    strokeWidth: ConstantAccessor<number>;
    strokeOpacity: ChannelAccessor;
    strokeLinejoin: ConstantAccessor<'bevel' | 'miter' | 'miter-clip' | 'round'>;
    strokeLinecap: ConstantAccessor<'butt' | 'square' | 'round'>;
    strokeMiterlimit: ConstantAccessor<number>;
    opacity: ChannelAccessor;
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
}>;

export type FrameProps = BaseMarkStyleProps;

export type GridOptions = {
    ticks?: RawValue[];
    strokeDasharray?: ChannelAccessor;
    stroke?: ChannelAccessor;
    strokeWidth?: ChannelAccessor;
};

export type GridXMarkProps = Partial<MarkProps> &
    GridOptions & {
        y1?: ChannelAccessor;
        y2?: ChannelAccessor;
        automatic?: boolean;
    };

export type GridYMarkProps = Partial<MarkProps> &
    GridOptions & {
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        automatic?: boolean;
    };

export type AxisMarkOptions = {
    ticks?: RawValue[];
    automatic?: boolean;
    tickSize?: number;
    tickPadding?: number;
    tickFormat?: ((d: RawValue) => string) | string;
    tickFontSize?: ChannelAccessor;
    title?: string;
    stroke?: ChannelAccessor;
    fill?: ChannelAccessor;
};

export type AxisXMarkProps = AxisMarkOptions & {
    anchor?: 'top' | 'bottom';
};

export type AxisYMarkProps = AxisMarkOptions & {
    anchor?: 'left' | 'right';
};

type RuleMarkProps = {
    stroke?: ChannelAccessor;
    opacity?: ChannelAccessor;
    strokeOpacity?: ChannelAccessor;
    strokeDasharray?: ChannelAccessor;
    strokeWidth?: ChannelAccessor;
};

export type RuleXMarkProps = MarkProps &
    RuleMarkProps & {
        x?: ChannelAccessor;
        y1?: ChannelAccessor;
        y2?: ChannelAccessor;
    };

export type RuleYMarkProps = MarkProps &
    RuleMarkProps & {
        y?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
    };

export type TickMarkProps = MarkProps & {
    x?: ChannelAccessor;
    y?: ChannelAccessor;
    stroke?: ChannelAccessor;
};

export type ColorScheme =
    | 'brbg'
    | 'prgn'
    | 'piyg'
    | 'puor'
    | 'rdbu'
    | 'rdgy'
    | 'rdylbu'
    | 'rdylgn'
    | 'spectral'
    | 'burd'
    | 'buylrd'
    | 'blues'
    | 'greens'
    | 'greys'
    | 'oranges'
    | 'purples'
    | 'reds'
    | 'turbo'
    | 'viridis'
    | 'magma'
    | 'inferno'
    | 'plasma'
    | 'cividis'
    | 'cubehelix'
    | 'warm'
    | 'cool'
    | 'bugn'
    | 'bupu'
    | 'gnbu'
    | 'orrd'
    | 'pubu'
    | 'pubugn'
    | 'purd'
    | 'rdpu'
    | 'ylgn'
    | 'ylgnbu'
    | 'ylorbr'
    | 'ylorrd'
    | 'rainbow'
    | 'sinebow'
    | 'accent'
    | 'category10'
    | 'dark2'
    | 'paired'
    | 'pastel1'
    | 'pastel2'
    | 'set1'
    | 'set2'
    | 'set3'
    | 'tableau10';

export type Curve =
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

type Channels = Partial<Record<ScaledChannelName, ChannelAccessor>>;

export type TransformArg<T, K> = Partial<T> & Channels & { data: K[] };
