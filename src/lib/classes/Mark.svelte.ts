import type { ChannelAccessor, DataRow, ChannelName, MarkProps } from '$lib/types';

export class Mark<T extends MarkProps> {
	readonly id: symbol;
	readonly type: string;

	channels = $state<Set<ChannelName>>(new Set());
	props = $state<T>();

	constructor(type: string, channels: ChannelName[], props: T) {
		this.id = Symbol();
		this.type = type;
		this.channels = new Set(channels);
		this.props = props;
	}

	toString() {
		return `Mark[${this.type}]`;
	}
}

type BaseFooProps = { bar: number[] };

class Foo<T extends BaseFooProps> {
	readonly props = $state<T>();

	constructor(props: T) {
		this.props = { ...{ bar: 0 }, ...props };
	}
}
// Example usage
const validProps: BaseFooProps = { bar: [42] };
new Foo(validProps);
