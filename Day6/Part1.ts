const text = await Deno.readTextFile("./Day6/input.txt")

const lines = text.split("\r\n")

const line = lines[0].trim()

let fish = line.split(',')

console.log(fish.length)

for(let i = 0; i < 80; i++) {
    const copyFish = [...fish]
    fish.forEach((item, index) => {
        switch(Number(item)) {
            case 0: 
                copyFish.splice(index, 1, '6')
                copyFish.push('8')
                break;
            default:
                copyFish.splice(index, 1, (Number(item) - 1).toString())
                break;
        }
    })
    fish = copyFish
}

console.log(fish.length)