type DocumentRef = {
  type: 'DOCUMENT_REF'
  value: string
}

type AdditionRef = {
  type: 'ADDITION_REF'
  value: string
  prefix: DocumentRef | null
}

type LicenseRef = {
  type: 'LICENSE_REF'
  value: string
  prefix: DocumentRef | null
}

type License = {
  type: 'LICENSE'
  value: string
}

type WithExpression = {
  type: 'WITH_EXPRESSION'
  value: License | LicenseRef
  with: AdditionRef | { type: 'EXCEPTION'; value: string }
}

type CompoundExpression =
  | {
      type: 'AND_EXPRESSION'
      left: CompoundExpression
      right: CompoundExpression
    }
  | {
      type: 'OR_EXPRESSION'
      left: CompoundExpression
      right: CompoundExpression
    }
  | WithExpression

export type ParseResult = CompoundExpression

export function parse(input: string): ParseResult
