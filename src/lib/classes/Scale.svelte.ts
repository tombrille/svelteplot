import type {
    ChannelName,
    ColorScaleType,
    PositionScaleType,
    RawValue,
    ScaleName
} from '$lib/types.js';
import type { Plot } from './Plot.svelte.js';
import resolveChannel from '$lib/helpers/resolveChannel.js';
import { extent } from 'd3-array';
import { CHANNEL_SCALE } from '$lib/contants.js';
import {
    isDateOrNull,
    isNumberOrNull,
    isStringOrNull
} from '$lib/helpers/typeChecks.js';
import { uniq } from 'underscore';

const FUNCTION = '(function)';

export class Scale {
    readonly name: ScaleName | undefined = undefined;
    readonly plot: Plot | undefined = $state(undefined);

    constructor(name: ScaleName, plot: Plot) {
        this.name = name;
        this.plot = plot;
    }

    // readonly type: ScaleType = SCALE_TYPES.position;
    // all marks that have this channel
    readonly marks: Mark[] = $derived(this.plot?.marks ?? []);

    readonly scaleOptions = $derived(
        this.plot && this.name !== undefined ? this.plot.options[this.name] || {} : {}
    );

    readonly forceDomain: [number, number] | [Date, Date] | null = $derived(
        this.plot && (this.name === 'x' || this.name === 'y')
            ? this.scaleOptions?.domain || null
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

    readonly propNames: string[] = $derived(
        uniq(
            this.manualActiveMarks
                .map((mark) =>
                    this.possibleChannels
                        .filter(
                            (channel) =>
                                mark.channels.has(channel) &&
                                (typeof mark.props[channel] === 'string' ||
                                    typeof mark.props[channel] === 'function') &&
                                !String(mark.props[channel]).startsWith('__')
                        )
                        .map((channel) =>
                            typeof mark.props[channel] === 'string' ? mark.props[channel] : FUNCTION
                        )
                )
                .flat(2)
        )
    );

    readonly autoTitle = $derived(
        this.propNames.length === 1 && this.propNames[0] !== FUNCTION ? this.propNames[0] : null
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

    readonly isPosition = $derived(this.name === 'x' || this.name === 'y');
    readonly isColor = $derived(this.name === 'color');

    readonly scaleType = $derived(
        this.scaleOptions.type ||
            inferScaleType(this.dataValues, { isPosition: this.isPosition, isColor: this.isColor })
    );

    // readonly valueType = $derived(
    //     this.dataValues.every((v) => v == null)
    //         ? 'null'
    //         : this.dataValues.every(isColorOrNull)
    //           ? 'color'
    //           : this.dataValues.every(isBooleanOrNull)
    //             ? 'boolean'
    //             : this.dataValues.every(isStringOrNull)
    //               ? 'text'
    //               : this.dataValues.every(isNumberOrNull)
    //                 ? 'number'
    //                 : this.dataValues.every(isDateOrNull)
    //                   ? 'date'
    //                   : 'mixed'
    // );

    readonly domain = $derived(
        this.scaleOptions.domain || inferScaleDomain(this.dataValues, this.scaleType)
    );
}

// opacity: typeof === 'number' && between [0,1]

function inferScaleType(
    dataValues: RawValue[],
    { isPosition, isColor }: { isPosition: boolean; isColor: boolean }
): ColorScaleType | PositionScaleType {
    if (!dataValues.length) return 'linear';
    if (dataValues.every(isNumberOrNull)) return 'linear';
    if (dataValues.every(isDateOrNull)) return 'time';
    if (dataValues.every(isStringOrNull)) return 'band';
    return 'linear';
}

function inferScaleDomain(dataValues: RawValue[], scaleType: PositionScaleType | ColorScaleType) {
    if (scaleType === 'point' || scaleType === 'band') {
        return uniq(dataValues);
    }
    if (
        scaleType === 'linear' ||
        scaleType === 'pow' ||
        scaleType === 'log' ||
        scaleType === 'sqrt' ||
        scaleType === 'sequential' ||
        scaleType === 'time'
    ) {
        return extent(dataValues as number[]);
    }
}
