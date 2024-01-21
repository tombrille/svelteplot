import { CHANNEL_SCALE } from '$lib/contants.js';
import type { MarkProps, ChannelName } from '$lib/types.js';

export function test(initial: number) {
    let num = $state(initial);
    const double = $derived(num * 2);

    return {
        get value() {
            return num;
        },
        get double() {
            return double;
        },
        addOne() {
            $effect.root(() => {
                num += 1;
            });
        }
    };
}

export class Mark<T extends MarkProps> {
    readonly id: symbol;
    readonly type: string;
    readonly automatic: boolean;

    channels = $state<Set<ChannelName>>(new Set());

    props = $state<T>();

    readonly scales = $derived(
        new Set(
            Array.from(this.channels.values())
                .filter(
                    (channel) =>
                        this.props[channel] != null && !(typeof this.props[channel] === 'number')
                )
                .map((channel) => CHANNEL_SCALE[channel])
        )
    );

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
