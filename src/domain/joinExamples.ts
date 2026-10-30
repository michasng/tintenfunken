const COMMA_FREE_PARTS = /\([^()]*\)|»[^«]*«/g

export const joinExamples = (examples: string[]): string => {
  const hasInnerComma = examples.some((example) =>
    example.replace(COMMA_FREE_PARTS, '').includes(','),
  )
  return examples.join(hasInnerComma ? '; ' : ', ')
}
