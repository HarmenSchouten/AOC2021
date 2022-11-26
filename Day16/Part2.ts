/**
 * Define the package type
 */
type Package = {
    version: number
    type: number
    lengthTypeId?: number
    literalValue?: number
    subLength?: number
    subFilter?: 'bits' | 'packages'
    subPackages?: Package[]
    remaining?: string[]
}

const text = await Deno.readTextFile("./Day16/input.txt")
const line = text.split("\r\n")[0]!

/**
 * Parse the given input to a binary array
 */
const binary = [...line].map(char => ToBinary(char)).join("")

/**
 * Decode and evaluate the input
 */
console.log("Answer", EvaluateExpression(DecodePackage([...binary])))

/**
 * Decode a binary string to a package typed object.
 * This function is being called recursively to add subpackages to a 
 * parent package
 * @param binary The input binary string
 * @returns A package object
 */
function DecodePackage(binary:string[]) : Package {
    // Setup the base
    const base = {} as Package;
    base.version = GetNumber(binary.splice(0, 3).join(""))
    base.type = GetNumber(binary.splice(0, 3).join(""))

    switch (base.type) {
        case 4:
            {
                const litValue = DecodeLiteralValue(binary)
                return {
                    ...base,
                    literalValue: GetNumber(litValue.val),
                    remaining: litValue.remaining
                }
            }
        default:
            {
                base.lengthTypeId = GetNumber(binary.splice(0, 1).join(""))
                switch (base.lengthTypeId) {
                    case 0:
                        {
                            base.subLength = GetNumber(binary.splice(0, 15).join(""))
                            base.subFilter = 'bits'
                            break;
                        }
                    case 1:
                        {
                            base.subLength = GetNumber(binary.splice(0, 11).join(""))
                            base.subFilter = 'packages'
                            break;
                        }
                }
            }
    }

    let remaining = binary

    // There's a better way of doing this, however I don't want to
    // think of one right now. 
    if (base.subLength) {
        if (base.subFilter === 'bits') {
            base.subPackages = []
            let count = base.subLength
            
            while (count !== 0) {
                const a = remaining.length
                const sub = DecodePackage([...remaining])
                const b = sub.remaining?.length
                remaining = [...sub.remaining ?? []]
                base.subPackages.push(sub)
                count = count - (a - (b ?? 0))
    
                if (count === 0) {
                    break;
                }
            }
        } else {
            while(base.subPackages?.length !== base.subLength) {
                base.subPackages = []
                
                while (base.subPackages.length !== base.subLength) {
                    const sub = DecodePackage([...remaining])
                    remaining = [...sub.remaining ?? []]
                    base.subPackages.push(sub)
                    
                    if (base.subPackages.length === base.subLength) {
                        break;
                    }
                }
            }
        }
    }
    
    return {...base, remaining: remaining}
}

/**
 * Parse a given char to its binary representation. Again,
 * there's most likely a way better way of parsing the input
 * to a binary string. Maybe another time...
 * @param char The input character
 * @returns A string with 4 binary digits
 */
function ToBinary(char:string) {
    switch(char) {
        case '0':
            return '0000'
        case '1':
            return '0001'
        case '2':
            return '0010'
        case '3':
            return '0011'
        case '4':
            return '0100'
        case '5':
            return '0101'
        case '6':
            return '0110'
        case '7':
            return '0111'
        case '8':
            return '1000'
        case '9':
            return '1001'
        case 'A':
            return '1010'
        case 'B':
            return '1011'
        case 'C':
            return '1100'
        case 'D':
            return '1101'
        case 'E':
            return '1110'
        case 'F':
            return '1111'
        default: 
            return ''
    }
}

/**
 * Get a number from a binary string
 * @param binary The input binary string
 * @returns A number
 */
function GetNumber(binary:string) {
    return parseInt(binary, 2)
}

/**
 * Decode a literal value element, returning the value
 * and the remaining elements
 * @param binary The input binary string
 * @returns The value of the literal element and the remaining 
 * binary string
 */
function DecodeLiteralValue(binary:string[]):{val:string, remaining:string[]} {
    const moduleStart = binary.splice(0,1)

    let val = binary.splice(0, 4).join("")
    if (moduleStart[0] == '1') {
        val = val + DecodeLiteralValue(binary).val
    }
    return {val: val, remaining: binary}
}

/**
 * Evaluate the expression of a packet using a recursive mechanism
 * @param packet A package
 * @returns A number containing the result of all evaluations
 */
function EvaluateExpression(packet:Package):number {
    switch(packet.type) {
        case 0:
            {
                return packet.subPackages!.reduce((acc, item) => {
                    return acc += EvaluateExpression(item)
                }, 0)
            }
        case 1:
            {
                return packet.subPackages!.reduce((acc, item) => {
                    return acc *= EvaluateExpression(item)
                }, 1)
            }
        case 2:
            {
                return packet.subPackages!.reduce((acc, item) => {
                    const val = EvaluateExpression(item)
                    return val < acc ? val : acc
                }, Number.MAX_SAFE_INTEGER)
            }
        case 3:
            {
                return packet.subPackages!.reduce((acc, item) => {
                    const val = EvaluateExpression(item)
                    return val > acc ? val : acc
                }, -Number.MAX_SAFE_INTEGER)
            }
        case 4:
            return packet.literalValue!
        case 5:
            return EvaluateExpression(packet.subPackages![0]) > EvaluateExpression(packet.subPackages![1]) ? 1 : 0
        case 6: 
            return EvaluateExpression(packet.subPackages![0]) < EvaluateExpression(packet.subPackages![1]) ? 1 : 0
        case 7:
            return EvaluateExpression(packet.subPackages![0]) === EvaluateExpression(packet.subPackages![1]) ? 1 : 0
        default:
            console.warn("Huh what")
            return 0;
    }
}