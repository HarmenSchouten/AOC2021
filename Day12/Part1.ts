const text = await Deno.readTextFile("./Day12/input.txt")
const lines = text.split("\r\n")

const input = lines.reduce((acc, line) => [...acc, line.split('-')], [] as string[][])

const starts = input.filter(line => line.includes("start")).map(item => item.sort((a, b) => b.length - a.length))
const rest = input.filter(line => !line.includes("start"))

console.log(starts)

function GetNextPathSections(start:string[]) {
    const lastItem = start[start.length - 1]

    if (lastItem !== 'end') {
        const matchingItems = rest.filter(item => item[0] === lastItem || item[1] === lastItem)

        return matchingItems.reduce((acc, matchingItem) => {

            const item = getItem(lastItem, matchingItem)
            if (isLowerCase(item) && hasItem(item, [...start])) {
                return [...acc]
            } else {
                return [...acc, [...start, item]]
            }
        }, [] as string[][])
    }
}

function getItem(check:string, match:string[]) {
    return match[0] === check ? match[1] : match[0]
}

function isLowerCase(char:string) {
    return char === char.toLowerCase()
}

function hasItem(char:string, input:string[]) {
    return input.includes(char)
}

const possiblePaths = starts.reduce((acc, start) => {
    let paths:string[][] = [[...start]]

    while(!paths.every(path => path[path.length - 1] === "end")) {
        const open = paths.filter(item => item[item.length - 1] !== "end")
        const closed = paths.filter(item => item[item.length - 1] === "end")

        paths = [
            ...closed,
            ...open.reduce((acc, path) => {
                const next = GetNextPathSections(path)
                if (next !== undefined) {
                    return [...acc, ...next]
                }
                return acc
            }, [] as string[][])
        ]
    }

    return [...acc, ...paths]
}, [] as string[][])

console.log("NUMBER OF PATHS", possiblePaths.length)