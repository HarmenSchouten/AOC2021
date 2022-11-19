const text = await Deno.readTextFile("./Day9/input.txt")
const lines = text.split("\r\n")

console.log("RISK", lines.reduce((acc, line, index) => {
    return acc + [...line].reduce((lineAcc, numberString, numberIndex) => {
        const prevLine = lines[index -1]
        const nextLine = lines[index + 1]
        
        const up = prevLine ? [...prevLine][numberIndex] : undefined
        const left = [...line][numberIndex - 1]
        const right = [...line][numberIndex + 1]
        const down = nextLine ? [...nextLine][numberIndex] : undefined

        const number = Number(numberString)
        
        if ((up === undefined ? true : number < Number(up)) &&
            (left === undefined ? true : number < Number(left)) &&
            (right === undefined ? true : number < Number(right)) &&
            (down === undefined ? true : number < Number(down))) {
                return lineAcc + (number + 1)
            }
        return lineAcc
    }, 0)
}, 0))