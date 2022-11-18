const text = await Deno.readTextFile("./Day7/input.txt")

const numbers = text.split("\r\n")[0]!.split(',')

const sorted = numbers.sort((a,b) => Number(a) - Number(b))

const fuelMap = new Map<number, number>()

for(let i = 0; i < sorted.length; i++) {
    fuelMap.set(i, sorted.reduce((acc, item) => {
        if (Number(item) === Number(sorted[i])) {
            return acc
        } else if (Number(item) > Number(sorted[i])) {
            return acc + GetFuel(Number(item) - Number(sorted[i]))
        } else {
            return acc + GetFuel(Number(sorted[i]) - Number(item))
        }
    },0))
}

function GetFuel(number:number) {
    let fuel = 0;
    for(let i = 0; i < number; i++) {
        fuel = fuel + (1 + i)
    }
    return fuel
}

const sortMap = [...fuelMap.entries()].sort((a, b) => a[1] - b[1])

console.log("LEANEST SORTING INDEX", sortMap[0])