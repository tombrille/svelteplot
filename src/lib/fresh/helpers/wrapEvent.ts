export function wrapEvent(handler, d) {
    return handler ? () => handler(d.___orig___ !== undefined ? d.___orig___ : d) : null;
}
