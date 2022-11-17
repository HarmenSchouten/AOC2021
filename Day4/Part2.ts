type WinningBoard = {
    board: string[],
    input: Number[],
    lastRound: number
}

// Define the global checker
let checker = false;

let winningBoard:WinningBoard = {} as WinningBoard

// ================================================ ///

const text = await Deno.readTextFile("./Day4/input.txt")

const items = text.split("\r\n")

const input = items.splice(0, 1)[0].split(',')

const boards:string[][] = []

// Setup the boards
items.forEach(item => {
    if (item.trim() === "") {
        boards.push([])
    } else {
        let last = boards[boards.length -1]
        if(Array.isArray(last)) {
            last.push(item)
        } else {
            last = [item]
        }
    }
})

console.log("Number of boards", boards.length)

// Build a map for each board containing the value if it won
const boardMap = new Map();

// For each input item, add it to the total and check for each board
// if we have a winning row or column. If so, update the winningBoard object
input.reduce((acc, item) => {
    const totalInput = [...acc, Number(item)]

    boards.forEach((board, index) => {
        if (boardMap.get(index) === false || boardMap.get(index) === undefined) {
            const check = checkWinningBoard(totalInput, board)
            if (check) {
                boardMap.set(index, item)
            }
        }
    })

    return totalInput
}, [] as number[])

// - This can be done way better -_- but hey, we began already

// Map the entries to an array
const boardMapEntries = [...boardMap.entries()]

// Last item of this array has the index of the board and the number of the last round
const lastWinningBoardEntry = boardMapEntries[boardMapEntries.length - 1]

// Get the board index
const lastWinningBoardIndex = lastWinningBoardEntry[0]

// Get the last round
const lastRound = lastWinningBoardEntry[1] as number

// Calculate the input up until this point 
const indexOfLastRound = input.findIndex(item => item === lastRound.toString())
const totalInput = input.filter((_, index) => index <= indexOfLastRound)

// Get all the numbers from the winning board
const numbers = boards[lastWinningBoardIndex].reduce((acc, row) => {
    const copy = [...acc]
    const rowItems = row.split(" ").filter(item => item !== "")
    rowItems.forEach(item => copy.push(Number(item)))

    return copy
}, [] as number[])

// Find all unmarked numbers
const unMarked = numbers.filter(item => !totalInput.includes(item.toString()))

// Get the sum of all unmarked numbers
const sum = unMarked.reduce((acc, item) => acc as number + item as number, 0 as number)

// Multiply the sum by the lastRound number to get the final value
console.log("FINAL", sum * lastRound)

function checkWinningBoard(numbers: Number[], boardLines:string[]) {
    let match = false;
    boardLines.forEach(item => {
        if (match === false) {
            const rowItems = item.split(" ").filter(item => item !== "")
            match = rowItems.every(v => numbers.includes(Number(v)))
        }
    })

    if (match === false) {
        const length = boardLines.at(0)?.split(" ").length
        if (length) {
            for(let i = 0; i < length; i++) {
                if (match === false) {
                    const items = boardLines.map(line => {
                        return line.split(" ").filter(item => item !== "")[i]
                    })
    
                    match = items.every(v => numbers.includes(Number(v)))
                }
            }
        }
    }

    return match
}