import type { ScaleBand, ScaleLinear, ScaleOrdinal } from 'd3-scale';
import type { Snippet } from 'svelte';
import type { MouseEventHandler } from 'svelte/elements';
import type { MarkerShape } from './marks/helpers/Marker.svelte';
import type { Writable } from 'svelte/store';
import type * as CSS from 'csstype';
import type { AreaMarkProps } from './marks/Area.svelte';
import type { ArrowMarkProps } from './marks/Arrow.svelte';
import type { AxisXMarkProps } from './marks/AxisX.svelte';
import type { AxisYMarkProps } from './marks/AxisY.svelte';
import type { BarXMarkProps } from './marks/BarX.svelte';
import type { CellMarkProps } from './marks/Cell.svelte';
import type { DotMarkProps } from './marks/Dot.svelte';
import type { FrameMarkProps } from './marks/Frame.svelte';
import type { GeoMarkProps } from './marks/Geo.svelte';
import type { GraticuleMarkProps } from './marks/Graticule.svelte';
import type { LineMarkProps } from './marks/Line.svelte';
import type { LinkMarkProps } from './marks/Link.svelte';
import type { RectMarkProps } from './marks/Rect.svelte';
import type { RuleXMarkProps } from './marks/RuleX.svelte';
import type { SphereMarkProps } from './marks/Sphere.svelte';
import type { SpikeMarkProps } from './marks/Spike.svelte';
import type { TextMarkProps } from './marks/Text.svelte';
import type { TickXMarkProps } from './marks/TickX.svelte';
import type { VectorMarkProps } from './marks/Vector.svelte';
import type { BrushMarkProps } from './marks/Brush.svelte';
import type { BrushXMarkProps } from './marks/BrushX.svelte';
import type { BrushYMarkProps } from './marks/BrushY.svelte';
import type { RectXMarkProps } from './marks/RectX.svelte';
import type { RectYMarkProps } from './marks/RectY.svelte';
import type { RuleYMarkProps } from './marks/RuleY.svelte';
import type { TickYMarkProps } from './marks/TickY.svelte';

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
    | 'x'
    | 'x1'
    | 'x2'
    | 'y'
    | 'y1'
    | 'y2';

export type ChannelName = ScaledChannelName | 'z' | 'sort' | 'filter' | 'interval';

export type RawValue = number | Date | boolean | string | symbol;

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
    // symlog scales
    constant?: number;
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
    /**
     * force the plot into a fixed width
     */
    width?: number;
    /**
     * force the plot into a fixed height
     */
    height: 'auto' | number | ((d: number) => number);
    /**
     * Convenience option for setting all four margins at once, in px.
     */
    margin: number | { top?: number; right?: number; bottom?: number; left?: number };
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
     * Activates the implicit AxisX and AxisY marks.
     */
    axes: boolean;
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
    /**
     * Options for the shared y scale
     */
    y: Partial<YScaleOptions>;
    /**
     * Options for the shared radius scale
     */
    r: Partial<ScaleOptions>;
    color: Partial<ColorScaleOptions>;
    opacity: Partial<ScaleOptions>;
    symbol: Partial<LegendScaleOptions>;
    length: Partial<ScaleOptions>;
    fx: Partial<ScaleOptions>;
    fy: Partial<ScaleOptions>;
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
    facetAxes: Snippet;
    /**
     * if you set testid, the plot container will get a data-testid attribute which
     * can be useful for automatic testing
     */
    testid: string;
    /**
     * in case you want to give your Plot element an extra CSS class
     */
    class: string | null;
    /**
     * if set to true, the plot will use the implicit scales
     */
    implicitScales: boolean;
    /**
     * locale used for automatic axis ticks
     */
    locale: string;
    /**
     * pass a @emotion/css function to style plot using dynamic classes
     */
    css: (d: string) => string | undefined;
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
    axes: boolean;
    /**
     * initial width of the plot before measuring the actual width
     */
    initialWidth: number;
    /**
     * locale, used for automatic axis ticks
     */
    locale: string;
    /**
     * default number format for axis ticks
     */
    numberFormat: Intl.NumberFormatOptions;
    markerDotRadius: number;
    /**
     * fallback color to be used for null/NA
     */
    unknown: string;
    css: (d: string) => string | undefined;
};

export type GenericMarkOptions = Record<string | symbol, any>;

export type DataRecord = Record<string | symbol, RawValue> & {
    ___orig___?: RawValue | [RawValue, RawValue];
};

