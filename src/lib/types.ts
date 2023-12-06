import type { CHANNEL_TYPES } from './contants';

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
};

export type AxisXAnchor = 'bottom' | 'top' | 'both';
export type AxisYAnchor = 'left' | 'right' | 'both';

export type PositionChannelOptions = Partial<{
    label?: string | null;
    domain?: [number, number] | null;
    grid?: boolean;
    ticks?: RawValue[];
    tickSpacing?: number;
    log?: boolean;
    reverse?: boolean;
}>;

/*
 * these are the props that can be set by the user on the <Plot> element directly
 */
export type PlotProps = {
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
    // snippets
    header?: () => void;
    footer?: () => void;
    children?: () => void;
    // options for scales
    radius?: { range?: [number, number] };
    x?: PositionChannelOptions & {
        axis?: AxisXAnchor | { anchor: AxisXAnchor; tickSpacing: number };
    };
    y?: PositionChannelOptions & {
        axis?: AxisYAnchor | { anchor: AxisYAnchor; tickSpacing: number };
    };
    symbol?: {
        range?: string[];
    };
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

export type ChannelAccessor = RawValue | ((d: DataRow) => RawValue) | null;

export type RawValue = number | Date | boolean | string | null;

export type ChannelName = 'opacity' | 'color' | 'x' | 'y' | 'angle' | 'radius' | 'symbol' | 'width';

// const MarkPro

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

export type ChannelType = ValueOf<typeof CHANNEL_TYPES>;

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

export type DotMarkProps = MarkProps &
    BaseMarkStyleProps & {
        data: DataRow[];
        x?: ChannelAccessor;
        y?: ChannelAccessor;
        r?: ChannelAccessor;
        rotate?: ChannelAccessor;
        symbol?: ChannelAccessor;
    };

export type LineMarkProps = MarkProps &
    BaseMarkStyleProps & {
        data: DataRow[];
        x?: ChannelAccessor;
        y?: ChannelAccessor;
        z?: ChannelAccessor;
    };

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
