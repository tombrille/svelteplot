/**
 * @license
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2024  Gregor Aisch
 */
import type { ScaleBand, ScaleLinear, ScaleOrdinal } from 'd3-scale';
import type { Snippet } from 'svelte';
import type { MouseEventHandler } from 'svelte/elements';

export type MarkType =
    | 'area'
    | 'arrow'
    | 'axisX'
    | 'axisY'
    | 'barX'
    | 'barY'
    | 'cell'
    | 'dot'
    | 'frame'
    | 'gridX'
    | 'gridY'
    | 'line'
    | 'rect'
    | 'regression'
    | 'ruleX'
    | 'ruleY'
    | 'tickX'
    | 'tickY';

export type ScaleName = 'x' | 'y' | 'r' | 'color' | 'opacity' | 'length' | 'symbol' | 'fx' | 'fy';

export type ScaleType =
    | 'linear'
    | 'pow'
    | 'sqrt'
    | 'log'
    | 'symlog'
    | 'time'
    | 'point'
    | 'ordinal'
    | 'sequential'
    | 'band'
    | 'categorical'
    | 'cyclical'
    | 'threshold'
    | 'quantile'
    | 'quantize'
    | 'diverging'
    | 'diverging-log'
    | 'diverging-pow'
    | 'diverging-sqrt'
    | 'diverging-symlog';

export type Mark<T> = {
    id: symbol;
    type: MarkType;
    channels: ScaledChannelName[];
    scales: Set<ScaleName>;
    data: DataRecord[];
    options: T;
};

export type ScaledChannelName =
    | 'fill'
    | 'fillOpacity'
    | 'opacity'
    | 'r'
    | 'length'
    | 'stroke'
    | 'strokeOpacity'
    | 'symbol'
    | 'fx'
    | 'fy'
    | 'x'
    | 'x1'
    | 'x2'
    | 'y'
    | 'y1'
    | 'y2';

export type ChannelName = ScaledChannelName | 'z' | 'sort' | 'filter' | 'interval';

export type RawValue = number | Date | boolean | string;

export type ScaleOptions = {
    /**
     * Override the automatic scale type detection.
     */
    type: ScaleType | 'auto';
    /**
     * Set a custom domain for the scale instead of auto-computing the domain
     * from the mark data channels.
     */
    domain?: RawValue[];
    /**
     * Set a custom range for the scale.
     */
    range?: RawValue[];
    /**
     * Reverse the scale.
     */
    reverse: boolean;
    label?: string;
    interval?: string | number;
    // quantitative scales
    clamp: boolean;
    nice: boolean;
    zero: boolean;
    round: boolean;
    percent: boolean;
    transform?: (d: RawValue) => RawValue;
    // point & band scales
    /**
     * set the padding for band scales
     */
    padding: number;
    /**
     * set the align for band or point scales
     */
    align: number;
    // band scales
    /**
     * set the inner padding for band scales
     */
    paddingInner?: number;
    /**
     * set the outer padding for band scales
     */
    paddingOuter?: number;
    // position scales
    insetLeft?: number;
    insetRight?: number;
    insetTop?: number;
    insetBottom?: number;
    ticks?: (number | Date)[];
    tickSpacing: number;
    // log scales
    base?: number;
    // sorting for band and point scales
    sort?:
        | ChannelAccessor
        | ((a: RawValue, b: RawValue) => number)
        | {
              channel: string;
              order: 'ascending' | 'descending';
          };
};

export type ColorScaleOptions = ScaleOptions & {
    legend: boolean;
    type:
        | ScaleType
        | 'categorical'
        | 'sequential'
        | 'cyclical'
        | 'threshold'
        | 'quantile'
        | 'quantize'
        | 'diverging'
        | 'diverging-log'
        | 'diverging-pow'
        | 'diverging-sqrt'
        | 'diverging-symlog';
    scheme: string;
    interpolate: (d: any) => typeof d;
};

export type AxisXAnchor = 'bottom' | 'top' | 'both';
export type AxisYAnchor = 'left' | 'right' | 'both';

export type XScaleOptions = ScaleOptions & {
    /**
     * Activate the implicit GridX mark. For more control over the grid styling
     * and layering, add an explicit GridX mark to your plot instead of using the
     * implicit grids.
     */
    grid: boolean;
    /**
     * Controls the position of the implicit AxisX mark, or set to false to disable
     * the implicit AxisX mark. For more control over the axis styling and layering
     * add an explicit AxisX mark to your plot instead of using the implicit axes.
     */
    axis: AxisXAnchor | false;
};

export type YScaleOptions = ScaleOptions & {
    /**
     * Activate the implicit GridY mark. For more control over the grid styling
     * and layering, add an explicit GridY mark to your plot instead of using the
     * implicit grids.
     */
    grid: boolean;
    /**
     * Controls the position of the implicit AxisY mark, or set to false to disable
     * the implicit AxisY mark. For more control over the axis styling and layering
     * add an explicit AxisY mark to your plot instead of using the implicit axes.
     */
    axis: AxisYAnchor | false;
    tickFormat: string | ((d: RawValue) => string);
};

