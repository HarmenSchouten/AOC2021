const text = await Deno.readTextFile("./Day10/input.txt")
const lines = text.split("\r\n")

const leftOvers:string[][] = []

const updateBracket = (input:string, chars:string[]) => {
    let charCopy:string[]|undefined = [...chars]
    switch(input){
        case '>':
            chars[chars.length -1] === '<' 
                ? charCopy.pop()
                : charCopy = undefined
            break;
        case ']':
            chars[chars.length -1] === '[' 
                ? charCopy.pop()
                : charCopy = undefined
            break;
        case '}':
            chars[chars.length -1] === '{' 
                ? charCopy.pop()
                : charCopy = undefined
            break;
        case ')':
            chars[chars.length -1] === '(' 
                ? charCopy.pop()
                : charCopy = undefined
            break;
        default:
            charCopy.push(input)
    }
    return charCopy
}

lines.forEach(line => {
    const leftOver = [...line].reduce((acc:string[] | undefined, state) => {
        if (acc !== undefined) {
            return updateBracket(state, acc)
        }
    }, [] as string[])
    leftOver && leftOvers.push(leftOver)
})

const scores = leftOvers.reduce((acc, items) => 
    [...acc, items.reverse().reduce((itemAcc, item) => {
        switch(item) {
            case '<':
                return (itemAcc * 5) + 4
            case '{':
                return (itemAcc * 5) + 3
            case '[':
                return (itemAcc * 5) + 2
            case '(':
                return (itemAcc * 5) + 1
        }
        return itemAcc
    }, 0)]
, [] as number[])

const filtered = scores.sort((a,b) => b - a).filter(item => item !== 0)

console.log(scores[Math.floor((filtered.length) / 2)])