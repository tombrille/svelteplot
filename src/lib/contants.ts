import type { ChannelName, ValueOf, ChannelTypeRaw } from './types';

export const CHANNEL_TYPES: Record<ChannelTypeRaw, symbol> = {
	opacity: Symbol('opacity'),
	color: Symbol('color'),
	position: Symbol('position'),
	angle: Symbol('angle'),
	symbol: Symbol('symbol'),
	radius: Symbol('radius')
};

export const CHANNEL_MAP: Record<ChannelName, ValueOf<typeof CHANNEL_TYPES>> = {
	x: CHANNEL_TYPES.position,
	y: CHANNEL_TYPES.position,
	opacity: CHANNEL_TYPES.opacity,
	strokeOpacity: CHANNEL_TYPES.opacity,
	fillOpacity: CHANNEL_TYPES.opacity,
	stroke: CHANNEL_TYPES.color,
	fill: CHANNEL_TYPES.color,
	r: CHANNEL_TYPES.radius,
	rotate: CHANNEL_TYPES.angle,
	symbol: CHANNEL_TYPES.symbol
};
