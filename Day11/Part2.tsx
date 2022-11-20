const text = await Deno.readTextFile("./Day11/input.txt")
const lines = text.split("\r\n")

type Coord = {
    x: number,
    y: number
}

let flashCounter = 0;

const input:number[][] = lines.reduce((acc, state) => [...acc, [...state].reduce((subAcc, subState) => [...subAcc, Number(subState)], [] as number[])], [] as number[][])

function RunStep(input:number[][]) {
    // Increase each number by one
    const increasedInput = IncreaseAllNumbers(input)

    return RunFlashes([], increasedInput)
}

function IncreaseAllNumbers(input:number[][]):number[][] {
    return input.reduce((acc, state) => [...acc, state.reduce((subAcc, subState) => [...subAcc, subState + 1], [] as number[])], [] as number[][])
}

function GetFlashingCoords(input:number[][]):Coord[] {
    return input.reduce((acc, line, y) =>
    [
        ...acc,
        ...line.reduce((acc, number, x) => {
            if (number > 9) {
                return [...acc, {x: x, y: y} as Coord]
            }
            return [...acc]
        }, [] as Coord[])
    ]
, [] as Coord[])
}

function IncreaseInputOnCoords(coords:Coord[], input:number[][]):number[][] {
    return input.reduce((acc, line, y) => 
        [...acc, 
         line.reduce((subAcc, number, x) => {
            const numberOfCoords = coords.filter(coord => coord.x === x && coord.y === y).length
            if (numberOfCoords > 0) {
                return [...subAcc, number + numberOfCoords]
            }
            return [...subAcc, number]
         }, [] as number[])   
    ], [] as number[][])
}

function GetAdjacentCoords(x: number, y: number):Coord[] {
    return [
        {x: x, y: y - 1},
        {x: x, y: y + 1},
        {x: x - 1, y: y},
        {x: x + 1, y: y},
        {x: x + 1, y: y + 1},
        {x: x + 1, y: y - 1},
        {x: x - 1, y: y + 1},
        {x: x - 1, y: y - 1},
    ]
}

function GetValue(coord:Coord, input:number[][]):number|undefined {
    const line = input[coord.y]
    const number = line ? line[coord.x] : undefined
    return number ?? undefined;
}

function CompareCoords(coordA:Coord, coordB:Coord) {
    return coordA.x === coordB.x && coordA.y === coordB.y
}

/**
 * Get the coordinates for which we flash, that haven't already been flashed 
 * and increase the adjacent numbers.
 * Repeat as long as we have numbers that surpass the threshold and are not included in our total list
 * @param ranFlashes The coordinates for which we have already flashed
 * @param input The input
 * @returns The updated input
 */
function RunFlashes(ranFlashes: Coord[], input:number[][]):number[][] {
    const flashingCoords = GetFlashingCoords(input)
                                .filter(coord => GetValue(coord, input) !== undefined && GetValue(coord, input)! >= 10)
                                .filter(coord => !ranFlashes.some(c => CompareCoords(coord, c)))
    
    // Get all adjacent coords
    const adjacentCoords = flashingCoords.flatMap(coord => [...GetAdjacentCoords(coord.x, coord.y), coord])

    // Update the input for our adjacent coords
    const updatedInput = IncreaseInputOnCoords(adjacentCoords, input)

    // Check if there are any new flashes to be done and aren't included in the previous runs
    const newFlashes = GetFlashingCoords(updatedInput).filter(coord => GetValue(coord, updatedInput) !== undefined && GetValue(coord, updatedInput)! >= 10).filter(coord => !ranFlashes.some(c => CompareCoords(coord, c)))

    if (newFlashes.length === 0) {
        flashCounter = flashCounter + ranFlashes.length + flashingCoords.length
        return ResetFlashes(updatedInput)
    } else {
        return RunFlashes([...ranFlashes, ...flashingCoords], updatedInput)
    }
}


/**
 * Reset all numbers that are higher than 9 to 0
 * @param input The input
 * @returns The updated input with no numbers higher than 0
 */
function ResetFlashes(input:number[][]):number[][] {
    return input.reduce((acc, state) => [...acc, state.reduce((subAcc, number) => {
        return [...subAcc, number > 9 ? 0 : number]
    }, [] as number[])], [] as number[][])
}

function EqualityIsWhatWeLiveFor(input:number[][]):boolean {
    return input.every((line, index) => line.every((val, i, arr) => val === arr[0]))
}

// ======================================= //

let updatedInput = [...input]
let stepCounter = 0
while(!EqualityIsWhatWeLiveFor(updatedInput)) {
    updatedInput = RunStep(updatedInput)
    stepCounter = stepCounter + 1
}

console.log(updatedInput)

console.log("COUNT", stepCounter)