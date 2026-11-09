import { Ajv2020 } from 'ajv/dist/2020.js'
import csafAjv_2_0 from '../lib/shared/csafAjv.js'
import csafAjv_2_1 from '../csaf_2_1/csafAjv.js'
import addUniqueItemsPrecheck, {
  hasOnlyDistinctPrimitives,
} from '../lib/shared/uniqueItems.js'

const options = { strict: false, allErrors: true, multipleOfPrecision: 6 }

/**
 * @param {Ajv2020} ajv
 */
const uniqueItemsCode = (ajv) => {
  const definition = ajv.getKeyword('uniqueItems')
  return typeof definition === 'object' && 'code' in definition
    ? definition.code
    : undefined
}

describe('hasOnlyDistinctPrimitives', function () {
  for (const [list, expected] of /** @type {const} */ ([
    [[], true],
    [['a', 'b', 'c'], true],
    [['1', 1, true, null, 'null'], true],
    [['a', 'b', 'a'], false],
    [[0, -0], false],
    [[NaN, NaN], false],
    [[null, null], false],
    [['a', {}], false],
    [['a', []], false],
    [['__proto__', '__proto__'], false],
  ])) {
    it(`returns ${expected} for ${JSON.stringify(list)}`, function () {
      expect(hasOnlyDistinctPrimitives([...list])).to.equal(expected)
    })
  }

  it('treats holes like undefined', function () {
    expect(hasOnlyDistinctPrimitives(new Array(2))).to.equal(false)
    expect(hasOnlyDistinctPrimitives(new Array(1))).to.equal(true)
  })
})

describe('addUniqueItemsPrecheck', function () {
  it('is added to both CSAF Ajv instances', function () {
    const original = uniqueItemsCode(new Ajv2020(options))
    expect(original).to.be.a('function')
    expect(uniqueItemsCode(csafAjv_2_0)).to.be.a('function')
    expect(uniqueItemsCode(csafAjv_2_0)).not.to.equal(original)
    expect(uniqueItemsCode(csafAjv_2_1)).to.be.a('function')
    expect(uniqueItemsCode(csafAjv_2_1)).not.to.equal(original)
  })

  it('does not change other Ajv instances', function () {
    const ajv = new Ajv2020(options)
    expect(addUniqueItemsPrecheck(ajv)).to.equal(true)
    expect(uniqueItemsCode(new Ajv2020(options))).not.to.equal(
      uniqueItemsCode(ajv)
    )
  })

  describe('returns the same result as Ajv without it', function () {
    const plain = new Ajv2020(options)
    const withPrecheck = new Ajv2020(options)
    addUniqueItemsPrecheck(withPrecheck)

    const $defs = {
      id_t: { type: 'string', minLength: 1 },
      object_t: { type: 'object', properties: { x: { type: 'number' } } },
    }
    const ids = { $ref: '#/$defs/id_t' }
    const schemas = {
      'items by $ref': { type: 'array', uniqueItems: true, items: ids },
      'items without type': { type: 'array', uniqueItems: true },
      'items with own type': {
        type: 'array',
        uniqueItems: true,
        items: { type: 'string', minLength: 1 },
      },
      'objects by $ref': {
        type: 'array',
        uniqueItems: true,
        items: { $ref: '#/$defs/object_t' },
      },
      'nested lists': {
        type: 'array',
        uniqueItems: true,
        items: { type: 'array', uniqueItems: true, items: ids },
      },
      'uniqueItems: false': { type: 'array', uniqueItems: false, items: ids },
      'under not': { not: { type: 'array', uniqueItems: true, items: ids } },
      'under if': {
        if: { type: 'array', uniqueItems: true, items: ids },
        then: { minItems: 3 },
        else: { maxItems: 1 },
      },
      'under anyOf': {
        anyOf: [
          { type: 'array', uniqueItems: true, items: ids },
          { type: 'array', maxItems: 2 },
        ],
      },
      'under oneOf': {
        oneOf: [
          { type: 'array', uniqueItems: true, items: ids },
          { type: 'array', minItems: 18 },
        ],
      },
    }

    /**
     * @param {number} count
     */
    const distinct = (count) =>
      Array.from({ length: count }, (_, i) => `id-${i}`)
    const lists = [
      [],
      ['a'],
      ['a', 'a'],
      ['a', 'b', 'a'],
      ['a', 'b', 'b', 'a'],
      [1, 1],
      ['1', 1],
      [0, -0],
      [{}, {}],
      [{ x: 1 }, { x: 1 }],
      [['a'], ['a']],
      ['', ''],
      ['__proto__', '__proto__'],
      distinct(15),
      distinct(16),
      distinct(17),
      [...distinct(15), 'id-0'],
      [...distinct(16), 'id-15'],
      [...distinct(20), 7],
      [...distinct(20), 7, 7],
      [...distinct(20), null, null],
      [...distinct(20), { x: 1 }, { x: 1 }],
      [...distinct(20), ['a'], ['a']],
      [...distinct(20), '__proto__', '__proto__'],
      [...distinct(20), ''],
      distinct(200),
      ['id-199', ...distinct(200)],
    ]

    for (const [name, schema] of Object.entries(schemas)) {
      it(name, function () {
        const validatePlain = plain.compile({ $defs, ...schema })
        const validateWithPrecheck = withPrecheck.compile({ $defs, ...schema })
        for (const list of lists) {
          const expected = validatePlain(list)
          expect(validateWithPrecheck(list)).to.equal(expected)
          expect(validateWithPrecheck.errors).to.deep.equal(
            validatePlain.errors
          )
        }
      })
    }
  })
})
