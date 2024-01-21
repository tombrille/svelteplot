import { describe, it, expect } from 'vitest';
import { Mark, test } from './Mark.svelte.js';
import { tick } from 'svelte';

describe('resolveProp', () => {
    it('resolves string keys', async () => {
        console.log(Mark);
        const mark = new Mark('barX', ['x', 'y', 'fill', 'stroke'], false, { x: 'foo', y: 'bar' });
        expect(mark.type).toBe('barX');
        expect(mark.channels).toBeInstanceOf(Set);
        expect(Array.from(mark.channels.values())).toStrictEqual(['x', 'y', 'fill', 'stroke']);
        await tick();
        expect(mark.scales).toBeInstanceOf(Set);
        expect(mark.scales.size).toBe(2);
    });
});

describe('test runes', () => {
    it('works', async () => {
        const t = test(42);
        expect(t.value).toBe(42);
        expect(t.double).toBe(84);
        t.addOne();
        expect(t.value).toBe(43);
        expect(t.double).toBe(86);
    });
});
