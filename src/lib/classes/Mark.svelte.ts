import { CHANNEL_SCALE } from '$lib/contants.js';
import type { MarkProps, ScaledChannelName, ScaleName } from '$lib/types.js';
import { isEqual } from 'underscore';

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
    readonly channels: Set<ScaledChannelName> = new Set();

    props = $state.frozen<T>();

    readonly scales = $state.frozen<Set<ScaleName>>();

    constructor(type: string, channels: ScaledChannelName[], automatic: boolean, props: T) {
        this.id = Symbol();
        this.type = type;
        this.automatic = automatic;
        this.channels = new Set(channels);
        this.update(props);
    }

    update(props: T) {
        if (isEqual(props, this.props)) return;
        this.props = props;
        this.scales = new Set(
            Array.from(this.channels.values())
                .filter(
                    (channel) =>
                        this.props[channel] != null && !(typeof this.props[channel] === 'number')
                )
                .map((channel) => CHANNEL_SCALE[channel])
        );
    }

    toString() {
        return `Mark[${this.type}]`;
    }
}
