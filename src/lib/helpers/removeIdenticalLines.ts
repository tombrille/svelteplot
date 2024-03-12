type Tick = { text: string[] };

/**
 * Remove identical lines from a set of ticks
 */
export default function removeIdenticalLines(input: Tick[]): Tick[] {
    const uniqueTicks: Tick[] = [];
    if (!input.length) return input;
    for (let c = 0; c < input.length; c++) {
        // initialize new tick array with empty text lines
        uniqueTicks.push({
            ...input[c],
            text: []
        });
    }
    for (let l = 0; l < input[0].text.length; l++) {
        const isIdentical =
            input.length > 1 && input.every((tick) => input[0].text[l] === tick.text[l]);
        for (let c = 0; c < input.length; c++) {
            if (!isIdentical && input[c].text[l]) uniqueTicks[c].text.push(input[c].text[l]);
        }
    }
    return uniqueTicks;
}
