import type { ScaleBand, ScaleLinear, ScaleOrdinal } from 'd3-scale';
import type { Snippet } from 'svelte';
import type { MouseEventHandler } from 'svelte/elements';
import type { MarkerShape } from './marks/helpers/Marker.svelte';
import type { Writable } from 'svelte/store';

export type MarkType =
    | 'area'
    | 'arrow'
    | 'axisX'
    | 'axisY'
    | 'barX'
    | 'barY'
    | 'cell'
    | 'dot'
    | 'vector'
    | 'frame'
    | 'geo'
    | 'gridX'
    | 'gridY'
    | 'line'
    | 'rect'
    | 'regression'
    | 'ruleX'
    | 'ruleY'
    | 'swoopyArrow'
    | 'text'
    | 'tickX'
    | 'tickY';

export type ScaleName =
    | 'x'
    | 'y'
    | 'r'
    | 'color'
    | 'opacity'
    | 'length'
    | 'symbol'
    | 'fx'
    | 'fy'
    | 'fz'
    | 'projection';

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
    | 'quantile-cont'
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
    | 'fz'
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
    /**
     * fallback color used for null/undefined
     */
    unknown: string;
    /**
     * center value for diverging scales
     */
    pivot: number;
    /**
     * number of colors for quantize and quantile-threshold scales
     */
    n: number;
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
    /**
     * rotate the axis ticks
     */
    tickRotate: number;

    labelAnchor: 'auto' | 'left' | 'center' | 'right';

    tickFormat: 'auto' | string | ((d: RawValue) => string);
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
    /**
     * rotate the axis ticks
     */
    tickRotate: number;

    labelAnchor: 'auto' | 'bottom' | 'middle' | 'top';
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
    height: 'auto' | number | ((d: number) => number);
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
    fz: Partial<ScaleOptions> & {
        /**
         * the number of columns to wrap the facets
         */
        columns: number;
    };
    children: Snippet<
        [{ width: number; height: number; options: PlotOptions; scales: PlotScales }]
    >;
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

export type PlotDefaults = {
    axisXAnchor: AxisXAnchor;
    axisYAnchor: AxisYAnchor;
    xTickSpacing: number;
    yTickSpacing: number;
    height: number;
    inset: number;
    colorScheme: ColorScheme | string[];
    categoricalColorScheme: ColorScheme | string[];
    dotRadius: number;
    /**
     * for computing the automatic height based on the number of
     * domain items in a point scale
     */
    pointScaleHeight: number;
    /**
     * for computing the automatic height based on the number of
     * domain items in a band scale
     */
    bandScaleHeight: number;
    /**
     * add frame to plots by default
     */
    frame: boolean;
    grid: boolean;
};

export type GenericMarkOptions = Record<string, any>;

export type DataRecord = Record<string, RawValue> & {
    ___orig___?: RawValue | [RawValue, RawValue];
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

export type MarkerOptions = {
    /**
     * the marker for the starting point of a line segment
     */
    markerStart?: boolean | MarkerShape | Snippet;
    /**
     * the marker for any intermediate point of a line segment
     */
    markerMid?: boolean | MarkerShape | Snippet;
    /**
     * the marker for the end point of a line segment
     */
    markerEnd?: boolean | MarkerShape | Snippet;
    /**
     * shorthand for setting the marker on all points
     */
    marker?: boolean | MarkerShape | Snippet;
};

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
    /**
     * Registers a mark with the Plot component along with its
     * data and the channel mappings.
     */
    addMark: (mark: Mark<GenericMarkOptions>) => void;
    /**
     * Updates a mark after either the data or the channel mappings
     * have been updated.
     */
    updateMark: (mark: Mark<GenericMarkOptions>) => void;
    /**
     * Unregister a mark from the Plot component after the mark
     * component has been destroyed.
     */
    removeMark: (mark: Mark<GenericMarkOptions>) => void;
    getPlotState: () => PlotState;
    getTopLevelFacet: () => PlotOptions['facet'];
    /**
     * Updates the plots internal facetWidth and facetHeight dimensions
     * which are used as range for the positional scales x and y.
     */
    updateDimensions: (width: number, height: number) => void;
};

