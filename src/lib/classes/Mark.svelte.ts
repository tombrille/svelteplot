import type { ChannelName, MarkProps } from '$lib/types.js';

export class Mark<T extends MarkProps> {
    readonly id: symbol;
    readonly type: string;
    readonly automatic: boolean;

    channels = $state<Set<ChannelName>>(new Set());
    props = $state<T>();

    constructor(type: string, channels: ChannelName[], automatic: boolean, props: T) {
        this.id = Symbol();
        this.type = type;
        this.automatic = automatic;
        this.channels = new Set(channels);
        this.props = props;
    }

    toString() {
        return `Mark[${this.type}]`;
    }
}

type BaseFooProps = { bar: number[] };