export type LegendScaleOptions = ScaleOptions & {
    legend: boolean;
};

export type PlotOptions = {
    /**
     * The plot title, rendered as H2 tag above the SVG element. Instead of
     * using the title, you can also pass a "header" snippet and render your
     * own custom title markup.
     */
    title: string;
    /**
     * The plot subtitle, rendered as H3 tag above the SVG element. Instead of
     * using the subtitle, you can also pass a "header" snippet and render your
     * own custom title markup.
     */
    subtitle: string;
    /**
     * The plot caption, rendered as FIGCAPTION tag below the SVG element. Instead of
     * using the caption, you can also pass a "footer" snippet and render your
     * own custom title markup.
     */
    caption: string;
    /**
     * By default, the plot will extend to fit 100% of the parent container width. By
     * setting the maxWidth style property you can limit the width of your plot.
     */
    maxWidth?: string;
    height: 'auto' | number;
    /**
     * Convenience option for setting all four margins at once, in px.
     */
    margin: number;
    /**
     * Left margin of the plot, in px.
     */
    marginLeft: number;
    /**
     * Right margin of the plot, in px.
     */
    marginRight: number;
    /**
     * Top margin of the plot, in px.
     */
    marginTop: number;
    /**
     * Bottom margin of the plot, in px.
     */
    marginBottom: number;
    /**
     * Activates the implicit GridX and GridY marks.
     */
    grid: boolean;
    /**
     * Activates the implicit frame marks
     */
    frame: boolean;
    /**
     * Convenience shortcut for setting both the x and y scale insets.
     */
    inset: number;
    /**
     * Convenience shortcut for setting both the x and y scale paddings
     */
    padding: number;
    /**
     * Geo-projection
     */
    projection: string | null;
    /**
     * if not null, computes a default height such that a variation of one
     * unit in the x dimension is represented by the corresponding number
     * of pixels as a variation in the y dimension of one unit.
     */
    aspectRatio: number | null;
    /**
     * Top-level faceting options
     */
    facet: Partial<{
        /**
         * The data to facet by. Turns on automatic faceting for all marks that
         * use the exact same data (===)
         */
        data: DataRecord[];
        x: ChannelAccessor;
        y: ChannelAccessor;
    }>;
    /**
     * Options for the shared x scale.
     */
    x: Partial<XScaleOptions>;
    y: Partial<YScaleOptions>;
    r: ScaleOptions;
    color: ColorScaleOptions;
    opacity: ScaleOptions;
    symbol: LegendScaleOptions;
    length: ScaleOptions;
    fx: Partial<ScaleOptions>;
    fy: Partial<ScaleOptions>;
    children: Snippet;
    /**
     * You can use the header snippet to render a custom title and subtitle for
     * your plot, or place a legend above the visualization.
     */
    header: Snippet;
    footer: Snippet;
    /**
     * The underlay snippet is useful for adding a layer of custom HTML markup
     * behind the SVG body of your plot, e.g. for a watermark or background image.
     */
    underlay: Snippet<[PlotOptions]>;
    /**
     * The overlay snippet is useful for adding a layer of custom HTML markup
     * in front of the SVG body of your plot, e.g. for HTML tooltips.
     */
    overlay: Snippet;
    /**
     * if you set testid, the plot container will get a data-testid attribute which
     * can be useful for automatic testing
     */
    testid: string;
};

export type GenericMarkOptions = Record<string, any>;

export type DataRecord = Record<string, RawValue> & {
    ___orig___?: RawValue | [RawValue, RawValue];
    ___cache___?: Map<symbol, RawValue>;
};

export type DataRow = DataRecord | RawValue | [number, number] | null;

export type PlotScale = {
    type: ScaleType;
    domain: RawValue[];
    range: RawValue[];
    autoTitle?: string;
    /**
     * The number of marks that are using this scale.
     */
    manualActiveMarks: number;
    /**
     * Set of accessors used in channels that are bound to this scale.
     */
    uniqueScaleProps: Set<ChannelAccessor>;
    skip: Map<ScaledChannelName, Set<symbol>>;
    fn: ScaleLinear<RawValue, number> &
        ScaleBand<RawValue> &
        ScaleOrdinal<string | Date, number> &
        ScaleOrdinal<string | Date, string>;
};

export type CurveName =
    | 'basis'
    | 'basis-closed'
    | 'basis-open'
    | 'bundle'
    | 'bump-x'
    | 'bump-y'
    | 'cardinal'
    | 'cardinal-closed'
    | 'cardinal-open'
    | 'catmull-rom'
    | 'catmull-rom-closed'
    | 'catmull-rom-open'
    | 'linear'
    | 'linear-closed'
    | 'monotone-x'
    | 'monotone-y'
    | 'natural'
    | 'step'
    | 'step-after'
    | 'step-before';

export type PlotScales = Record<ScaleName, PlotScale>;

export type ChannelAccessor = RawValue | ((d: DataRow) => RawValue) | null | undefined;

export type ConstantAccessor<T> = T | ((d: DataRow) => T) | null | undefined;

