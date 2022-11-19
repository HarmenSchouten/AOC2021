const text = await Deno.readTextFile("./Day10/input.txt")
const lines = text.split("\r\n")

const illegalChars:string[] = []

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
    let chars:string[] = [];
    [...line].every(char => {
        const updatedList = updateBracket(char, chars)
        if (updatedList === undefined) {
            illegalChars.push(char)
            return false;
        } else {
            chars = updatedList
            return true
        }
    })
})

console.log(illegalChars)

const answer = illegalChars.reduce((acc, state) => {
    switch (state) {
        case ')':
            return acc + 3
        case ']':
            return acc + 57
        case '}':
            return acc + 1197
        case '>':
            return acc + 25137
        default:
            return acc
    }
}, 0)

console.log(answer)