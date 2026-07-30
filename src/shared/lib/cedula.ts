// Validates an Ecuadorian cédula (national ID) using the official
// modulo-10 checksum algorithm (Registro Civil / SRI):
// https://www.registrocivil.gob.ec
export function isValidCedulaEcuatoriana(value: string): boolean {
  if (!/^\d{10}$/.test(value)) return false

  const province = Number(value.slice(0, 2))
  if (!((province >= 1 && province <= 24) || province === 30)) return false

  // Third digit: 0-5 for a natural person's cédula (6-9 are used on RUC
  // variants for public/private entities, not on a personal cédula).
  const thirdDigit = Number(value[2])
  if (thirdDigit > 5) return false

  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2]
  let sum = 0
  for (let i = 0; i < 9; i++) {
    let product = Number(value[i]) * coefficients[i]
    if (product >= 10) product -= 9
    sum += product
  }

  const checkDigit = Number(value[9])
  const computed = sum % 10 === 0 ? 0 : 10 - (sum % 10)
  return computed === checkDigit
}
