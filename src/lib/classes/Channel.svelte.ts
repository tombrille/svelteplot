import type { ChannelName } from '$lib/types';
import type { Plot } from './Plot.svelte';
import resolveChannel from '$lib/helpers/resolveChannel.js';
import { extent } from 'd3-array';
import { MARK_PROP_CHANNEL, CHANNEL_TYPES } from '$lib/contants';
import {
    isBooleanOrNull,
    isColorOrNull,
    isDateOrNull,
    isNumberOrNull,
    isStringOrNull
} from '$lib/helpers/typeChecks.js';
import { uniq } from 'underscore';

export class Channel {
    readonly name: ChannelName | undefined = undefined;
    readonly plot: Plot | undefined = undefined;

    constructor(name: ChannelName, plot: Plot) {
        this.name = name;
        this.plot = plot;
    }

    // readonly type: ChannelType = CHANNEL_TYPES.position;
    // all marks that have this channel
    readonly marks: Mark[] = $derived(this.plot?.marks ?? []);

    readonly forceDomain: [number, number] | [Date, Date] | null = $derived(
        this.plot && (this.name === 'x' || this.name === 'y')
            ? this.plot.options[this.name]?.domain || null
            : null
    );

    readonly possibleProps = $derived(
        Object.entries(MARK_PROP_CHANNEL)
            .filter(([, channel]) => channel === this.name)
            .map(([prop]) => prop)
    );

    readonly activeMarks: Mark[] = $derived(
        this.marks.filter(
            (mark) =>
                mark.channels.has(this.name) && this.possibleProps.find((prop) => mark.props[prop])
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
                    this.possibleProps
                        .filter((prop) => mark.props[prop])
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
                this.possibleProps.map((prop) =>
                    mark.props.data.map((row) => resolveChannel(this.name, row, mark.props[prop]))
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
                : this.valueType === 'text'
                  ? 'band'
                  : 'linear'
    );

    // if this.type === 'color' && this.valueType !== 'color' we need to map
    // the input values to either a quantitative or qualitative color scale
}

// opacity: typeof === 'number' && between [0,1]
