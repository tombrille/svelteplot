import type { ChannelName, ScaleName } from '$lib/types.js';
import type { Plot } from './Plot.svelte.js';
import resolveChannel from '$lib/helpers/resolveChannel.js';
import { extent } from 'd3-array';
import { CHANNEL_SCALE } from '$lib/contants.js';
import {
    isBooleanOrNull,
    isColorOrNull,
    isDateOrNull,
    isNumberOrNull,
    isStringOrNull
} from '$lib/helpers/typeChecks.js';
import { uniq } from 'underscore';

export class Scale {
    readonly name: ScaleName | undefined = undefined;
    readonly plot: Plot | undefined = undefined;

    constructor(name: ScaleName, plot: Plot) {
        this.name = name;
        this.plot = plot;
    }

    // readonly type: ScaleType = SCALE_TYPES.position;
    // all marks that have this channel
    readonly marks: Mark[] = $derived(this.plot?.marks ?? []);

    readonly forceDomain: [number, number] | [Date, Date] | null = $derived(
        this.plot && (this.name === 'x' || this.name === 'y')
            ? this.plot.options[this.name]?.domain || null
            : null
    );

    readonly possibleChannels = $derived(
        Object.entries(CHANNEL_SCALE)
            .filter(([, channel]) => channel === this.name)
            .map(([prop]) => prop as ChannelName)
    );

    readonly activeMarks: Mark[] = $derived(
        this.marks.filter((mark) =>
            this.possibleChannels.find(
                (channel) => mark.channels.has(channel) && mark.props[channel] !== undefined
            )
        )
    );
    readonly manualActiveMarks: Mark[] = $derived(
        this.activeMarks.filter((mark) => !mark.automatic)
    );
    readonly autoTitle = $derived(
        this.manualActiveMarks.length === 1 &&
            typeof this.manualActiveMarks[0].props?.[this.name as 'x' | 'y'] === 'string'
            ? this.manualActiveMarks[0].props?.[this.name as 'x' | 'y']
            : null
    );

    readonly uniqueMarkProps = $derived(
        uniq(
            this.manualActiveMarks
                .map((mark) =>
                    this.possibleChannels
                        .filter((prop) => mark.props[prop] !== undefined)
                        .map((prop) => mark.props[prop])
                )
                .flat(2)
        )
    );

    readonly dataValues = $derived([
        ...this.activeMarks
            // only check marks with data
            .filter((mark) => mark.props.data.length)
            .map((mark) =>
                this.possibleChannels.map((prop) =>
                    mark.props.data.map((row) => resolveChannel(prop, row, mark.props))
                )
            )
            .flat(3)
            .filter((d) => d != null),
        ...(this.forceDomain || [])
    ]);

    readonly valueType = $derived(
        this.dataValues.every((v) => v == null)
            ? 'null'
            : this.dataValues.every(isColorOrNull)
              ? 'color'
              : this.dataValues.every(isBooleanOrNull)
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
        !this.dataValues.length
            ? [0, 1]
            : this.valueType === 'boolean' ||
                this.valueType === 'text' ||
                this.valueType === 'color'
              ? uniq(this.dataValues)
              : extent(this.dataValues as ('date' | 'number')[])
    ) as [number, number] | [Date, Date] | string[];

    readonly scaleType: string = $derived(
        this.name === 'radius'
            ? 'sqrt'
            : this.valueType === 'date'
              ? 'time'
              : this.valueType === 'number'
                ? 'linear'
                : this.valueType === 'text' || this.valueType === 'boolean'
                  ? 'band'
                  : this.valueType === 'color'
                    ? 'identity'
                    : 'linear'
    );

    // if this.type === 'color' && this.valueType !== 'color' we need to map
    // the input values to either a quantitative or qualitative color scale
}

// opacity: typeof === 'number' && between [0,1]
