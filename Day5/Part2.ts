const text = await Deno.readTextFile("./Day5/input.txt")

const lines = text.split("\r\n")

const points:string[] = [] //0,0

lines.forEach(line => {
    const entries = line.trim().split("->")
    const themPoints = findPoints(entries[0].trim(), entries[1].trim())
    if (themPoints) {
        themPoints.forEach(item => points.push(item))
    }
})

const overlap = findOverlap(points)

console.log(overlap.size)

function findOverlap(points:string[]) {
    const pointsMap = new Map()
    points.forEach(point => {
        if (pointsMap.get(point) !== undefined) {
            pointsMap.set(point, pointsMap.get(point) + 1)
        } else {
            pointsMap.set(point, 1)
        }
    })

    const pointsMapEntries = [...pointsMap.entries()].sort((a,b) => b[1] - a[1])
    const overlap = pointsMapEntries.filter(item => item[1] >= 2)
    return new Map(overlap)
}

function findPoints(entryA:string, entryB: string) {
    const coordsA = entryA.split(',')
    const coordsB = entryB.split(',')

    // x === x
    if (Number(coordsA[0]) === Number(coordsB[0])) {
        const points = getPoints(Number(coordsA[1]), Number(coordsB[1]))
        return points.map(point => `${coordsA[0]},${point}`)
    } 
    // y === y
    else if (Number(coordsA[1]) === Number(coordsB[1])) {
        const points = getPoints(Number(coordsA[0]), Number(coordsB[0]))
        return points.map(point => `${point},${coordsA[1]}`)
    }
    // Diagonals
    else {
        const pointsX = getDiagonals(Number(coordsA[0]), Number(coordsB[0]))
        const pointsY = getDiagonals(Number(coordsA[1]), Number(coordsB[1]))

        const points = pointsX.map((item, index) => `${item},${pointsY[index]}`)

        return [...points, `${coordsA[0]},${coordsA[1]}`,`${coordsB[0]},${coordsB[1]}`]
    }
}

function getPoints(numberA: number, numberB:number) {
    const options = []
    if (numberA >= numberB) {
        while (numberA >= numberB) {
            options.push(numberA)
            numberA--
        }
    } else {
        while (numberB >= numberA) {
            options.push(numberB)
            numberB--
        }
    }
    return options
}

function getDiagonals(numberA: number, numberB:number) {
    const options = []
    if (numberA > numberB) {
        numberA--
        while (numberA > numberB) {
            options.push(numberA)
            numberA--
        }
    } else {
        numberA++
        while (numberA < numberB) {
            options.push(numberA)
            numberA++
        }
    }
    return options
}