const text = await Deno.readTextFile("./Day8/input.txt")
const lines = text.split("\r\n")

console.log("TOTALS", lines.reduce((acc, item) => {
    const output = item.split(' | ')[1]!.split(" ")
    return acc + output.reduce((subAcc, subItem) => {
        return (subItem.trim().length === 2 || subItem.trim().length === 4 || subItem.trim().length === 3 || subItem.trim().length === 7) 
        ? subAcc + 1
        : subAcc
    }
    , 0);
}, 0))