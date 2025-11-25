export function createLine(
  cardName: string,
  setAbbreviation: string,
  cardNumber: number | null = null,
  quantity: number = 1
): string {
  let line = `${quantity} ${cardName} [${setAbbreviation}]`;
  if (cardNumber) {
    line += ` ${cardNumber}`;
  }

  return line;
}
