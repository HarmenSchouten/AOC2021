const text = await Deno.readTextFile("./Day18/input.txt")
const lines = text.split("\r\n");

const sum = (line1: string, line2:string) => {
    return `[${line1},${line2}]`
}

const explode = (line: string) => {
    
    const chars = line.match(/\[|\,|\d+|\]/g)!

    let openingBrackets = 0
    let i = 0;
    
    while (openingBrackets < 5 && i < chars.length) {
        const char = chars[i]
        if (char === '[') openingBrackets++
        if (char === ']') openingBrackets--
        i++
    }
    
    if (openingBrackets != 5) {
        return {
            didExplode: false,
            line: line
        };
    }

    const startIdx = i - 1;
    const endIdx = chars.findIndex((char, idx) => char === ']' && idx > startIdx);
    const numbers = chars
        .slice(startIdx, endIdx)
        .filter(char => char.match(/\d+/g))
        .map(char => parseInt(char))

    const numberLeftIdx = chars.findLastIndex((char, idx) => char.match(/\d+/g) && idx < startIdx)
    const numberRightIdx = chars.findIndex((char, idx) => char.match(/\d+/g) && idx > endIdx)

    if (numberLeftIdx != -1) {
        chars.splice(numberLeftIdx, 1, String(Number(chars[numberLeftIdx]) + numbers[0]))
    }

    if (numberRightIdx != -1) {
        chars.splice(numberRightIdx, 1, String(Number(chars[numberRightIdx]) + numbers[1]))
    }

    chars.splice(startIdx, (endIdx - startIdx) + 1, "0")

    return {
        didExplode: true,
        line: chars.join("")
    };
}

const split = (line: string) => {

    const chars = line.match(/\[|\,|\d+|\]/g)!

    const numberIdx = chars.findIndex(item => item.match(/\d+/g) && Number(item) >= 10)
    
    if (numberIdx === -1) {
        return {
            didSplit: false,
            line: line
        }
    }
    
    const number = Number(chars[numberIdx])

    const newLeft = Math.floor(number / 2)
    const newRight = Math.ceil(number / 2)

    const newPair = `[${newLeft},${newRight}]`
    chars.splice(numberIdx, 1, newPair)

    return {
        didSplit: true,
        line: chars.join("")
    }
}

const reduce = (line: string) => {

    let reduceLine = line

    while (true) {
        const explodeResult = explode(reduceLine);
        reduceLine = explodeResult.line
        if (explodeResult.didExplode) {
            continue;
        }

        const splitResult = split(reduceLine)
        reduceLine = splitResult.line
        if (splitResult.didSplit) {
            continue;
        }

        break;
    }

    return reduceLine
}

const magnitude = (line: string) => {

    let lineCopy = line;
    while (isNaN(Number(lineCopy))) {

        const chars = lineCopy.match(/\[|\,|\d+|\]/g)!

        let deepestOpeningBracketIdx = 0
        let previousOpenBracketCount = 0;

        let openBracketCount = 0
        chars.forEach((char, idx) => {
            if (char === '[') {
                openBracketCount++
            } else if (char === "]") {
                openBracketCount--
            }

            if (openBracketCount > previousOpenBracketCount) {
                deepestOpeningBracketIdx = idx
                previousOpenBracketCount = openBracketCount
            }
        })

        const startIdx = deepestOpeningBracketIdx;
        const endIdx = chars.findIndex((char, idx) => char === "]" && idx > startIdx)
        const numbers = chars
            .filter((char, idx) => idx > startIdx && idx < endIdx && char.match(/\d+/g))
            .map(Number)

        chars.splice(startIdx, (endIdx - startIdx) + 1, String((3 * numbers[0] + 2 * numbers[1])))

        lineCopy = chars.join("")
    }

    return Number(lineCopy)
}


let maxMagnitude = 0

for (let i = 0; i < lines.length - 1; i++)
for (let j = 1; j < lines.length - 1; j++) {
    const sumResult1 = sum(lines[i], lines[j])
    const reduceResult1 = reduce(sumResult1)
    const result1 = magnitude(reduceResult1)
    if (result1 > maxMagnitude) maxMagnitude = result1

    const sumResult2 = sum(lines[j], lines[i])
    const reduceResult2 = reduce(sumResult2)
    const result2 = magnitude(reduceResult2)
    if (result2 > maxMagnitude) maxMagnitude = result2
}

console.log(maxMagnitude)