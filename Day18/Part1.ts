const text = await Deno.readTextFile("./Day18/input.txt")
const lines = text.split("\r\n");

type NestedNumbers = Array<number> | Array<NestedNumbers | number>

const sum = (arr1: NestedNumbers, arr2: NestedNumbers) => [arr1, arr2];

const explode = (input:NestedNumbers) => {

    const stringified = JSON.stringify(input);

    console.log(stringified)

    let depth = 0;
    for (let i = 0; i < stringified.length; i++) {
        if(stringified[i] === "[") {
            depth++;	
            if (depth >= 5) {
                // Identify our pair as a number array
                const pair = [] as number[]
                let number = "";
                let test = ""
                for (let j = i; j < stringified.length; j++) {
                    if (stringified[j] === ",") {
                        test = test + stringified[j];
                        pair.push(Number(number))
                        number = "";
                    } else if (stringified[j] === "]") {
                        test = test + stringified[j];
                        pair.push(Number(number))
                        number = "";
                        break;
                    } else if (stringified[j] === "[" && stringified[j + 1] === "[") {
                        test = test + stringified[j];
                        number += stringified[j];
                        break
                    } else if (stringified[j] !== "[") {
                        test = test + stringified[j];
                        number += stringified[j];
                    } 
                }
                if (number === "[" || pair.length !== 2) {
                    console.log("FAIL", number, pair)
                    continue;
                }

                console.log(pair)
                
                let leftNumberString = "";
                let leftNumberStartingIndex = 0;
                // Find the first number on the left
                for (let j = i - 1; j >= 0; j--) {
                    if (!isNaN(Number(stringified[j]))) {
                        leftNumberString = stringified[j] + leftNumberString;
                        leftNumberStartingIndex = j;
                    } else if (isNaN(Number(stringified[j])) && leftNumberString !== "") {
                        break;
                    }
                }

                // Update the left number here
                let left = stringified.slice(0, i);
                if (leftNumberString !== "") {
                    left = stringified.slice(0, leftNumberStartingIndex) + (Number(leftNumberString) + pair[0]) + stringified.slice(leftNumberStartingIndex + leftNumberString.length, i);
                }

                // Find the first number on the right
                let rightNumberString = "";
                let rightNumberStartingIndex = 0;
                for (let j = i + JSON.stringify(pair).length; j < stringified.length; j++) {
                    if (!isNaN(Number(stringified[j]))) {
                        // Check how much further we must go, then replace it with the sum
                        // of this number + the first number of our par
                        rightNumberString = rightNumberString + stringified[j];
                        rightNumberStartingIndex = j;
                    } else if (isNaN(Number(stringified[j])) && rightNumberString !== "") {
                        break;
                    }
                }
                
                // Update the right number here
                let right = stringified.slice((i + JSON.stringify(pair).length));
                if (rightNumberString !== "") {
                    right = stringified.slice((i + JSON.stringify(pair).length), (rightNumberStartingIndex - rightNumberString.length) + 1) + (Number(rightNumberString) + pair[1]) + stringified.slice(((rightNumberString.length >= 2
                        ? rightNumberStartingIndex - 1
                        : rightNumberStartingIndex) + rightNumberString.length));
                }
                return {
                    didReduce: true,
                    result: JSON.parse(left + 0 + right)
                };
            }
        } else if (stringified[i] === "]") {
            depth--
        }
    }

    return {
        didReduce: false,
        result: input
    }
}

const split = (input:NestedNumbers) => {

    const stringified = JSON.stringify(input);

    const firstMatch = stringified.match(/\d+/g)?.map(item => Number(item)).sort((a, b) => b - a).filter(n => n >= 10).shift();
    
    return {
        didSplit: firstMatch !== undefined,
        result: firstMatch !== undefined 
            ? JSON.parse(stringified.replace(firstMatch.toString(), `[${Math.floor(firstMatch / 2)}, ${Math.ceil(firstMatch / 2)}]`)) 
            : input
    }
}

const reduce = (input:NestedNumbers) => {

    let copy = input;
    let explodeChecker = true;

    while (explodeChecker) {
        const reduced = explode(copy);
        copy = reduced.result
        explodeChecker = reduced.didReduce;
    }

    return copy
}

// const splitter = (input:any) => {
//     let copy = input;
//     let splitChecker = true;

//     while (splitChecker) {
//         const splitt = split(copy);
//         copy = splitt.result;
//         splitChecker = splitt.didSplit;
//     }

//     return copy;
// }

const run = (input:NestedNumbers) => {
    let copy = input;
    let continueChecking = true;

    while (continueChecking) {
        const copy2 = reduce(copy);
        
        const splitt = split(copy2);
        const copy3 = splitt.result;

        continueChecking = JSON.stringify(copy3) !== JSON.stringify(copy);

        copy = copy3;
    }

    return copy;
}

const firstLine = JSON.parse(lines.shift()!) as NestedNumbers
const test = lines.reduce((acc, item) => {
    const concat = sum(acc, JSON.parse(item) as NestedNumbers)
    const reduced = run(concat)
    return reduced;
}, firstLine)

console.log(JSON.stringify(test))