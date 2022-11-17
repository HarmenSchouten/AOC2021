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

// For each input item, add it to the total and check for each board
// if we have a winning row or column. If so, update the winningBoard object
input.reduce((acc, item) => {
    const totalInput = [...acc, Number(item)]

    boards.forEach((board, index) => {
        if (checker === false) { 
            const check = checkWinningBoard(totalInput, board)
            check && console.log(board, totalInput)
            if (check) {
                checker = true
                winningBoard = {
                    board: board,
                    input: totalInput,
                    lastRound: Number(item)
                }
            }
        }
    })

    return totalInput
}, [] as Number[])

// If we have a winningBoard, gather all numbers. Find the unmarked numbers
// and multiply this by the number of the last round
if (winningBoard?.board && winningBoard?.input && winningBoard?.lastRound) {
    const numbers = winningBoard.board.reduce((acc, row) => {
        let copy = [...acc]
        const rowItems = row.split(" ").filter(item => item !== "")
        rowItems.forEach(item => copy.push(Number(item)))

        return copy

    }, [] as number[])

    const unMarked = numbers.filter(item => !winningBoard.input.includes(item))

    const sum = unMarked.reduce((acc, item) => acc as number + item as number, 0 as number)

    console.log("FINAL", sum * winningBoard.lastRound)
}

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