type NestedNumbers = Array<number> | Array<NestedNumbers | number>
type DepthData = {
    depth: number,
    data: NestedNumbers
}

const text = await Deno.readTextFile("./Day18/input.txt")
const lines = text.split("\r\n").map(line => JSON.parse(line) as NestedNumbers)

/**
 * Create a new nested array by combining two input arrays
 * @param a The base array
 * @param b The item to append 
 * @returns A new nested array containing both input arrays
 */
const Add = (a: NestedNumbers, b: NestedNumbers) => {
    return [a, b] as NestedNumbers
}

/**
 * Determines if a nested array needs reducing, meaning it has
 * nested pairs on a depth level of 4
 * @param input The input array
 * @returns A boolean whether we need reducing or not
 */
const NeedsReducing = (input:NestedNumbers):NestedNumbers | boolean => {
    const tracker = [] as DepthData[];

    const Tester = (input:NestedNumbers, depth:number) => {
        tracker.push({
            depth: depth,
            data: input
        })
        
        for (let i = 0; i < input.length; i++) {
            if (Array.isArray(input[i])) {
                Tester(input[i] as NestedNumbers, depth + 1)
            }
        }
    }

    Tester(input, 0);
    const last = tracker.find(item => item.depth >= 4)
    if (last) {
        return last.data as number[]
    } else {
        return false;
    }
}

const ReduceItem = (input: number[], base:NestedNumbers):NestedNumbers => {
    let stringified = JSON.stringify(base)

    const {index, endIndex} = GetStartEndIndex(JSON.stringify(input), stringified)
    
    const previousIndex = GetPreviousIndex(stringified, index)
    if (previousIndex) {
        stringified = UpdateAtIndex(stringified, previousIndex, previousIndex + 1, (Number(stringified[previousIndex]) + input[0]).toString())
    }

    const {index:index1, endIndex:endIndex1} = GetStartEndIndex(JSON.stringify(input), stringified)
        
    const nextIndex = GetNextIndex(stringified, endIndex1)
    if (nextIndex) {
        stringified = UpdateAtIndex(stringified, nextIndex, nextIndex + 1, (Number(stringified[nextIndex]) + input[1]).toString())
    }

    const {index:index2, endIndex:endIndex2} = GetStartEndIndex(JSON.stringify(input), stringified)
    stringified = ReplaceAtIndex(stringified, index2, endIndex2)
    return JSON.parse(stringified) as NestedNumbers
}

const GetStartEndIndex = (substring:string, base:string) => {
    const index = base.indexOf(substring)
    const endIndex = index + substring.length

    return {index, endIndex} as const
}

// @TODO: Works some magic with double digits
const GetPreviousIndex = (base:string, index:number):number | undefined => {
    let previousIndex = undefined
    while (true) {
        for (let i = index; i >= 0; i--) {
            const possibleNum = Number(base[i])
            if (!isNaN(possibleNum)) {
                previousIndex = i
                break;
            }
        }
        break;
    }
    return previousIndex
}

// @TODO: Works some magic with double digits
const GetNextIndex = (base:string, index:number):number|undefined => {
    let nextIndex = undefined
    while (true) {
        for (let i = index; i < base.length; i++) {
            const possibleNum = Number(base[i])
            if (!isNaN(possibleNum)) {
                nextIndex = i
                break;
            }
        }
        break;
    }
    return nextIndex
}

const UpdateAtIndex = (base:string, start:number, end:number, update: string) => {
    return base.substring(0, start) + update + base.substring(end)
}

const ReplaceAtIndex = (base:string, start:number, end:number) => {
    let update = "";
    if (!isNaN(Number(base[start])) && isNaN(Number(base[end]))) {
        update = ",0"
    } else if (isNaN(Number(base[start])) && !isNaN(Number(base[end]))) {
        update = "0,"
    } else {
        update = "0"
    }
    return base.substring(0, start) + update + base.substring(end)
}

const Reduce = (input: NestedNumbers):NestedNumbers => {

    const test = NeedsReducing(input)

    if (test) {
        const updated = ReduceItem(test as number[], input)
        console.log("REDUCE UPDATE", JSON.stringify(updated))
        return Reduce(updated)
    } else {
        return input
    }
}

const NeedsSplitting = (input: NestedNumbers):number|boolean => {
    const stringified = JSON.stringify(input)
    let test = "";
    [...stringified].forEach((val, index, arr) => {
        if (!isNaN(Number(val))) {
            const next = arr[index + 1]
            if (!isNaN(Number(next))) {
                test = `${val}` + `${next}`
                return;
            }
        }
    })

    if (test.trim() !== "") {
        return Number(test)
    } else {
        return false
    }
}

const SplitItem = (input:number, base:NestedNumbers):NestedNumbers => {
    const replacement = JSON.stringify([Math.floor(input / 2), Math.ceil(input / 2)])

    let stringified = JSON.stringify(base);
    const index = stringified.indexOf(input.toString())

    stringified = stringified.substring(0, index) + replacement + stringified.substring(index + input.toString().length)
    return JSON.parse(stringified) as NestedNumbers
}

const Split = (input:NestedNumbers):NestedNumbers => {
    const test = NeedsSplitting(input)

    if (test) {
        input = SplitItem(test as number, input)
        return Split(input)
    } else {
        return input
    }
}

const RunStep = (input:NestedNumbers):NestedNumbers => {
    let copyInput = input
    let checker = true;
    while (checker) {
        if (copyInput && NeedsReducing(copyInput)) {
            copyInput = Reduce(copyInput)
            console.log("REDUCED", JSON.stringify(copyInput))
        }
        if (copyInput && NeedsSplitting(copyInput)) {
            copyInput = Split(copyInput)
            console.log("SPLITTED", JSON.stringify(copyInput))
        }

        if (copyInput && !NeedsReducing(copyInput) && !NeedsSplitting(copyInput)) {
            checker = false;
        }
    }
    return copyInput
}

const first = lines.shift()
const test = lines.reduce((acc, line, index) => {
    const sum = Add(acc, line)
    const step = RunStep(sum)
    console.log(index, JSON.stringify(step))
    return step
}, first as NestedNumbers)

console.log(JSON.stringify(test))

//console.log(JSON.stringify(Reduce([[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]] as NestedNumbers)))