export function createLine(
  cardName: string,
  setCode: string,
  cardNumber: number | null = null,
  quantity: number = 1
): string {
  let line = `${quantity} ${cardName} [${setCode}]`;
  if (cardNumber) {
    line += ` ${cardNumber}`;
  }

  return line;
}
