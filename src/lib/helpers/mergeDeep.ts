// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ObjectType = { [key: string]: any };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isObject(item: any): item is ObjectType {
    return item && typeof item === 'object' && !Array.isArray(item);
}

export default function mergeDeep(target: ObjectType, ...sources: ObjectType[]): ObjectType {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                } else {
                    target[key] = Object.assign({}, target[key]);
                }
                mergeDeep(target[key], source[key]);
            } else if (source[key] !== null) {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}
