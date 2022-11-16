const text = await Deno.readTextFile("./input.txt")

const items = text.split("\r\n")

let depth = 0;
let horizontal = 0;

items.forEach(item => {
    const cmdValue = item.split(' ')

    const command = cmdValue.at(0)
    const value = cmdValue.at(1)

    switch(command) {
        case 'forward':
            horizontal = horizontal + Number(value)
            break;
        case 'down':
            depth = depth + Number(value)
            break;
        case 'up':
            depth = depth - Number(value)
            break;
    }
})

console.log(depth * horizontal)