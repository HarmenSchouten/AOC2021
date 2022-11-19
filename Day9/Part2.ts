const text = await Deno.readTextFile("./Day9/input.txt")
const lines = text.split("\r\n")

type Coord = {
    x: number,
    y: number
}

const lowestPoints:Coord[] = []

lines.forEach((line, y) => {
    [...line].forEach((char, x) => {
        const prevLine = lines[y -1]
        const nextLine = lines[y + 1]
        
        const up = prevLine ? [...prevLine][x] : undefined
        const left = [...line][x - 1]
        const right = [...line][x + 1]
        const down = nextLine ? [...nextLine][x] : undefined

        if ((up === undefined ? true : Number(char) < Number(up)) &&
            (left === undefined ? true : Number(char) < Number(left)) &&
            (right === undefined ? true : Number(char) < Number(right)) &&
            (down === undefined ? true : Number(char) < Number(down))) {
            lowestPoints.push({x: x, y: y})
        }
    })
})

function GetConnectingCoords(coords:Coord):Coord[] {
    return [
        {x: coords.x, y: coords.y - 1 },
        {x: coords.x, y: coords.y + 1 },
        {x: coords.x - 1, y: coords.y },
        {x: coords.x + 1, y: coords.y },
    ]
}

function GetNumberByCoords(coords:Coord) {
    const line = lines[coords.y]
    const char = line ? [...line][coords.x] : undefined
    return char ? Number(char) : undefined
}

function GetBasin(coords:Coord[]):number {

    // First, get all connecting points in line list
    const connectingPoints = coords.map(coord => GetConnectingCoords(coord)).flat()

    // Then, filter out any points we have already looked at
    const newPoints = connectingPoints.filter(point => !coords.some(coord => coord.x === point.x && coord.y === point.y))
        
    // Then, filter out any invalid coordinates
    const validPoints = newPoints.filter(coord => GetNumberByCoords(coord) !== undefined && GetNumberByCoords(coord)! < 9)

    // Then, remove any duplicates
    const uniquePoints = validPoints.filter((v, i, a) => a.findIndex(t => v.x === t.x && v.y === t.y) === i) // https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates

    if (uniquePoints.length === 0) {
        return coords.length
    } else {
        return GetBasin([...coords, ...uniquePoints])
    }
}

// Get them basins
const basins = lowestPoints.reduce((agg, lowPoint) => [...agg, GetBasin([lowPoint])], [] as number[])

// Sort basins
const sortedAndSliced = basins.sort((a,b) => b - a).slice(0, 3)

const answer = sortedAndSliced.reduce((acc, item) => item * acc)

console.log("BASIN", answer)