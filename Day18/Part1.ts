const text = await Deno.readTextFile("./Day18/input.txt")
const lines = text.split("\r\n");

type NestedNumbers = Array<number> | Array<NestedNumbers | number>

/**
 * Combine two arrays by creating a new array with the first
 * array and the second array
 * @param arr1 The first input val
 * @param arr2 The 2nd input val
 * @returns A new array containing both input values
 */
const sum = (arr1: NestedNumbers, arr2: NestedNumbers) => [arr1, arr2];

/**
 * Explode the input by searching for a valid pair on depth level 5 or lower
 * Then add the first number of that pair to the first number on the left side of this pair
 * Then add the second number of that pair to the first number on the right side of this pair
 * Then, replace the pair with a 0
 * @param input The input data
 * @returns A one time exploded input as a result
 */
const explode = (input:NestedNumbers) => {

    // Stringify the inpujt
    const stringified = JSON.stringify(input);

    console.log(stringified)

    // Set our initial depth level
    let depth = 0;

    // Loop through each character in the stringified input
    for (let i = 0; i < stringified.length; i++) {

        // If we encounter a [ we increase the depth level
        if(stringified[i] === "[") {
            depth++;	

            // If we hit depth level 5 or greater, explode the first item
            if (depth >= 5) {

                // First, identify our pair by further looking into the array
                // Add the found numbers to a string. When we hit a , or a ] bracket,
                // we stop and add the number to the array
                const pair = [] as number[]
                let number = "";
                for (let j = i; j < stringified.length; j++) {
                    if (stringified[j] === ",") {
                        pair.push(Number(number))
                        number = "";
                    } else if (stringified[j] === "]") {
                        pair.push(Number(number))
                        number = "";
                        break;
                    } else if (stringified[j] === "[" && stringified[j + 1] === "[") {
                        number += stringified[j];
                        break
                    } else if (stringified[j] !== "[") {
                        number += stringified[j];
                    } 
                }

                // Validate that we have a valid pair
                if (number === "[" || pair.length !== 2) {
                    console.log("FAIL", number, pair)
                    continue;
                }

                console.log(pair)
                
                // Find the first number on the left side of the pair by looping backwards
                // through the stringified input. When we hit a non-number character, we stop
                let leftNumberString = "";
                let leftNumberStartingIndex = 0;
                for (let j = i - 1; j >= 0; j--) {
                    if (!isNaN(Number(stringified[j]))) {
                        leftNumberString = stringified[j] + leftNumberString;
                        leftNumberStartingIndex = j;
                    } else if (isNaN(Number(stringified[j])) && leftNumberString !== "") {
                        break;
                    }
                }

                let left = stringified.slice(0, i);
                
                // If we found a number on the left, slice up the left side of the input
                // and add the first number of the pair to the left number
                if (leftNumberString !== "") {
                    left = stringified.slice(0, leftNumberStartingIndex) + (Number(leftNumberString) + pair[0]) + stringified.slice(leftNumberStartingIndex + leftNumberString.length, i);
                }

                // Find the first number on the right side of the pair by looping further
                // through the stringified input. When we hit a non-number character, we stop
                let rightNumberString = "";
                let rightNumberStartingIndex = 0;
                for (let j = i + JSON.stringify(pair).length; j < stringified.length; j++) {
                    if (!isNaN(Number(stringified[j]))) {
                        rightNumberString = rightNumberString + stringified[j];
                        rightNumberStartingIndex = j;
                    } else if (isNaN(Number(stringified[j])) && rightNumberString !== "") {
                        break;
                    }
                }
                
                let right = stringified.slice((i + JSON.stringify(pair).length));

                // If we found a number on the right, slice up the right side of the input
                // and add the first number of the pair to the right number
                if (rightNumberString !== "") {
                    right = stringified.slice((i + JSON.stringify(pair).length), (rightNumberStartingIndex - rightNumberString.length) + 1) + (Number(rightNumberString) + pair[1]) + stringified.slice(((rightNumberString.length >= 2
                        ? rightNumberStartingIndex - 1
                        : rightNumberStartingIndex) + rightNumberString.length));
                }

                // Return the result, being the updated left side, the pair replaced with a 0
                // and the updated right side
                return {
                    didReduce: true,
                    result: JSON.parse(left + 0 + right)
                };
            }
        } 
        // If we encounter a ] we decrease the depth level
        else if (stringified[i] === "]") {
            depth--
        }
    }

    // If we didn't hit an early return, that means we didn't make it to depth level 5
    // So we return the input as is
    return {
        didReduce: false,
        result: input
    }
}

/**
 * Split the first occurrence of a number of 10 or greater into a new pair, 
 * the first number is the original number divided by 2 - rounded down.
 * The 2nd number is the original number divided by 2 - rounded up.
 * @param input The input data
 * @returns The splittedetetdet input data
 */
const split = (input:NestedNumbers) => {
    const stringified = JSON.stringify(input);
    const firstMatch = stringified.
                        match(/\d+/g)?.
                        map(item => Number(item)).
                        sort((a, b) => b - a).
                        filter(n => n >= 10).
                        shift();
    
    return {
        didSplit: firstMatch !== undefined,
        result: firstMatch !== undefined 
            ? JSON.parse(stringified.replace(firstMatch.toString(), `[${Math.floor(firstMatch / 2)}, ${Math.ceil(firstMatch / 2)}]`)) 
            : input
    }
}

const reduce = (input:NestedNumbers) => {

    // Create a copy of the input
    let copy = input;

    // While we can explode item in the input, keep exploding
    // until we can't explode anymore
    while (true) {
        const reduced = explode(copy);
        copy = reduced.result
        
        if (!reduced.didReduce) {
            break;
        }
    }

    return copy
}

const run = (input:NestedNumbers) => {

    // Create a copy of the input
    let copy = input;

    while (true) {
        // First try to reduce the input until there are no no more explode actions
        const copy2 = reduce(copy);
        
        // Then split the input once
        const splitItBoy = split(copy2).result;

        // If we didn't split AND didn't explode, we can stop
        if (JSON.stringify(splitItBoy) === JSON.stringify(copy)) {
            break;
        }

        copy = splitItBoy;
    }
    return copy;
}

// Get the first line as a baseline, reduce it and split it if needed
const firstLine = run(JSON.parse(lines.shift()!) as NestedNumbers)

// Then loop through each line, reduce each line and then sum it with the accumulator.
// Then try to reduce and split the result and return the final result
const test = lines.reduce((acc, item) => {
    const concat = sum(acc, run(JSON.parse(item) as NestedNumbers))
    const reduced = run(concat)
    return reduced;
}, firstLine)

console.log(JSON.stringify(test))