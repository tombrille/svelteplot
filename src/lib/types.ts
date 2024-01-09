import type { Snippet } from 'svelte';
import type { SCALE_TYPES } from './contants.js';
import type { Plot } from './classes/Plot.svelte';
import type { MouseEventHandler } from 'svelte/elements';

export type ScaleName =
    | 'opacity'
    | 'color'
    | 'x'
    | 'y'
    | 'angle'
    | 'radius'
    | 'symbol'
    | 'width'
    | 'fontSize';

export type Datasets = {
    aapl: {
        Date: Date;
        High: number;
        Low: number;
        Open: number;
        Close: number;
        'Adj Close': number;
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

export type ScaleType = 'linear' | 'pow' | 'sqrt' | 'log' | 'symlog' | 'time' | 'point' | 'band';

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

export type DataRecord = Record<string, RawValue>;
export type DataRow = DataRecord | RawValue | [number, number];

export type ChannelAccessor = RawValue | ((d: DataRow) => RawValue) | null | undefined;

export type RawValue = number | Date | boolean | string | null;

export type ChannelName =
    | 'angle'
    | 'fill'
    | 'fillOpacity'
    | 'fontSize'
    | 'opacity'
    | 'r'
    | 'sort'
    | 'stroke'
    | 'strokeDasharray'
    | 'strokeOpacity'
    | 'symbol'
    | 'width'
    | 'x'
    | 'x1'
    | 'x2'
    | 'y'
    | 'y1'
    | 'y2'
    | 'z';

// list of all prossible style props on marks
export type MarkStyleProps =
    | 'strokeDasharray'
    | 'opacity'
    | 'fill'
    | 'fillOpacity'
    | 'fontSize'
    | 'stroke'
    | 'strokeWidth'
    | 'strokeOpacity'
    | 'x'
    | 'y'
    | 'angle'
    | 'radius'
    | 'symbol'
    | 'width';

export type MarkProps2 = 'x' | 'y' | 'r' | 'rotate' | 'symbol';

export type ValueOf<T> = T[keyof T];

export type ChannelType = ValueOf<typeof SCALE_TYPES>;

export interface MarkProps {
    data: DataRow[];
}

export type BaseMarkProps = MarkProps & {
    type: string;
    channels: ChannelName[];
    automatic: boolean;
};

export type BaseMarkStyleProps = {
    fill?: ChannelAccessor;
    stroke?: ChannelAccessor;
    opacity?: ChannelAccessor;
    fillOpacity?: ChannelAccessor;
    strokeOpacity?: ChannelAccessor;
    strokeWidth?: ChannelAccessor;
    strokeDasharray?: ChannelAccessor;
};

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
