const text = await Deno.readTextFile("./Day18/input.txt")
const lines = text.split("\r\n");

type NestedNumbers = Array<number> | Array<NestedNumbers | number>
type DepthData = {
    depth: number,
    data: NestedNumbers,
}

const sum = (arr1: NestedNumbers, arr2: NestedNumbers) => [arr1, arr2];

const needsReducing = (arr: NestedNumbers) => {
  // helper function to traverse the array and find the first array at depth level 4 or greater
  function traverseArray(arr: NestedNumbers, depth: number): DepthData | undefined {
    // if the depth is 4 or greater and the current element is an array, return the depth data
    if (depth >= 4 && Array.isArray(arr)) {
        return {
            depth: depth,
            data: arr
        };
    }

    // iterate over the elements in the array
    for (let i = 0; i < arr.length; i++) {
        // if the element is an array, traverse it recursively
        if (Array.isArray(arr[i])) {
            const result = traverseArray(arr[i] as NestedNumbers, depth + 1);
            // if the result is not undefined, return it
            if (result !== undefined) {
                return result;
            }
        }
    }

    // if no array at depth level 4 or greater was found, return undefined
    return undefined;
}

// start traversing the array from depth level 0
return traverseArray(arr, 0);
}

const needsSplitting = (arr: NestedNumbers) => {
    const stringified = JSON.stringify(arr);

    return stringified.match(/\d+/g)?.map(item => Number(item)).sort((a, b) => b - a).filter(n => n >= 10).shift();
}

function getIndicesOf(searchStr:string, str:string) {
    const searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    let startIndex = 0, index, indices = [];
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

const GetCorrectIndice = (input: number[], base: NestedNumbers) => {
    const indices = getIndicesOf(JSON.stringify(input), JSON.stringify(base));

    return indices.filter(item => {
        const left = JSON.stringify(base).slice(0, item).replace(/\d/g, "");
        const countert = [...left].reduce((acc, curr) => {
            if (curr === "[") {
                return acc += 1
            } else if (curr === "]") {
                return acc -= 1
            }
            return acc
        }, 0)
        return countert >= 4
    }).shift()
}

const reduceItem = (input: number[], base: NestedNumbers) => {
    
    const startIndex = GetCorrectIndice(input, base)!
    
    const stringified = JSON.stringify(base);
    const endIndex = (startIndex ) + JSON.stringify(input).length;

    let left = stringified.slice(0, startIndex);
    let right = stringified.slice(endIndex);

    const previousNumber = left.match(/\d+/g)?.pop();
    const nextNumber = right.match(/\d+/g)?.shift()
    if (previousNumber) {
        const lastIndex = left.lastIndexOf(previousNumber as string);
        left = left.slice(0, lastIndex) + (Number(previousNumber) + input[0]).toString() + left.slice(lastIndex + previousNumber.length);  
    }

    if (nextNumber) {
        const nextIndex = right.indexOf(nextNumber as string);
        right = right.slice(0, nextIndex) + (Number(nextNumber) + input[1]).toString() + right.slice(nextIndex + (nextNumber.length));
    }

    // console.log(left+0+right)

    return JSON.parse(left + 0 + right)
}

const reduce = (base: NestedNumbers) => {
    let copy = base;
    let item = needsReducing(copy);
    while (item) {
        copy = reduceItem(item.data as number[], copy);
        item = needsReducing(copy);
    }

    return copy;
}

const splitItem = (input: number, base: NestedNumbers) => {
    const stringified = JSON.stringify(base);

    return JSON.parse(stringified.replace(input.toString(), `[${Math.floor(input / 2)}, ${Math.ceil(input / 2)}]`))
}

const split = (base: NestedNumbers) => {
    let copy = base;
    let item = needsSplitting(copy);
    while (item) {
        copy = splitItem(item, copy);
        item = needsSplitting(copy);
    }

    return copy;
}

// Run function as long as we need to split or reduce
const run = (base: NestedNumbers) => {
    let copy = base;
    let continueChecking = true;

    while (continueChecking) {
        const needToReduce = needsReducing(copy);
        if (needToReduce) {
            copy = reduce(copy);
        }

        const needToSplit = needsSplitting(copy);
        if (needToSplit) {
            copy = split(copy);
        }

        console.log(JSON.stringify(copy))

        continueChecking = needsSplitting(copy) !== undefined || needsReducing(copy) !== undefined;
    }

    return copy
}

const firstLine = JSON.parse(lines.shift()!) as NestedNumbers

const reduceLines = lines.reduce((acc, line) => {
    const concat = sum(acc, JSON.parse(line) as NestedNumbers)
    return run(concat);
}, firstLine);

console.log(JSON.stringify(reduceLines))