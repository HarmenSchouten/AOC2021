type NestedNumbers = Array<number> | Array<NestedNumbers | number>
type DepthData = {
    depth: number,
    data: NestedNumbers
}

const text = await Deno.readTextFile("./Day18/input.txt")
const lines = text.split("\r\n").map(line => JSON.parse(line)) as NestedNumbers

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
const NeedsReducing = (input:NestedNumbers):number[] | undefined => {
    const tracker = [] as DepthData[]

    const Tester = (input:NestedNumbers, depth:number) => {
        tracker.push({
            depth: depth,
            data: input
        })
        
        for (let i = 0; i < input.length; i++) {
            if (Array.isArray(input[i])) {
                Tester(input[i], depth + 1)
            }
        }
    }

    Tester(input, 0)

    return tracker.pop()?.data as number[]
}

const ReduceItem = (input: number[], base:NestedNumbers) => {
    let stringified = JSON.stringify(base)
    const index = stringified.indexOf(JSON.stringify(input))
    const endIndex = index + JSON.stringify(input).length
    
    const previousIndex = GetPreviousIndex(stringified, index)
    if (previousIndex) {
        stringified = UpdateAtIndex(stringified, previousIndex, previousIndex + 2, (Number(stringified[previousIndex]) + input[0]).toString())
    }
        
    const nextIndex = GetNextIndex(stringified, endIndex)
    if (nextIndex) {
        stringified = UpdateAtIndex(stringified, endIndex, endIndex + 2, (Number(stringified[nextIndex]) + input[1]).toString())
        console.log(stringified)
    }

    console.log(stringified)

    const reCalcIndex = stringified.indexOf(JSON.stringify(input))
    const reCalcEndIndex = reCalcIndex + (JSON.stringify(input).length - 1)
    stringified = ReplaceAtIndex(stringified, reCalcIndex, reCalcEndIndex)

    console.log(stringified)
}

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

const GetNextIndex = (base:string, index:number):number|undefined => {
    let nextIndex = undefined
    while (true) {
        for (let i = index; i <= base.length; i++) {
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
    console.log(base[start - 1], base[end + 1])
    if (!isNaN(Number(base[start - 1])) && isNaN(Number(base[end + 1]))) {
        update = ",0"
    } else {
        update = "0,"
    }

    return base.substring(0, start) + update + base.substring(end)
}

const input = [7,[6,[5,[4,[3,2]]]]]
const input2 = [[[[[9,8],1],2],3],4]
const needsReducing = NeedsReducing(input)

ReduceItem(needsReducing!, input2)