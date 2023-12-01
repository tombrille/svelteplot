export default function removeIdenticalLines(input: string[][]): string[][] {
    const uniqueLines: string[][] = [];
    if (!input.length) return input;
    for (let c = 0; c < input.length; c++) {
        uniqueLines.push([]);
    }

    for (let l = 0; l < input[0].length; l++) {
        const isIdentical = input.every((value) => input[0][l] === value[l]);
        for (let c = 0; c < input.length; c++) {
            if (!isIdentical) uniqueLines[c].push(input[c][l]);
        }
    }

    return uniqueLines;
}
