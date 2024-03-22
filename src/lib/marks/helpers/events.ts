import type { BaseMarkProps, DataRecord, PlotScales } from '$lib/types.js';
import type { MouseEventHandler } from 'svelte/elements';
import pick from 'underscore/modules/pick.js';

export function addEventHandlers(
    node: SVGElement,
    { scales, options, datum }: { scales: PlotScales; options: BaseMarkProps; datum: DataRecord }
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
        'onwheel',
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
                if (origEvent.layerX !== undefined) {
                    if (scales.projection) {
                        const [x, y] = scales.projection.invert([origEvent.layerX, origEvent.layerY]);
                        origEvent.dataX = x;
                        origEvent.dataY = y;
                    } else {
                        origEvent.dataX = scales.x.fn.invert(origEvent.layerX);
                        origEvent.dataY = scales.y.fn.invert(origEvent.layerY);
                    }
                }
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
