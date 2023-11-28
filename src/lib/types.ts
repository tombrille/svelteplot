import type { SnippetBlock } from 'svelte/compiler';
import { CHANNEL_TYPES } from './contants';

export type FigureProps = {
	height?: number;
	marginTop?: number;
	marginBottom?: number;
	marginLeft?: number;
	marginRight?: number;
	header?: () => void;
	footer?: () => void;
	children?: () => void;
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

export type Mark = {
	type: string;
	channels: Set<ChannelName>;
	props: {
		data: DataRow[];
		x?: ChannelAccessor;
		y?: ChannelAccessor;
		r?: ChannelAccessor;
		fill?: ChannelAccessor;
		stroke?: ChannelAccessor;
	};
};

export type DataRecord = Record<string, RawValue>;
export type DataRow = DataRecord;

export type ChannelAccessor = string | ((d: DataRow) => RawValue) | null;

export type RawValue = number | Date | boolean | string | null;

export type ChannelTypeRaw = 'opacity' | 'color' | 'position' | 'angle' | 'radius' | 'symbol';

export type ChannelName =
	| 'x'
	| 'y'
	| 'r'
	| 'rotate'
	| 'symbol'
	| 'fill'
	| 'fillOpacity'
	| 'stroke'
	| 'strokeOpacity'
	| 'opacity';

export type ValueOf<T> = T[keyof T];

export type ChannelType = ValueOf<typeof CHANNEL_TYPES>;
