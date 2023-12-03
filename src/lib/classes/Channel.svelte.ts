import type { ChannelName, ChannelType, Mark } from '$lib/types';
import resolveChannel from '$lib/helpers/resolveChannel';
import { extent } from 'd3-array';
import { MARK_PROP_CHANNEL, CHANNEL_TYPES } from '$lib/contants';
import {
    isBooleanOrNull,
    isColorOrNull,
    isDateOrNull,
    isNumberOrNull,
    isStringOrNull
} from '$lib/helpers/typeChecks';
import { uniq } from 'underscore';

export class Channel {
    readonly name: ChannelName | undefined = undefined;

    constructor(name: ChannelName) {
        this.name = name;
        // this.type = CHANNEL_MAP[name];
    }

    // readonly type: ChannelType = CHANNEL_TYPES.position;
    // all marks that have this channel
    marks: Mark[] = $state([]);

    readonly activeMarks: Mark[] = $derived(
        this.marks.filter((mark) => mark.channels.has(this.name))
    );

    readonly possibleProps = $derived(
        Object.entries(MARK_PROP_CHANNEL)
            .filter(([, channel]) => channel === this.name)
            .map(([prop]) => prop)
    );

    readonly dataValues = $derived(
        this.activeMarks
            // only check marks with data
            .filter((mark) => mark.props.data.length)
            .map((mark) =>
                this.possibleProps.map((prop) =>
                    mark.props.data.map((row) => resolveChannel(this.name, row, mark.props[prop]))
                )
            )
            .flat(3)
            .filter((d) => d != null)
    );

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

    readonly nonNullDataValues = $derived(this.dataValues.length ? this.dataValues : [0]);

    readonly domain = $derived(
        this.valueType === 'boolean' || this.valueType === 'text' || this.valueType === 'color'
            ? uniq(this.nonNullDataValues)
            : extent(this.nonNullDataValues as ('date' | 'number')[])
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
