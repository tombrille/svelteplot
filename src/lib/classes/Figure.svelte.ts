import { extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import type { Margins, Mark } from '../types';
import resolveChannel from '$lib/helpers/resolveChannel';
import { Channel } from './Channel.svelte';

export class Figure {
	width = $state(600);
	height = $state(400);
	marginLeft = $state(0);
	marginRight = $state(0);
	marginTop = $state(0);
	marginBottom = $state(0);

	readonly marks = $state<Mark[]>([]);
	// derived props
	readonly margins = $derived<Margins>({
		top: this.marginTop,
		left: this.marginLeft,
		bottom: this.marginBottom,
		right: this.marginRight
	});
	// margins = $state<Margins>({ left: 0, right: 0, top: 0, bottom: 0 });
	readonly plotWidth = $derived(this.width - this.margins.left - this.margins.right);
	readonly plotHeight = $derived(this.height - this.margins.top - this.margins.bottom);

	x = new Channel(
		'x',
		this.marks.filter((mark) => mark.channels.has('x'))
	);
	y = new Channel(
		'y',
		this.marks.filter((mark) => mark.channels.has('y'))
	);

	readonly xScale = $derived(
		this.x.scale.domain(this.x.domain).range([this.marginLeft, this.marginLeft + this.plotWidth])
	);

	readonly yScale = $derived(
		this.y.scale.domain(this.y.domain).range([this.height - this.marginBottom, this.marginTop])
	);

	constructor(
		width: number,
		height: number,
		marginTop: number,
		marginLeft: number,
		marginRight: number,
		marginBottom: number
	) {
		this.width = width;
		this.height = height;
		this.marginBottom = marginBottom;
		this.marginTop = marginTop;
		this.marginRight = marginRight;
		this.marginLeft = marginLeft;
		// this.margins = margins;
	}

	addMark(mark: Mark) {
		this.marks.push(mark);
		if (mark.channels.has('x')) this.x.addMark(mark);
		if (mark.channels.has('y')) this.y.addMark(mark);
		
		
		// console.log('y dom', this.y.dataValues, this.y.valueType, this.y.domain)
	}
}