type FacetState = {
    fx: RawValue;
    fy: RawValue;
    /**
     * True, if the facet is the leftmost in its row
     */
    left: boolean;
    /**
     * True, if the facet is the topmost in its column
     */
    top: boolean;
    /**
     * True, if the facet is the rightmost in its row
     */
    right: boolean;
    /**
     * True, if the facet is the bottommost in its column
     */
    bottom: boolean;
    /**
     * True, if the adjacent facet to the top is empty
     */
    topEmpty: boolean;
    /**
     * True, if the adjacent facet to the bottom is empty
     */
    bottomEmpty: boolean;
    /**
     * True, if the adjacent facet to the left is empty
     */
    leftEmpty: boolean;
    /**
     * True, if the adjacent facet to the right is empty
     */
    rightEmpty: boolean;
};

/**
 * Test if the given data record is visible in the current facet.
 */
type TestFacetFunction = (
    datum: DataRecord,
    channels: Record<ChannelName, ChannelAccessor>
) => boolean;

export type FacetContext = {
    /**
     * Returns a stateful function that tests whether a specific data
     * record is visible in the current facet or not.
     */
    getTestFacet: () => TestFacetFunction;
    getFacetState: () => FacetState;
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
    clipPath: string;
    imageFilter: ConstantAccessor<string>;
    shapeRendering: ConstantAccessor<
        'crispEdges' | 'geometricPrecision' | 'optimizeSpeed' | 'auto'
    >;
    paintOrder: ConstantAccessor<string>;
    onclick?: MouseEventHandler<SVGPathElement>;
    onmouseup?: MouseEventHandler<SVGPathElement>;
    onmousedown?: MouseEventHandler<SVGPathElement>;
    onmouseenter?: MouseEventHandler<SVGPathElement>;
    onmousemove?: MouseEventHandler<SVGPathElement>;
    onmouseleave?: MouseEventHandler<SVGPathElement>;
    ondragstart?: MouseEventHandler<SVGPathElement>;
    ondragend?: MouseEventHandler<SVGPathElement>;
    ontouchstart?: MouseEventHandler<SVGPathElement>;
    ontouchmove?: MouseEventHandler<SVGPathElement>;
    ontouchend?: MouseEventHandler<SVGPathElement>;
    /**
     * simple browser tooltip to be displayed on mouseover
     */
    title: ConstantAccessor<string>;
    /**
     * if set, the mark element will be wrapped in a <a> link
     * element
     */
    href: ConstantAccessor<string>;
    target: ConstantAccessor<'_self' | '_blank' | string>;
}>;

export type BaseRectMarkProps = {
    rx?: ConstantAccessor<number>;
    ry?: ConstantAccessor<number>;
    inset?: ConstantAccessor<number>;
    insetLeft?: ConstantAccessor<number>;
    insetTop?: ConstantAccessor<number>;
    insetRight?: ConstantAccessor<number>;
    insetBottom?: ConstantAccessor<number>;
};

export type Channels = Record<
    string,
    ChannelAccessor | ConstantAccessor<string | number | boolean>
>;

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
    | 'grays'
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
    | 'strokeLinejoin'
    | 'strokeLinecap'
    | 'opacity'
    | 'cursor'
    | 'pointerEvents'
    | 'blend'
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
    | 'clipPath'
    | 'mask'
    | 'filter'
    | 'angle'
    | 'radius'
    | 'symbol'
    | 'textAnchor'
    | 'width';

export type AutoMarginStores = {
    autoMarginTop: Writable<Map<string, number>>;
    autoMarginLeft: Writable<Map<string, number>>;
    autoMarginRight: Writable<Map<string, number>>;
    autoMarginBottom: Writable<Map<string, number>>;
};

/**
 * these are the default options for the plot marks that can be set using
 * the 'svelteplot/defaults' context.
 */
export type DefaultOptions = {
    /**
     * default plot height
     */
    height: number;
    /**
     * default plot inset
     */
    inset: number;
    /**
     * default tick line length
     */
    tickSize: number;
    /**
     * default padding between tick line and tick label
     */
    tickPadding: number;
    /**
     * default font size for tick labels
     */
    tickFontSize: number;
    /**
     * default anchor for x axis
     */
    axisXAnchor: 'bottom' | 'top';
    /**
     * default anchor for y axis
     */
    axisYAnchor: 'left' | 'right';
    /**
     * default spacing between ticks in AxisX and GridX
     */
    xTickSpacing: number;
    /**
     * default spacing between ticks in AxisY and GridY
     */
    yTickSpacing: number;
    /**
     * default color scheme
     */
    colorScheme: ColorScheme;
    /**
     * default step for graticule, in degrees
     */
    graticuleStep: number;
};
