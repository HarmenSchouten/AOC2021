type TargetArea = {
    minX: number
    maxX: number
    minY: number
    maxY: number
}

type Coord = {
    x: number
    y: number
}

const text = await Deno.readTextFile("./Day17/input.txt")
const line = text.split("\r\n")[0]!.split(" ").filter(item => item.startsWith("x") || item.startsWith("y"))

const targetArea = SetTargetArea(line)

const probeLoc = {x: 0, y: 0} as Coord

let y = 0;

for(let i = 0; i < targetArea.maxX + 1; i++)
for(let j = targetArea.minY; j <= -(targetArea.minY); j++) {
    const originalVelocity = {x: i, y: j} as Coord
    let velocity = originalVelocity
    let coord = probeLoc;
    let maxY = 0;
    while(coord.x <= targetArea.maxX && coord.y >= targetArea.minY){

        coord = {
            x: coord.x + velocity.x,
            y: coord.y + velocity.y
        }

        velocity = {
            x: velocity.x > 0 ? velocity.x - 1 : 0,
            y: velocity.y - 1
        }

        maxY =  coord.y > maxY ? coord.y : maxY

        if (coord.x >= targetArea.minX && coord.x <= targetArea.maxX && coord.y >= targetArea.minY && coord.y <= targetArea.maxY) {
            y = maxY > y ? maxY : y
            break;
        }
    }
}

console.log("Answer", y)


function SetTargetArea(input:string[]):TargetArea {
    const x = input.find(item => item.startsWith("x"))?.split("=")[1].split('..').map(item => item.replace(',',''))!
    const y = input.find(item => item.startsWith("y"))?.split("=")[1].split('..').map(item => item.replace(',',''))!

    return {
        minX: Number(x[0]),
        maxX: Number(x[1]),
        minY: Number(y[0]),
        maxY: Number(y[1])
    } as TargetArea
}