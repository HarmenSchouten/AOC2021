type Coord = {
    x: number
    y: number
}

type HashMap = { [key: string] : number }

const text = await Deno.readTextFile("./Day15/input.txt")
const lines = text.split("\r\n")

const grid = lines.reduce((acc, line) => [...acc, [...line].reduce((subAcc, number) => [...subAcc, Number(number)], [] as number[])], [] as number[][])

const neighbours = (x:number, y:number) => [
    {x: x, y: y - 1},
    {x: x, y: y + 1},
    {x: x - 1, y: y},
    {x: x + 1, y: y},
]

const start = {x: 0, y: 0}
const end = {x: grid[0].length - 1, y: grid.length - 1}

console.log(start, end)

let queue = {} as HashMap
queue[`${start.x}.${start.y}`] = 0

const riskMap = {} as HashMap
riskMap[`${start.x}.${start.y}`] = 0

while (true) {
    const pointString = GetLowest(queue)

    if (pointString === undefined) {
        break;
    }

    const point = {
        x: Number(pointString.split('.')[0]),
        y: Number(pointString.split('.')[1])
    } as Coord

    if (point.x === end.x && point.y === end.y) {
        break;
    }

    const adjacent = neighbours(point.x, point.y)
    adjacent.forEach(item => {
        if (HasItem(item.x, item.y, grid) !== undefined) {
            const totalRisk = riskMap[`${point.x}.${point.y}`] + HasItem(item.x, item.y, grid)!
            if (totalRisk < (riskMap[`${item.x}.${item.y}`] ?? Number.MAX_SAFE_INTEGER)) {
                riskMap[`${item.x}.${item.y}`] = totalRisk
                queue[`${item.x}.${item.y}`] = totalRisk
            }
        }
    })
}

console.log(riskMap[`${end.x}.${end.y}`])

function GetLowest(map:HashMap) {
    const arr = Object.keys(map);
    if (arr.length > 0) {
        const lowestItem = arr.reduce((acc, item) => {
            if (map[item] < map[acc]) {
                return item 
            } else {
                return acc
            }
        })
    
        delete map[lowestItem]
        
        queue = map
    
        return lowestItem    
    } 
    return undefined

}

function HasItem(x: number, y:number, grid: number[][]) {
    const line = grid[y]
    const item = line?.[x] ?? undefined
    return item ?? undefined
}