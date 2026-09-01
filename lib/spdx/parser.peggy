/*
  Peggy grammar for SPDX license expressions (e.g. "MIT OR (Apache-2.0 WITH
  LLVM-exception)"), covering simple/LicenseRef/AdditionRef ids, WITH
  exceptions, and AND/OR compound expressions with parenthesized grouping.
 */

license_expression = _ c:compound_expression _ { return c }

_ = [ \t\r\n]*

S = [ \t\r\n]+

idstring = [a-zA-Z0-9-.]+

license_id = idstring

license_exception_id = idstring { return { type: 'EXCEPTION', value: text() } }

document_ref = (keyword:"DocumentRef"i "-" id:idstring _ ":" _ {
  return {
    type: 'DOCUMENT_REF',
    keyword,
    value: id.join('')
  }
})

license_ref = prefix:document_ref? keyword:"LicenseRef"i "-" id:idstring {
  return {
    type: 'LICENSE_REF',
    keyword,
    value: id.join(''),
    prefix
  }
}

addition_ref = prefix:document_ref? keyword:"AdditionRef"i "-" id:idstring {
  return {
    type: 'ADDITION_REF',
    keyword,
    value: id.join(''),
    prefix
  }
}

simple_expression = license_ref / (license_id "+" / license_id) {
  return {
    type: 'LICENSE',
    value: text()
  }
}

addition_expression = (addition_ref / license_exception_id)

with_expression = s:simple_expression w:(S ("WITH" / "with") S value:addition_expression {
  return value
})? {
  return {
    type: 'WITH_EXPRESSION',
    value: s,
    with: w
  }
}

primary_expression = ("(" _ c:compound_expression _ ")" { return c }) / with_expression

and_expression = head:primary_expression tail:(S ("AND" / "and") S right:primary_expression { return right })* {
  return tail.reduce(
    (left, right) => ({ type: 'AND_EXPRESSION', left, right }),
    head
  )
}

compound_expression = head:and_expression tail:(S ("OR" / "or") S right:and_expression { return right })* {
  return tail.reduce(
    (left, right) => ({ type: 'OR_EXPRESSION', left, right }),
    head
  )
}
