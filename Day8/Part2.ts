const text = await Deno.readTextFile("./Day8/input.txt")
const lines = text.split("\r\n")

const CombineDistinct = (a:string, b:string):string => [...(a + b)].reduce((acc, state) => [...acc].includes(state) ? acc : acc + state, '');

const Minus = (a: string, b:string):string => [...a].reduce((acc, state) => [...b].includes(state) ? acc : acc + state, '')

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

    const seis = signalPatterns.filter(item => item.length === 6)
    const cinqs = signalPatterns.filter(item => item.length === 5)
    
    // Deductions
    const a = Minus(sette, uno)
    const nuvo = seis.filter(item => [...quattro].every(char => [...item].includes(char)))[0]
    const e = Minus(otto, nuvo)
    const sei = seis.filter(item => item !== nuvo && cinqs.filter(cinq => [...cinq].every(char => [...Minus(item, e)].includes(char))).length > 0)[0]
    const zero = seis.filter(item => item !== nuvo && item !== sei)[0]
    const d = Minus(otto, zero)
    const g = Minus(zero, CombineDistinct(CombineDistinct(quattro, a), e))
    const cinq = cinqs.filter(item => [...(item + e)].every(char => [...sei].includes(char)))[0]!
    const c = Minus(otto, sei)
    const due = cinqs.filter(item => item !== cinq && [...item].includes(e))[0]
    const tres = cinqs.filter(item => item !== due && item !== cinq)[0]
    
    // Mappie
    const segmentMap = new Map<number, string>()
    segmentMap.set(0, zero) // 6
    segmentMap.set(1, uno) // 2
    segmentMap.set(2, due) // 5
    segmentMap.set(3, tres) // 5
    segmentMap.set(4, quattro) // 4
    segmentMap.set(5, cinq) // 5
    segmentMap.set(6, sei) // 6
    segmentMap.set(7, sette) // 3
    segmentMap.set(8, otto) // 7
    segmentMap.set(9, nuvo) // 6

    // For each item value, the bits are shuffled

    return acc + outputValues.reduce((subAcc, value) => subAcc + getByValue(segmentMap, value)!, 0)
}, 0))