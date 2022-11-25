const text = await Deno.readTextFile("./Day14/input.txt")
const lines = text.split("\r\n")

let template = [...lines[0]!]

const rulesArray = lines.filter((item, i) => i !== 0 && item.trim() != "")
const rules = rulesArray.reduce((acc, state) => {
    acc.set(state.split(" -> ")[0], state.split(" -> ")[1])
    return acc
}, new Map<string, string>())

for(let i = 0; i < 10; i++) {
    template = [...template].reduce((acc, state, index) => {
        const next = [...template][index+1]
        if(next !== undefined) {
            return [...acc, state, rules.get(state + next)!]
        } else {
            return [...acc, state]
        }
    }, [] as string[])
}

const ordered = template.reduce((acc, state) => {
    if (acc.has(state)) {
        acc.set(state, acc.get(state)! + 1)
    } else {
        acc.set(state, 1)
    }
    return acc
}, new Map<string, number>())

const sorted = [...ordered.entries()].sort((a,b) => b[1] - a[1])

console.log("ANSWER", sorted[0][1] - sorted[sorted.length - 1][1])