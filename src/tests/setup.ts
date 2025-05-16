import ResizeObserver from 'resize-observer-polyfill';
import MatchMediaMock from 'vitest-matchmedia-mock';
import type MatchMedia from 'vitest-matchmedia-mock';

import { afterEach, beforeAll } from "vitest";

let matchMedia: MatchMedia;

beforeAll(() => {
    global.ResizeObserver = ResizeObserver;
    matchMedia = new MatchMediaMock();

    console.log('m', window.matchMedia);
})

afterEach(() => {
    matchMedia.clear();
})