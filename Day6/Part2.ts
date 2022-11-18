const text = await Deno.readTextFile("./Day6/input.txt")

const lines = text.split("\r\n")

const line = lines[0].trim()

const fish = line.split(',')

const fishMap = new Map<number, number>();

for (let i = 0; i <= 8; i++) {
    fishMap.set(i, 0)
}

fish.forEach(fishy => fishMap.set(Number(fishy), fishMap.get(Number(fishy))! + 1))

console.log(fishMap)

for (let x = 0; x < 256; ++x){
    const newFish = fishMap.get(0)!

    for(let a = 0; a <= 7; ++a) {
        fishMap.set(a, fishMap.get((a + 1))!)
    }

    fishMap.set(6, fishMap.get(6)! + newFish)
    fishMap.set(8, newFish)

    const totalFish = [...fishMap.entries()].reduce((acc, state) => acc + state[1]!, 0)
    console.log(`Day #${x+1}, Fish: ${totalFish}`)
}