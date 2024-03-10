import type { BaseMarkProps, DataRecord } from '$lib/types.js';
import type { MouseEventHandler } from 'svelte/elements';
import pick from 'underscore/modules/pick.js';

export function addEvents(
    node: SVGElement,
    { options, datum }: { options: BaseMarkProps; datum: DataRecord }
) {
    const events = pick(
        options,
        'onclick',
        'oncontextmenu',
        'ondblclick',
        'ondrag',
        'ondragend',
        'ondragenter',
        'ondragleave',
        'ondragover',
        'ondragstart',
        'ondrop',
        'onmousedown',
        'onmouseenter',
        'onmouseleave',
        'onmousemove',
        'onmouseout',
        'onmouseup',
        'ontouchcancel',
        'ontouchend',
        'ontouchmove',
        'ontouchstart'
    );

    const listeners = new Map<string, MouseEventHandler<SVGElement>>();
    // attach event handlers
    for (const [eventName, eventHandler] of Object.entries(events)) {
        if (eventHandler) {
            const wrappedHandler = (origEvent: Event) => {
                eventHandler(origEvent, datum.___orig___ !== undefined ? datum.___orig___ : datum);
            };
            listeners.set(eventName, wrappedHandler);
            node.addEventListener(eventName.substring(2), wrappedHandler);
        }
    }
    if (events.onclick || events.onmousedown || events.onmouseup) {
        // force role button
        node.setAttribute('role', 'button');
    }
    return {
        destroy() {
            for (const [eventName, handler] of listeners.entries()) {
                node.removeEventListener(eventName.substring(2), handler);
            }
        }
    };
}
