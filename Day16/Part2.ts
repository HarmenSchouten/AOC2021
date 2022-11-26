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

const binary = [...line].map(char => ToBinary(char)).join("")

const decPackage = DecodePackage([...binary])

console.log(EvaluateExpression(decPackage))

function DecodePackage(binary:string[]) : Package {
    const base = {} as Package;
    
    const packageVersion = GetNumber(binary.splice(0, 3).join(""))
    base.version = packageVersion

    const packageType = GetNumber(binary.splice(0, 3).join(""))
    base.type = packageType

    switch (packageType) {
        case 4:
            {
                const litValue = DecodeLiteralValue(binary)
                return {
                    version: packageVersion,
                    type: packageType,
                    literalValue: GetNumber(litValue.val),
                    remaining: litValue.remaining
                }
            }
        default:
            {
                const lengthTypeId = GetNumber(binary.splice(0, 1).join(""))
                base.lengthTypeId = lengthTypeId
                switch (lengthTypeId) {
                    case 0:
                        {
                            const l15 = GetNumber(binary.splice(0, 15).join(""))
                            base.subLength = l15
                            base.subFilter = 'bits'
                            break;
                        }
                    case 1:
                        {
                            const l11 = GetNumber(binary.splice(0, 11).join(""))
                            base.subLength = l11
                            base.subFilter = 'packages'
                            break;
                        }
                }
            }
    }

    let remaining = binary

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

function GetNumber(binary:string) {
    return parseInt(binary, 2)
}

function DecodeLiteralValue(binary:string[]):{val:string, remaining:string[]} {
    const moduleStart = binary.splice(0,1)

    let val = binary.splice(0, 4).join("")
    if (moduleStart[0] == '1') {
        val = val + DecodeLiteralValue(binary).val
    }
    return {val: val, remaining: binary}
}

function EvaluateExpression(decPackage:Package):number {
    switch(decPackage.type) {
        case 0:
            {
                return decPackage.subPackages!.reduce((acc, item) => {
                    return acc += EvaluateExpression(item)
                }, 0)
            }
        case 1:
            {
                return decPackage.subPackages!.reduce((acc, item) => {
                    return acc *= EvaluateExpression(item)
                }, 1)
            }
        case 2:
            {
                return decPackage.subPackages!.reduce((acc, item) => {
                    const val = EvaluateExpression(item)
                    return val < acc ? val : acc
                }, Number.MAX_SAFE_INTEGER)
            }
        case 3:
            {
                return decPackage.subPackages!.reduce((acc, item) => {
                    const val = EvaluateExpression(item)
                    return val > acc ? val : acc
                }, -Number.MAX_SAFE_INTEGER)
            }
        case 4:
            return decPackage.literalValue!
        case 5:
            return EvaluateExpression(decPackage.subPackages![0]) > EvaluateExpression(decPackage.subPackages![1]) ? 1 : 0
        case 6: 
            return EvaluateExpression(decPackage.subPackages![0]) < EvaluateExpression(decPackage.subPackages![1]) ? 1 : 0
        case 7:
            return EvaluateExpression(decPackage.subPackages![0]) === EvaluateExpression(decPackage.subPackages![1]) ? 1 : 0
        default:
            console.warn("Huh what")
            return 0;
    }
}