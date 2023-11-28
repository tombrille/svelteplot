import type { ChannelName, ChannelType, Mark } from '$lib/types';
import resolveChannel from '$lib/helpers/resolveChannel';
import { extent } from 'd3-array';
import { CHANNEL_MAP } from '$lib/contants';
import {
	isBooleanOrNull,
	isDateOrNull,
	isNumberOrNull,
	isStringOrNull
} from '$lib/helpers/typeChecks';
import { uniq } from 'underscore';
import {
	scaleBand,
	scaleLinear,
	scaleTime,
	type ScaleLinear,
	type ScaleTime,
	type ScaleBand
} from 'd3-scale';

type Scale =  ScaleLinear<number, number>
		| ScaleTime<Date, number>
		| ScaleBand<string>;

export class Channel {
	readonly name: ChannelName;
	readonly type: ChannelType;
	// all marks that have this channel
	marks: Mark[] = $state([]);

	readonly dataValues = $derived(
		this.marks
			.filter(mark => mark.props.data.length)
			.map((mark) => mark.props.data.map((row) => resolveChannel(this.name, row, mark.props[this.name])))
			.flat(2)
	);

	readonly valueType = $derived(
		this.dataValues.every(isBooleanOrNull)
			? 'boolean'
			: this.dataValues.every(isStringOrNull)
			  ? 'text'
			  : this.dataValues.every(isNumberOrNull)
			    ? 'number'
			    : this.dataValues.every(isDateOrNull)
			      ? 'date'
			      : 'mixed'
	);

	readonly domain = $derived(
		this.valueType === 'boolean' || this.valueType === 'text'
			? uniq(this.dataValues)
			: extent(this.dataValues as ('date' | 'number')[])
	) as [number, number] | [Date, Date] | string[];

	readonly scale: Scale = $derived(
		this.valueType === 'date'
			? scaleTime()
			: this.valueType === 'number'
			  ? scaleLinear()
			  : this.valueType === 'text'
			    ? scaleBand()
			    : scaleLinear()
	);

	constructor(name: ChannelName) {
		this.name = name;
		this.type = CHANNEL_MAP[name];
	}

	addMark(mark: Mark) {
		this.marks = [...this.marks, mark];
	}
}

// opacity: typeof === 'number' && between [0,1]