export type ResolvedDataRecord = Partial<Record<ScaledChannelName, any>> & {
    datum: DataRecord;
};

export type ScaledDataRecord = Partial<
    Record<ScaledChannelName, number | string | boolean | undefined>
> & {
    datum: DataRecord;
    valid: Boolean;
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
    css: ((d: string) => string) | null;
};

export type PlotContext = {
    /**
     * Registers a mark with the Plot component along with its
     * data and the channel mappings.
     */
    addMark: (mark: Mark<GenericMarkOptions>) => Mark<GenericMarkOptions>;
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

export type LinkableMarkProps = {
    /**
     * if set, the mark element will be wrapped in a <a> link element
     */
    href: ConstantAccessor<string>;
    /**
     * the relationship of the target object to the link object (e.g. "noopener")
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#rel
     */
    rel: ConstantAccessor<string>;
    /**
     * the link target mime type, e.g. "text/csv"
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#type
     */
    type: ConstantAccessor<string>;
    /**
     * the target of the link, e.g. "_blank" or "_self"
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#target
     */
    target: ConstantAccessor<'_self' | '_blank' | '_parent' | '_top' | string>;
    /**
     * if set to true, the link will be downloaded instead of navigating to it
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download
     */
    download: ConstantAccessor<boolean>;
    // allow data-sveltekit-* attributes on the link element, e.g. data-sveltekit-reload
    [key: `data-sveltekit-${string}`]: string | boolean;
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
    sort:
        | string
        | ConstantAccessor<RawValue>
        | ((a: RawValue, b: RawValue) => number)
        | {
              /** sort data using an already defined channel */
              channel: string;
              /** sort order */
              order?: 'ascending' | 'descending';
          };
    stroke: ConstantAccessor<string>;
    strokeWidth: ConstantAccessor<number>;
    strokeOpacity: ConstantAccessor<number>;
    strokeLinejoin: ConstantAccessor<CSS.Property.StrokeLinejoin>;
    strokeLinecap: ConstantAccessor<CSS.Property.StrokeLinecap>;
    strokeMiterlimit: ConstantAccessor<number>;
    opacity: ConstantAccessor<number>;
    strokeDasharray: ConstantAccessor<string>;
    strokeDashoffset: ConstantAccessor<number>;
    mixBlendMode: ConstantAccessor<CSS.Property.MixBlendMode>;
    clipPath: string;
    imageFilter: ConstantAccessor<string>;
    shapeRendering: ConstantAccessor<CSS.Property.ShapeRendering>;
    paintOrder: ConstantAccessor<string>;
    onclick?: MouseEventHandler<SVGPathElement>;
    ondblclick?: MouseEventHandler<SVGPathElement>;
    onmouseup?: MouseEventHandler<SVGPathElement>;
    onmousedown?: MouseEventHandler<SVGPathElement>;
    onmouseenter?: MouseEventHandler<SVGPathElement>;
    onmousemove?: MouseEventHandler<SVGPathElement>;
    onmouseleave?: MouseEventHandler<SVGPathElement>;
    onmouseout?: MouseEventHandler<SVGPathElement>;
    onmouseover?: MouseEventHandler<SVGPathElement>;
    onpointercancel?: MouseEventHandler<SVGPathElement>;
    onpointerdown?: MouseEventHandler<SVGPathElement>;
    onpointerup?: MouseEventHandler<SVGPathElement>;
    onpointerenter?: MouseEventHandler<SVGPathElement>;
    onpointerleave?: MouseEventHandler<SVGPathElement>;
    onpointermove?: MouseEventHandler<SVGPathElement>;
    onpointerover?: MouseEventHandler<SVGPathElement>;
    onpointerout?: MouseEventHandler<SVGPathElement>;
    ondrag?: MouseEventHandler<SVGPathElement>;
    ondrop?: MouseEventHandler<SVGPathElement>;
    ondragstart?: MouseEventHandler<SVGPathElement>;
    ondragenter?: MouseEventHandler<SVGPathElement>;
    ondragleave?: MouseEventHandler<SVGPathElement>;
    ondragover?: MouseEventHandler<SVGPathElement>;
    ondragend?: MouseEventHandler<SVGPathElement>;
    ontouchstart?: MouseEventHandler<SVGPathElement>;
    ontouchmove?: MouseEventHandler<SVGPathElement>;
    ontouchend?: MouseEventHandler<SVGPathElement>;
    ontouchcancel?: MouseEventHandler<SVGPathElement>;
    oncontextmenu?: MouseEventHandler<SVGPathElement>;
    onwheel?: MouseEventHandler<SVGPathElement>;
    /**
     * if you want to give your mark element an extra CSS class
     */
    class: string | null;
    cursor: ConstantAccessor<CSS.Property.Cursor>;
}>;

export type BorderRadius =
    | number
    | {
          topLeft?: number;
          topRight?: number;
          bottomRight?: number;
          bottomLeft?: number;
      };

export type BaseRectMarkProps = {
    inset?: ConstantAccessor<number>;
    insetLeft?: ConstantAccessor<number>;
    insetTop?: ConstantAccessor<number>;
    insetRight?: ConstantAccessor<number>;
    insetBottom?: ConstantAccessor<number>;
    borderRadius?: BorderRadius;
};

export type Channels = Record<
    string,
    ChannelAccessor | ConstantAccessor<string | number | boolean | symbol>
>;

export type TransformArg<K> = Channels & BaseMarkProps & { data: K[] };
export type MapArg<K> = Channels & { data: K[] };

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
    | 'fontVariant'
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
     * default color scheme
     */
    colorScheme: ColorScheme;
    /**
     * locale, used for automatic axis ticks
     */
    locale: string;
    /**
     * default number format for axis ticks
     */
    numberFormat: Intl.NumberFormatOptions;
    /**
     * default dot radius for line markers, used in dot, circle, and circle-stroke markers
     */
    markerDotRadius: number;
    /**
     * default props for area marks, applied to area, areaX, and areaY marks
     */
    area: Omit<AreaMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for areaX marks
     */
    areaX: Omit<AreaMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for areaY marks
     */
    areaY: Omit<AreaMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for arrow marks
     */
    arrow: Omit<ArrowMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for axis marks, applied to both axisX and axisY marks
     */
    axis: BaseMarkProps;
    /**
     * default props for axisX marks
     */
    axisX: Omit<AxisXMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for axisY marks
     */
    axisY: Omit<AxisYMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for bar marks, applied to both barX and barY marks
     */
    bar: Omit<BarXMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for barX marks
     */
    barX: Omit<BarXMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for barY marks
     */
    barY: Omit<BarXMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for brush marks, applied to brush, brushX and brushY marks
     */
    brush: Omit<BrushMarkProps, 'data' | 'facet' | 'limitDimension' | ChannelName>;
    /**
     * default props for brushX marks
     */
    brushX: Omit<BrushXMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for brushY marks
     */
    brushY: Omit<BrushYMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for cell marks
     */
    cell: Omit<CellMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for dot marks
     */
    dot: Omit<DotMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for frame marks
     */
    frame: FrameMarkProps;
    /**
     * default props for geo marks
     */
    geo: Omit<GeoMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for graticule marks
     */
    graticule: Omit<GraticuleMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for grid marks, applied to both gridX and gridY marks
     */
    grid: Omit<AxisXMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for gridX marks
     */
    gridX: Omit<AxisXMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for gridY marks
     */
    gridY: Omit<AxisYMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for line marks
     */
    line: Omit<LineMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for link marks
     */
    link: Omit<LinkMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for rect marks, applied to rect and rectX marks
     */
    rect: Omit<RectMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for rectX marks
     */
    rectX: Omit<RectXMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for rectY marks
     */
    rectY: Omit<RectYMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for rule marks
     */
    rule: Omit<RuleXMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for rule marks
     */
    ruleX: Omit<RuleXMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for rule marks
     */
    ruleY: Omit<RuleYMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for sphere marks
     */
    sphere: SphereMarkProps;
    /**
     * default props for spike marks
     */
    spike: Omit<SpikeMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for text marks
     */
    text: Omit<TextMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for tick marks, applied to tickX and tickY marks
     */
    tick: Omit<TickXMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for tickX marks
     */
    tickX: Omit<TickXMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for tickY marks
     */
    tickY: Omit<TickYMarkProps, 'data' | 'facet' | ChannelName>;
    /**
     * default props for vector marks
     */
    vector: Omit<VectorMarkProps, 'data' | 'facet' | ChannelName>;
};

export type MapIndexObject = {
    mapIndex: (I: number[], S: RawValue[], T: RawValue[]) => void;
};

export type MapMethod =
    | 'cumsum'
    | 'rank'
    | 'quantile'
    | ((I: number[], S: number[]) => number[])
    | MapIndexObject;

export type MapOptions = Partial<Record<ScaledChannelName, MapMethod>>;

export type UsedScales = Record<ScaledChannelName, boolean>;
