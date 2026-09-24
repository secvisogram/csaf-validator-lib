type DocumentRef = {
  type: 'DOCUMENT_REF'
  keyword: string
  value: string
}

export type AdditionRef = {
  type: 'ADDITION_REF'
  value: string
  keyword: string
  prefix: DocumentRef | null
}

export type LicenseRef = {
  type: 'LICENSE_REF'
  value: string
  keyword: string
  prefix: DocumentRef | null
}

type License = {
  type: 'LICENSE'
  value: string
}

/**
 * An expression that contains a license and an optional exception (`with`).
 */
type SimpleExpression = {
  type: 'SIMPLE_EXPRESSION'
  value: License | LicenseRef
  with: AdditionRef | { type: 'EXCEPTION'; value: string } | null
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
  | SimpleExpression

export type ParseResult = CompoundExpression

export function parse(input: string): ParseResult