export type PlotState = {
    width: number;
    height: number;
    options: PlotOptions;
    facetWidth: number;
    facetHeight: number;
    plotWidth: number;
    plotHeight: number;
    scales: PlotScales;
    body: HTMLDivElement;
    /**
     * True if there's a color scale and a symbol scale and both are bound to the same
     * single channel accessor.
     */
    colorSymbolRedundant: boolean;
    /**
     * True if the plot is using filled dot marks.
     */
    hasFilledDotMarks: boolean;
};

export type PlotContext = {
    addMark: (mark: Mark<GenericMarkOptions>) => void;
    updateMark: (mark: Mark<GenericMarkOptions>) => void;
    removeMark: (mark: Mark<GenericMarkOptions>) => void;
    getPlotState: () => PlotState;
    getTopLevelFacet: () => PlotOptions['facet'];
};

export type BaseMarkProps = Partial<{
    /**
     * Filter the data without modifying the inferred scales
     */
    filter?: ConstantAccessor<boolean>;
    facet?: 'auto' | 'include' | 'exclude';
    fx: ChannelAccessor;
    fy: ChannelAccessor;
    dx: ConstantAccessor<number>;
    dy: ConstantAccessor<number>;
    fill: ConstantAccessor<string>;
    fillOpacity: ConstantAccessor<number>;
    stroke: ConstantAccessor<string>;
    strokeWidth: ConstantAccessor<number>;
    strokeOpacity: ConstantAccessor<number>;
    strokeLinejoin: ConstantAccessor<'bevel' | 'miter' | 'miter-clip' | 'round'>;
    strokeLinecap: ConstantAccessor<'butt' | 'square' | 'round'>;
    strokeMiterlimit: ConstantAccessor<number>;
    opacity: ConstantAccessor<number>;
    strokeDasharray: ConstantAccessor<string>;
    strokeDashoffset: ConstantAccessor<number>;
    mixBlendMode: ConstantAccessor<
        | 'normal'
        | 'multiply'
        | 'screen'
        | 'overlay'
        | 'darken'
        | 'lighten'
        | 'color-dodge'
        | 'color-burn'
        | 'hard-light'
        | 'soft-light'
        | 'difference'
        | 'exclusion'
        | 'hue'
        | 'saturation'
        | 'color'
        | 'luminosity'
        | 'plus-darker'
        | 'plus-lighter'
    >;
    imageFilter: ConstantAccessor<string>;
    shapeRendering: ConstantAccessor<
        'crispEdges' | 'geometricPrecision' | 'optimizeSpeed' | 'auto'
    >;
    paintOrder: ConstantAccessor<string>;
    onclick?: MouseEventHandler<SVGPathElement>;
    onmouseenter?: MouseEventHandler<SVGPathElement>;
    onmouseleave?: MouseEventHandler<SVGPathElement>;
}>;

export type RectMarkProps = {
    rx?: ConstantAccessor<number>;
    ry?: ConstantAccessor<number>;
    inset?: ConstantAccessor<number>;
    insetLeft?: ConstantAccessor<number>;
    insetTop?: ConstantAccessor<number>;
    insetRight?: ConstantAccessor<number>;
    insetBottom?: ConstantAccessor<number>;
};

export type Channels = {
    [K in ChannelName]: ChannelAccessor | ConstantAccessor<string | number | boolean>;
};

export type TransformArg<K> = Channels & { data: K[] };

export type TransformArgsRow = Partial<Channels> & { data: DataRow[] };
export type TransformArgsRecord = Partial<Channels> & { data: DataRecord[] };

export type ColorScheme =
    | 'brbg'
    | 'prgn'
    | 'piyg'
    | 'puor'
    | 'rdbu'
    | 'rdgy'
    | 'rdylbu'
    | 'rdylgn'
    | 'spectral'
    | 'burd'
    | 'buylrd'
    | 'blues'
    | 'greens'
    | 'greys'
    | 'oranges'
    | 'purples'
    | 'reds'
    | 'turbo'
    | 'viridis'
    | 'magma'
    | 'inferno'
    | 'plasma'
    | 'cividis'
    | 'cubehelix'
    | 'warm'
    | 'cool'
    | 'bugn'
    | 'bupu'
    | 'gnbu'
    | 'orrd'
    | 'pubu'
    | 'pubugn'
    | 'purd'
    | 'rdpu'
    | 'ylgn'
    | 'ylgnbu'
    | 'ylorbr'
    | 'ylorrd'
    | 'rainbow'
    | 'sinebow'
    | 'accent'
    | 'category10'
    | 'dark2'
    | 'paired'
    | 'pastel1'
    | 'pastel2'
    | 'set1'
    | 'set2'
    | 'set3'
    | 'tableau10'
    | 'observable10';

// list of all prossible style props on marks
export type MarkStyleProps =
    | 'strokeDasharray'
    | 'opacity'
    | 'cursor'
    | 'fill'
    | 'fillOpacity'
    | 'fontWeight'
    | 'fontSize'
    | 'fontStyle'
    | 'stroke'
    | 'strokeWidth'
    | 'strokeOpacity'
    | 'x'
    | 'y'
    | 'angle'
    | 'radius'
    | 'symbol'
    | 'textAnchor'
    | 'width';
