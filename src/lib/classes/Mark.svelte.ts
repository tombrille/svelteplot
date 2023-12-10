import { CHANNEL_SCALE } from '$lib/contants.js';
import type { MarkProps, ChannelName } from '$lib/types.js';

export class Mark<T extends MarkProps> {
    readonly id: symbol;
    readonly type: string;
    readonly automatic: boolean;

    channels = $state<Set<ChannelName>>(new Set());

    readonly scales = $derived(
        new Set(Array.from(this.channels.values()).map((channel) => CHANNEL_SCALE[channel]))
    );

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
