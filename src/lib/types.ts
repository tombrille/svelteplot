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
};

export type FigureProps = {
	height?: number;
	marginTop?: number;
	marginBottom?: number;
	marginLeft?: number;
	marginRight?: number;
	header?: () => void;
	footer?: () => void;
	children?: () => void;
	// options for scales
	radius?: { range?: [number, number] };
	y?: { domain?: [number, number] };
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
};

export type BaseMarkStyleProps = {
	fill?: ChannelAccessor;
	stroke?: ChannelAccessor;
	opacity?: ChannelAccessor;
	fillOpacity?: ChannelAccessor;
	strokeOpacity?: ChannelAccessor;
	strokeWidth?: ChannelAccessor;
};

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
	title: string;
	strokeDasharray?: ChannelAccessor;
	stroke?: ChannelAccessor;
	strokeWidth?: ChannelAccessor;
	tickFormat: ((d: RawValue) => string) | string;
};

export type GridXMarkProps = MarkProps & {
	y1?: ChannelAccessor;
	y2?: ChannelAccessor;
};

export type GridYMarkProps = MarkProps & {
	x1?: ChannelAccessor;
	x2?: ChannelAccessor;
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
