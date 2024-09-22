/**
 * 
 */
export function roundedRect(x: number, y: number, width: number, height: number, borderRadius: number | { topLeft?: number; topRight?: number; bottomLeft?: number; bottomRight?: number } = {topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0}) {
  if (typeof borderRadius === 'number') {
    borderRadius = {topLeft: borderRadius, topRight: borderRadius, bottomLeft: borderRadius, bottomRight: borderRadius};
  }
  return `
    M ${x + (borderRadius.topLeft || 0)} ${y}
    L ${x + width - (borderRadius.topRight || 0)} ${y}
    ${borderRadius.topRight ? `Q ${x + width} ${y} ${x + width} ${y + (borderRadius.topRight || 0)}` : ''}
    L ${x + width} ${y + height - (borderRadius.bottomRight || 0)}
    ${borderRadius.bottomRight ? `Q ${x + width} ${y + height} ${x + width - (borderRadius.bottomRight || 0)} ${y + height}` : ''}
    L ${x + (borderRadius.bottomLeft || 0)} ${y + height}
    ${borderRadius.bottomLeft ? `Q ${x} ${y + height} ${x} ${y + height - (borderRadius.bottomLeft || 0)}` : ''}
    L ${x} ${y + (borderRadius.topLeft || 0)}
    ${borderRadius.topLeft ? `Q ${x} ${y} ${x + (borderRadius.topLeft || 0)} ${y}` : ''}
    Z
  `
}