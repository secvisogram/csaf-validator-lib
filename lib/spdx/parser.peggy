license_expression = _ c:compound_expression _ { return c }

_ = [ \t\r\n]*

idstring = [a-zA-Z0-9-.]+

license_id = idstring

license_exception_id = idstring { return { type: 'EXCEPTION', value: text() } }

document_ref = ("DocumentRef-" id:idstring _ ":" _ {
  return {
    type: 'DOCUMENT_REF',
    value: id.join('')
  }
})

license_ref = prefix:document_ref? "LicenseRef-" id:idstring {
  return {
    type: 'LICENSE_REF',
    value: id.join(''),
    prefix
  }
}

addition_ref = prefix:document_ref? "AdditionRef-" id:idstring {
  return {
    type: 'ADDITION_REF',
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

with_expression = s:simple_expression w:(_ ("WITH" / "with") _ value:addition_expression {
  return value
})? {
  return {
    type: 'WITH_EXPRESSION',
    value: s,
    with: w
  }
}

primary_expression = ("(" _ c:compound_expression _ ")" { return c }) / with_expression

and_expression = head:primary_expression tail:(_ ("AND" / "and") _ right:primary_expression { return right })* {
  return tail.reduce(
    (left, right) => ({ type: 'AND_EXPRESSION', left, right }),
    head
  )
}

compound_expression = head:and_expression tail:(_ ("OR" / "or") _ right:and_expression { return right })* {
  return tail.reduce(
    (left, right) => ({ type: 'OR_EXPRESSION', left, right }),
    head
  )
}
