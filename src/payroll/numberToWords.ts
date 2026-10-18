/**
 * Converts a numeric amount to Indian currency words format.
 * e.g., 30758.07 -> "Rupees Thirty Thousand Seven Hundred Fifty-Eight and Seven Paise Only"
 */
const ONES = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const TENS = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

function convertBelowThousand(n: number): string {
  let str = '';
  if (n >= 100) {
    str += ONES[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n >= 20) {
    str += TENS[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + ONES[n % 10] : '');
  } else if (n > 0) {
    str += ONES[n];
  }
  return str.trim();
}

export function numberToWordsINR(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) return 'Rupees Zero Only';
  if (amount === 0) return 'Rupees Zero Only';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const rupees = Math.floor(absAmount);
  const paise = Math.round((absAmount - rupees) * 100);

  let words = '';

  const crore = Math.floor(rupees / 10000000);
  let rem = rupees % 10000000;

  const lakh = Math.floor(rem / 100000);
  rem = rem % 100000;

  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;

  const hundreds = rem;

  if (crore > 0) {
    words += convertBelowThousand(crore) + ' Crore ';
  }
  if (lakh > 0) {
    words += convertBelowThousand(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    words += convertBelowThousand(thousand) + ' Thousand ';
  }
  if (hundreds > 0) {
    words += convertBelowThousand(hundreds) + ' ';
  }

  words = words.trim();
  if (!words) {
    words = 'Zero';
  }

  let result = (isNegative ? 'Minus Rupees ' : 'Rupees ') + words;

  if (paise > 0) {
    result += ' and ' + convertBelowThousand(paise) + ' Paise';
  }

  result += ' Only';
  return result;
}
