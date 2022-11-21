const text = await Deno.readTextFile("./Day13/input.txt")
const lines = text.split("\r\n")

type Coord = {
    x: number,
    y: number
}

type FoldLine = {
    key: 'x' | 'y'
    line: number
}

const empty = '.'
const marked = '#' 

const coords = lines
                .filter(item => !item.startsWith('fold') && item.trim() !== "")
                .reduce((acc, item) => 
                    [...acc, { x: Number(item.split(',')[0]),  y: Number(item.split(',')[1]) } as Coord ], [] as Coord[])

const foldingInstr = lines
                        .filter(item => item.startsWith('fold'))
                        .reduce((acc, line) => {
                            const instr = line
                                            .split(' ')
                                            .filter(item => item.startsWith('x') || item.startsWith('y'))[0]
                                            .split("=")

                            return [...acc, {key: instr[0]!, line: Number(instr[1])} as FoldLine]
                        }, [] as FoldLine[])

const maxX = coords.reduce((acc, item) => item.x > acc ? item.x : acc, 0)
const maxY = coords.reduce((acc, item) => item.y > acc ? item.y : acc, 0)

const buildGrid = (x:number, y:number) => {
    let grid:string[][] = []
    
    for(let i = 0; i <= y; i++)
    for(let j = 0; j <= x; j++) {
        if (grid[i]) {
            grid[i].push(empty)
        } else {
            grid.push([empty])
        }
    }

    return grid
}

const grid = buildGrid(maxX, maxY)

const updatedGrid = coords.reduce((acc, coord) => {
    const grid = [...acc]
    grid[coord.y][coord.x] = marked
    return grid
}, grid)

const foldGridY = (y:number, grid:string[][]) => {
    const base = grid.filter((_, i) => i < y)
    const rest = grid.reverse().filter((_, i) => i < y)

    return MergeGrids(base, rest)
}

const foldGridX = (x:number, grid:string[][]) => {
    const base = grid.map(item => item.filter((_, i) => i < x))
    const rest = grid.map(item => item.reverse().filter((_, i) => i < x))

    return MergeGrids(base, rest)
}

function MergeGrids(a:string[][], b:string[][]) {
    return a.reduce((acc, line, y) => {
        return [
            ...acc, 
            line.reduce((subAcc, item, x) => {
                if (b[y][x] === marked || item === marked) {
                    return [...subAcc, marked]
                } else {
                    return [...subAcc, empty]
                }
            }, [] as string[])
        ]
    }, [] as string[][])
}

function NumberOfMarked(input:string[][]) {
    return input.map(line => line.filter(item => item === marked)).flat().length
}

const firstFold = foldingInstr[0].key === "x"
    ? foldGridX(foldingInstr[0].line, updatedGrid)
    : foldGridY(foldingInstr[0].line, updatedGrid)

console.log(NumberOfMarked(firstFold))