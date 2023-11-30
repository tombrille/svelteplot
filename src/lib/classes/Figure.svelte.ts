import { createScale } from '$lib/helpers/createScale';
import type { BaseMarkProps, Margins } from '../types';
import { Channel } from './Channel.svelte';
import type { Mark } from './Mark.svelte';

const DEFAULT_OPTIONS = {
	marginLeft: 0,
	marginRight: 0,
	marginTop: 0,
	marginBottom: 0,
	radius: { range: [1,10] }
}
export class Figure {
	width = $state(600);
	height = $state(400);
	marginLeft = $state(0);
	marginRight = $state(0);
	marginTop = $state(0);
	marginBottom = $state(0);

	options = $state(DEFAULT_OPTIONS);

	marks = $state<Mark<BaseMarkProps>[]>([]);
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

	x = new Channel('x');
	y = new Channel('y');
	radius = new Channel('radius');
	color = new Channel('color');

	readonly xScale = $derived(
		createScale(this.x.scaleType, this.x.domain, [this.marginLeft, this.marginLeft + this.plotWidth])
	);

	readonly yScale = $derived(
		createScale(this.y.scaleType, this.y.domain, [this.height - this.marginBottom, this.marginTop])
	);

	readonly radiusScale = $derived(
		createScale(this.radius.scaleType, [0, Math.max(this.radius.domain[0], this.radius.domain[1])], this.options.radius.range)
	);

	constructor(
		width: number,
		height: number,
		options: {
			marginTop: number;
			marginLeft: number;
			marginRight: number;
			marginBottom: number;
			radius?: { range: [number, number] }
		}
	) {
		const { marginTop, marginLeft, marginBottom, marginRight, ...restOpts } = { ...DEFAULT_OPTIONS, ...options };
		this.width = width;
		this.height = height;
		this.marginBottom = marginBottom;
		this.marginTop = marginTop;
		this.marginRight = marginRight;
		this.marginLeft = marginLeft;
		this.options = restOpts;
		// this.margins = margins;
	}

	private updateChannels() {
		this.x.marks = this.marks;
		this.y.marks = this.marks;
		this.radius.marks = this.marks;
		this.color.marks = this.marks;
	}

	addMark(mark: Mark<BaseMarkProps>) {
		// console.log('addMark: ' + mark);
		this.marks = [...this.marks, mark];
		// add mark to respective channels
		this.updateChannels();
	}

	removeMark(removeMark: Mark) {
		console.log('removeMark: ' + removeMark);
		this.marks = this.marks.filter((mark) => mark.id !== removeMark.id);
		this.updateChannels();
	}
}
