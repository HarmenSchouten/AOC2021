const text = await Deno.readTextFile("./input.txt")

const items = text.split("\r\n")

let length = items.at(0)?.length;

if(length) {
    const commonBits:Number[] = []

    const unCommonBites = []

    for (let i = 0; i < length; i++) {
        const bits:Number[] = []

        items.forEach(item => bits.push(Number(item[i])))

        const map = new Map()
        bits.forEach(item => {
            if (!map.has(item)) {
                map.set(item, 1)
            } else {
                map.set(item, map.get(item) + 1)
            }
        })

        const sorted =[...map.entries()].sort((a, b) => b[1] - a[1])
       
    
        commonBits.push(sorted.at(0)![0])

        const reverse = sorted.reverse()
        unCommonBites.push(reverse.at(0)?.[0])
    }

    console.log("COMMON", commonBits.reduce((acc, item) => {
        return acc.toString() + item.toString()
    }, ""))

    console.log("UNCOMMON", unCommonBites.reduce((acc, item) => {
        return acc.toString() + item.toString()
    }, ""))
}

const common = 3069
const uncommon = 1026

console.log("POWER", 3069 * 1026)