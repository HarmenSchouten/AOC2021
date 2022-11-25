type HashMap<T> = { [key: string]: T }

const text = await Deno.readTextFile("./Day14/input.txt")
const lines = text.split("\r\n")

const template = [...lines[0]!]

const rulesArray = lines.filter((item, i) => i !== 0 && item.trim() != "")
const rules = rulesArray.reduce((acc, state) => {
    acc.set(state.split(" -> ")[0], state.split(" -> ")[1])
    return acc
}, new Map<string, string>())

const basePairs = template.reduce((acc, curr, index, arr) => {
    const next = arr[index + 1]
    if (next) {
        acc.set(`${curr}${next}`, (acc.get(`${curr}${next}`) ?? 0) + 1)
    } else {
        acc.set(`${curr}`, 1)
    }
   
    return acc
}, new Map<string, number>())


let pairs = basePairs
for (let i = 0; i < 40; i++) {
    const updatedPairs = new Map<string, number>()
    pairs.forEach((value, key) => {
        if ([...key].length === 2) {
            const ruleVal = rules.get(key)
            if (ruleVal) {
                const a = [...key][0] + ruleVal
                const b = ruleVal + [...key][1]
                updatedPairs.set(a, (updatedPairs.get(a) ?? 0) + value)
                updatedPairs.set(b, (updatedPairs.get(b) ?? 0) + value)
            }
        }
    })

    pairs = updatedPairs
}

const elementCounts = new Map<string, number>()
pairs.forEach((value, key) => {
    const a = [...key][0]
    elementCounts.set(a, (elementCounts.get(a) ?? 0) + value)
})

console.log(pairs)

const baseArr = [...basePairs.entries()]
const last = baseArr[baseArr.length - 1]
elementCounts.set(last[0], (elementCounts.get(last[0]) ?? 0) + 1)

const sorted = [...elementCounts.entries()].sort((a,b) => b[1] - a[1])

console.log(sorted[0][1] - sorted[sorted.length - 1][1])