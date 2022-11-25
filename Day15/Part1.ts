type Coord = {
    x: number
    y: number
}

const text = await Deno.readTextFile("./Day15/input.txt")
const lines = text.split("\r\n")

const grid = lines.reduce((acc, line) => [...acc, [...line].reduce((subAcc, number) => [...subAcc, Number(number)], [] as number[])], [] as number[][])

const valByCoord = (x:number, y:number) => grid[x][y]