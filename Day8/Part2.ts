const text = await Deno.readTextFile("./Day8/input.txt")
const lines = text.split("\r\n")

const CombineDistinct = (a:string, b:string):string => [...(a + b)].reduce((acc, state) => [...acc].includes(state) ? acc : acc + state, '');

const Minus = (a: string, b:string):string => [...a].reduce((acc, state) => [...b].includes(state) ? acc : state, '')

function getByValue(map:Map<number, string>, searchValue:string) {
    for (const [key, value] of map.entries()) {
      if (value === searchValue)
        return key;
    }
  }

console.log("TOTALS", lines.reduce((acc, line) => {
    const signalPatterns = line.split(' | ')[0].split(" ")
    const outputValues = line.split(' | ')[1].split(" ")

    // Basics
    const uno = signalPatterns.find(item => item.trim().length === 2)!
    const quattro = signalPatterns.find(item => item.trim().length === 4)!
    const sette = signalPatterns.find(item => item.trim().length === 3)!
    const otto = signalPatterns.find(item => item.trim().length === 7)!
    
    // Deductions
    const a = Minus(sette, uno)

    // Mappie
    const segmentMap = new Map<number, string>()
    segmentMap.set(0, '') // 6
    segmentMap.set(1, uno) // 2
    segmentMap.set(2, '') // 5
    segmentMap.set(3, '') // 5
    segmentMap.set(4, quattro) // 4
    segmentMap.set(5, '') // 5
    segmentMap.set(6, '') // 5
    segmentMap.set(7, sette) // 3
    segmentMap.set(8, otto) // 7
    segmentMap.set(9, '') // 6


    console.log(uno, quattro, sette, otto, a,)

    return acc + outputValues.reduce((subAcc, value) => subAcc + getByValue(segmentMap, value)!, 0)
}, 0))