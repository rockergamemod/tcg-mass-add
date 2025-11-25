import setData from "../data/sets.json";

const setNameToCodeMap: Record<string, string> = setData.reduce<
  Record<string, string>
>((acc, set) => {
  if (set.ptcgoCode) {
    acc[set.name] = set.ptcgoCode;
  }
  return acc;
}, {});

export function createLine(
  cardName: string,
  setName: string,
  cardNumber: number | null = null,
  quantity: number = 1
): string {
  console.log("params", cardName, setName, cardNumber, quantity);
  const setAbbreviation = setNameToCodeMap[setName];
  console.log("setAbbreviation", setAbbreviation);
  let line = `${quantity} ${cardName} [${setAbbreviation}]`;
  if (cardNumber) {
    line += ` ${cardNumber}`;
  }

  return line;
}
