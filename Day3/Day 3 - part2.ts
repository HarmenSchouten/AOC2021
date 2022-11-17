const text = await Deno.readTextFile("./input.txt")

const items = text.split("\r\n")

const length = items.at(0)?.length

if (length) {
    let copyItems = [...items]
    for(let i = 0; i < length; i++) {
        if (copyItems.length === 1) {
            console.log("REMAINING OXYGEN", copyItems)
        }

        const zero = copyItems.filter(item => Number(item[i]) === 0)
        const one = copyItems.filter(item => Number(item[i]) === 1)

        if (zero.length === one.length) {
            copyItems = one
        } else if (zero.length > one.length) {
            copyItems = zero
        } else {
            copyItems = one
        }
    }

    console.log("OXYGEN",copyItems)
}

if (length) {
    let copyItems = [...items]
    for(let i = 0; i < length; i++) {
        if (copyItems.length === 1) {
            console.log("REMAINING SCRUBBER", copyItems)
        }

        const zero = copyItems.filter(item => Number(item[i]) === 0)
        const one = copyItems.filter(item => Number(item[i]) === 1)

        if (zero.length === one.length) {
            copyItems = zero
        } else if (zero.length > one.length) {
            copyItems = one
        } else {
            copyItems = zero
        }
    }

    console.log("SCRUBBER",copyItems)
}

const o2 = 2349
const scrubber = 1190

console.log("TOTAL", o2 * scrubber)