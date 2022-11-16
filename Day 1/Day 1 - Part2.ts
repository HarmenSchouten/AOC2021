const text = await Deno.readTextFile("./input.txt")

const items = text.split("\r\n")

let increases = 0;

const numbers:number[] = []

items.forEach((item, index) => {
    // Current is item
    // Next is index + 1
    // After is index + 2
    const next = items[index + 1]
    const after = items[index + 2]

    if (item && next && after) {
        numbers.push((Number(item) + Number(next) + Number(after)))
    }
})

console.log(numbers)

numbers.reduce((acc, state) => {
    if (Number(state) > Number(acc)) {
        increases++
    }

    return state
})

console.log(increases)