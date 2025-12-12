import setData from "../data/sets.json";

const setNameToCodeMap: Record<string, string> = setData.reduce<
  Record<string, string>
>((acc, set) => {
  if (set.ptcgoCode) {
    acc[set.name] = set.ptcgoCode;
  }
  return acc;
}, {});

export const setNameToPrintedTotal: Record<string, number> = setData.reduce<
  Record<string, number>
>((acc, set) => {
  acc[set.name] = set.printedTotal;
  return acc;
}, {});

export function createLine(
  cardName: string,
  setCode: string,
  cardNumber: number | null = null,
  quantity: number = 1
): string {
  console.log("params", cardName, setCode, cardNumber, quantity);
  // const setAbbreviation = setNameToCodeMap[setName];
  // console.log("setAbbreviation", setAbbreviation);
  let line = `${quantity} ${cardName} [${setCode}]`;
  if (cardNumber) {
    line += ` ${cardNumber}`;
  }

  return line;
}
