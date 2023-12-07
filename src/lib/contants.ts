import type { ChannelName, MarkProps, MarkStyleProps } from './types';

export const CHANNEL_TYPES: Record<ChannelName, symbol> = {
    opacity: Symbol('opacity'),
    color: Symbol('color'),
    x: Symbol('position'),
    y: Symbol('position'),
    angle: Symbol('angle'),
    symbol: Symbol('symbol'),
    radius: Symbol('radius'),
    width: Symbol('width')
};

export const MARK_PROP_CHANNEL: Record<MarkProps & MarkStyleProps, ChannelName> = {
    x: 'x',
    x1: 'x',
    x2: 'x',
    y: 'y',
    y1: 'y',
    y2: 'y',
    rotate: 'angle',
    r: 'radius',
    symbol: 'symbol',
    fill: 'color',
    stroke: 'color',
    opacity: 'opacity',
    fillOpacity: 'opacity',
    strokeOpacity: 'opacity',
    strokeWidth: 'width'
};

// export const CHANNEL_MAP: Record<ChannelName, ValueOf<typeof CHANNEL_TYPES>> = {
// 	x: CHANNEL_TYPES.x,
// 	y: CHANNEL_TYPES.y,
// 	opacity: CHANNEL_TYPES.opacity,
// 	strokeOpacity: CHANNEL_TYPES.opacity,
// 	strokeWidth: CHANNEL_TYPES.width,
// 	fillOpacity: CHANNEL_TYPES.opacity,
// 	stroke: CHANNEL_TYPES.color,
// 	fill: CHANNEL_TYPES.color,
// 	r: CHANNEL_TYPES.radius,
// 	rotate: CHANNEL_TYPES.angle,
// 	symbol: CHANNEL_TYPES.symbol
// };
