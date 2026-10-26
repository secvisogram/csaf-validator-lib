import { mandatoryTest_6_1_27_13 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_27_13.js'

describe('mandatoryTest_6_1_27_13', function () {
  it('only runs on documents matching the input schema', function () {
    expect(
      mandatoryTest_6_1_27_13({
        document: 'invalid json',
        vulnerabilities: [
          {
            product_status: {
              fixed: ['CSAFPID-9080700'],
            },
          },
        ],
      }).isValid
    ).to.equal(true)
  })

  it('only runs on csaf_security_advisory documents', function () {
    expect(
      mandatoryTest_6_1_27_13({
        document: {
          category: 'csaf_vex',
        },
        vulnerabilities: [
          {
            product_status: {
              fixed: ['CSAFPID-9080700'],
            },
          },
        ],
      }).isValid
    ).to.equal(true)
  })

  it('skips fixed product ids that have no definition in the product tree', function () {
    const result = mandatoryTest_6_1_27_13({
      document: { category: 'csaf_security_advisory' },
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-UNDEFINED'],
          },
        },
      ],
    })
    expect(result.isValid).to.equal(true)
    expect(result.errors.length).to.equal(0)
  })

  it('fails when product paths differ in more than one component', function () {
    // Both the `installed_on` target for ProductB and the one for ProductA
    // differ at the same time, so P1 and P2 do not count as corresponding
    // products even though each individual pair of targets corresponds.
    const result = mandatoryTest_6_1_27_13({
      document: { category: 'csaf_security_advisory' },
      product_tree: {
        branches: [
          {
            category: 'product_name',
            name: 'Product A',
            branches: [
              {
                category: 'product_version',
                name: '3.0',
                product: { product_id: 'CSAFPID-A1' },
              },
              {
                category: 'product_version',
                name: '3.1',
                product: { product_id: 'CSAFPID-A2' },
              },
            ],
          },
          {
            category: 'product_name',
            name: 'Product B',
            branches: [
              {
                category: 'product_version',
                name: '2.0',
                product: { product_id: 'CSAFPID-B1' },
              },
              {
                category: 'product_version',
                name: '2.1',
                product: { product_id: 'CSAFPID-B2' },
              },
            ],
          },
        ],
        product_paths: [
          {
            beginning_product_reference: 'CSAFPID-C0',
            full_product_name: { product_id: 'CSAFPID-P1' },
            subpaths: [
              {
                category: 'installed_on',
                next_product_reference: 'CSAFPID-B1',
              },
              {
                category: 'installed_on',
                next_product_reference: 'CSAFPID-A1',
              },
            ],
          },
          {
            beginning_product_reference: 'CSAFPID-C0',
            full_product_name: { product_id: 'CSAFPID-P2' },
            subpaths: [
              {
                category: 'installed_on',
                next_product_reference: 'CSAFPID-B2',
              },
              {
                category: 'installed_on',
                next_product_reference: 'CSAFPID-A2',
              },
            ],
          },
        ],
      },
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-P2'],
            known_affected: ['CSAFPID-P1'],
          },
        },
      ],
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors).to.deep.equal([
      {
        instancePath: '/vulnerabilities/0/product_status/fixed/0',
        message:
          'No corresponding version of product "CSAFPID-P2" is listed as affected (known_affected) in the same vulnerability',
      },
    ])
  })

  it('passes when a fixed product resolves an installed_with relationship nested behind another subpath', function () {
    // FULL = App 1.0 installed_on Host 2.0 installed_with Hotfix H1.
    // BASE = App 1.0 installed_on Host 2.0 (i.e. FULL without the hotfix).
    // Fixing the hotfix (first_fixed) is only valid if BASE (the product
    // path leading up to, but not including, the `installed_with`
    // relationship) is listed as known_affected.
    const result = mandatoryTest_6_1_27_13({
      document: { category: 'csaf_security_advisory' },
      product_tree: {
        full_product_names: [{ product_id: 'CSAFPID-HOTFIX1' }],
        product_paths: [
          {
            beginning_product_reference: 'CSAFPID-APP1',
            full_product_name: { product_id: 'CSAFPID-BASE1' },
            subpaths: [
              {
                category: 'installed_on',
                next_product_reference: 'CSAFPID-HOST1',
              },
            ],
          },
          {
            beginning_product_reference: 'CSAFPID-APP1',
            full_product_name: { product_id: 'CSAFPID-FULL1' },
            subpaths: [
              {
                category: 'installed_on',
                next_product_reference: 'CSAFPID-HOST1',
              },
              {
                category: 'installed_with',
                next_product_reference: 'CSAFPID-HOTFIX1',
              },
            ],
          },
        ],
      },
      vulnerabilities: [
        {
          product_status: {
            first_fixed: ['CSAFPID-HOTFIX1'],
            known_affected: ['CSAFPID-BASE1'],
          },
        },
      ],
    })
    expect(result.isValid).to.equal(true)
    expect(result.errors.length).to.equal(0)
  })

  it('fails when a nested installed_with relationship has no matching corresponding product', function () {
    const result = mandatoryTest_6_1_27_13({
      document: { category: 'csaf_security_advisory' },
      product_tree: {
        full_product_names: [{ product_id: 'CSAFPID-HOTFIX1' }],
        product_paths: [
          {
            beginning_product_reference: 'CSAFPID-APP1',
            full_product_name: { product_id: 'CSAFPID-BASE1' },
            subpaths: [
              {
                category: 'installed_on',
                next_product_reference: 'CSAFPID-HOST1',
              },
            ],
          },
          {
            beginning_product_reference: 'CSAFPID-APP1',
            full_product_name: { product_id: 'CSAFPID-FULL1' },
            subpaths: [
              {
                category: 'installed_on',
                next_product_reference: 'CSAFPID-HOST1',
              },
              {
                category: 'installed_with',
                next_product_reference: 'CSAFPID-HOTFIX1',
              },
            ],
          },
        ],
      },
      vulnerabilities: [
        {
          product_status: {
            first_fixed: ['CSAFPID-HOTFIX1'],
            known_affected: ['CSAFPID-APP1'],
          },
        },
      ],
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors).to.deep.equal([
      {
        instancePath: '/vulnerabilities/0/product_status/first_fixed/0',
        message:
          'No corresponding version of product "CSAFPID-HOTFIX1" is listed as affected (known_affected) in the same vulnerability',
      },
    ])
  })

  it('does not treat unrelated top-level leaves as corresponding products', function () {
    // Two top-level leaves (empty ancestry) for entirely different products
    // must not be considered "corresponding" just because they share the
    // same (empty) ancestor path.
    const result = mandatoryTest_6_1_27_13({
      document: { category: 'csaf_security_advisory' },
      product_tree: {
        branches: [
          {
            category: 'product_name',
            name: 'Product A',
            product: { product_id: 'CSAFPID-PA' },
          },
          {
            category: 'product_name',
            name: 'Product B',
            product: { product_id: 'CSAFPID-PB' },
          },
        ],
      },
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-PA'],
            known_affected: ['CSAFPID-PB'],
          },
        },
      ],
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors).to.deep.equal([
      {
        instancePath: '/vulnerabilities/0/product_status/fixed/0',
        message:
          'No corresponding version of product "CSAFPID-PA" is listed as affected (known_affected) in the same vulnerability',
      },
    ])
  })

  it('does not treat a product_name leaf and a sibling product_version leaf as corresponding', function () {
    const result = mandatoryTest_6_1_27_13({
      document: { category: 'csaf_security_advisory' },
      product_tree: {
        branches: [
          {
            category: 'vendor',
            name: 'Vendor',
            branches: [
              {
                category: 'product_name',
                name: 'Sibling Product',
                product: {
                  product_id: 'CSAFPID-SIB',
                },
              },
              {
                category: 'product_name',
                name: 'Product A',
                branches: [
                  {
                    category: 'product_version',
                    name: '1.0',
                    product: {
                      product_id: 'CSAFPID-PA1',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-PA1'],
            known_affected: ['CSAFPID-SIB'],
          },
        },
      ],
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors).to.deep.equal([
      {
        instancePath: '/vulnerabilities/0/product_status/fixed/0',
        message:
          'No corresponding version of product "CSAFPID-PA1" is listed as affected (known_affected) in the same vulnerability',
      },
    ])
  })

  it('does not crash on cyclic product paths and still reports missing correspondences', function () {
    // PA references PB via `installed_on` and PB references PA back,
    // forming a cycle. The test must terminate and not throw/stack overflow.
    const result = mandatoryTest_6_1_27_13({
      document: { category: 'csaf_security_advisory' },
      product_tree: {
        product_paths: [
          {
            beginning_product_reference: 'CSAFPID-A',
            full_product_name: { product_id: 'CSAFPID-PA' },
            subpaths: [
              {
                category: 'installed_on',
                next_product_reference: 'CSAFPID-PB',
              },
            ],
          },
          {
            beginning_product_reference: 'CSAFPID-B',
            full_product_name: { product_id: 'CSAFPID-PB' },
            subpaths: [
              {
                category: 'installed_on',
                next_product_reference: 'CSAFPID-PA',
              },
            ],
          },
        ],
      },
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-PA'],
            known_affected: [],
          },
        },
      ],
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors).to.deep.equal([
      {
        instancePath: '/vulnerabilities/0/product_status/fixed/0',
        message:
          'No corresponding version of product "CSAFPID-PA" is listed as affected (known_affected) in the same vulnerability',
      },
    ])
  })

  it('passes when the fixed product itself is the combined product path containing the installed_with relationship', function () {
    // FULL1 = App 1.0 installed_with Hotfix H1 (the fixed product id *is*
    // the combined product path entry). The corresponding affected product
    // is the path leading up to (but not including) the relationship, i.e.
    // plain "App 1.0".
    const result = mandatoryTest_6_1_27_13({
      document: { category: 'csaf_security_advisory' },
      product_tree: {
        product_paths: [
          {
            beginning_product_reference: 'CSAFPID-APP4',
            full_product_name: { product_id: 'CSAFPID-FULL4' },
            subpaths: [
              {
                category: 'installed_with',
                next_product_reference: 'CSAFPID-HOTFIX4',
              },
            ],
          },
        ],
      },
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-FULL4'],
            known_affected: ['CSAFPID-APP4'],
          },
        },
      ],
    })
    expect(result.isValid).to.equal(true)
    expect(result.errors.length).to.equal(0)
  })

  it('passes when exactly one subpath component differs between otherwise identical product paths', function () {
    // P1 = Product B 1.0 installed_on Product A 4.1
    // P2 = Product B 1.0 installed_on Product A 4.2
    // The `beginning_product_reference` (Product B 1.0) is identical for both
    // paths, and the single subpath differs only in a corresponding pair of
    // Product A versions.
    const result = mandatoryTest_6_1_27_13({
      document: { category: 'csaf_security_advisory' },
      product_tree: {
        branches: [
          {
            category: 'product_name',
            name: 'Product A',
            branches: [
              {
                category: 'product_version',
                name: '4.1',
                product: { product_id: 'CSAFPID-A1' },
              },
              {
                category: 'product_version',
                name: '4.2',
                product: { product_id: 'CSAFPID-A2' },
              },
            ],
          },
        ],
        product_paths: [
          {
            beginning_product_reference: 'CSAFPID-B1',
            full_product_name: { product_id: 'CSAFPID-P1' },
            subpaths: [
              {
                category: 'installed_on',
                next_product_reference: 'CSAFPID-A1',
              },
            ],
          },
          {
            beginning_product_reference: 'CSAFPID-B1',
            full_product_name: { product_id: 'CSAFPID-P2' },
            subpaths: [
              {
                category: 'installed_on',
                next_product_reference: 'CSAFPID-A2',
              },
            ],
          },
        ],
      },
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-P2'],
            known_affected: ['CSAFPID-P1'],
          },
        },
      ],
    })
    expect(result.isValid).to.equal(true)
    expect(result.errors.length).to.equal(0)
  })

  it('passes when the affected product itself is the combined product path containing the installed_with relationship', function () {
    // Mirror image of the "fixed product owns the combined path" case: here
    // the *affected* id (idB in the implementation) is the one that owns the
    // installed_with relationship, and the fixed id is the plain base.
    const result = mandatoryTest_6_1_27_13({
      document: { category: 'csaf_security_advisory' },
      product_tree: {
        full_product_names: [{ product_id: 'CSAFPID-APP6' }],
        product_paths: [
          {
            beginning_product_reference: 'CSAFPID-APP6',
            full_product_name: { product_id: 'CSAFPID-FULL6' },
            subpaths: [
              {
                category: 'installed_with',
                next_product_reference: 'CSAFPID-HOTFIX6',
              },
            ],
          },
        ],
      },
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-APP6'],
            known_affected: ['CSAFPID-FULL6'],
          },
        },
      ],
    })
    expect(result.isValid).to.equal(true)
    expect(result.errors.length).to.equal(0)
  })

  it('fails when an installed_with relationship nested behind another subpath has no corresponding leading product defined', function () {
    // FULL7 = App installed_on Host installed_with Hotfix, but there is no
    // product explicitly defined for "App installed_on Host" (without the
    // hotfix), so `resolveLeadingProductPathId` can't resolve a counterpart
    // product id for the relationship. `known_affected` lists an unrelated
    // product (rather than being empty) so that the correspondence check is
    // actually evaluated instead of short-circuiting on an empty candidate
    // set.
    const result = mandatoryTest_6_1_27_13({
      document: { category: 'csaf_security_advisory' },
      product_tree: {
        full_product_names: [{ product_id: 'CSAFPID-HOTFIX7' }],
        product_paths: [
          {
            beginning_product_reference: 'CSAFPID-APP7',
            full_product_name: { product_id: 'CSAFPID-FULL7' },
            subpaths: [
              {
                category: 'installed_on',
                next_product_reference: 'CSAFPID-HOST7',
              },
              {
                category: 'installed_with',
                next_product_reference: 'CSAFPID-HOTFIX7',
              },
            ],
          },
        ],
      },
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-HOTFIX7'],
            known_affected: ['CSAFPID-UNRELATED7'],
          },
        },
      ],
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors).to.deep.equal([
      {
        instancePath: '/vulnerabilities/0/product_status/fixed/0',
        message:
          'No corresponding version of product "CSAFPID-HOTFIX7" is listed as affected (known_affected) in the same vulnerability',
      },
    ])
  })

  describe('edge cases of the product tree structure', function () {
    /**
     * @param {object} productTree
     * @param {object} productStatus
     */
    const buildDoc = (productTree, productStatus) => ({
      document: { category: 'csaf_security_advisory' },
      product_tree: productTree,
      vulnerabilities: [{ product_status: productStatus }],
    })

    /** @param {string} id */
    const missingError = (id) => [
      {
        instancePath: '/vulnerabilities/0/product_status/fixed/0',
        message: `No corresponding version of product "${id}" is listed as affected (known_affected) in the same vulnerability`,
      },
    ]

    /** @param {string[]} ids */
    const names = (ids) => ids.map((id) => ({ name: id, product_id: id }))

    it('skips vulnerabilities without a product_status', function () {
      const result = mandatoryTest_6_1_27_13({
        document: { category: 'csaf_security_advisory' },
        vulnerabilities: [{}],
      })
      expect(result.isValid).to.equal(true)
      expect(result.errors.length).to.equal(0)
    })

    it('ignores product paths without a product id and treats missing subpaths as empty', function () {
      const result = mandatoryTest_6_1_27_13(
        buildDoc(
          {
            full_product_names: names(['OTHER', 'BEGIN']),
            product_paths: [
              {
                beginning_product_reference: 'BEGIN',
                subpaths: [
                  { category: 'installed_on', next_product_reference: 'OTHER' },
                ],
              },
              {
                beginning_product_reference: 'BEGIN',
                full_product_name: { name: 'No subpaths', product_id: 'NOSUB' },
              },
            ],
          },
          { fixed: ['NOSUB'], known_affected: ['OTHER'] }
        )
      )
      expect(result.isValid).to.equal(false)
      expect(result.errors).to.deep.equal(missingError('NOSUB'))
    })

    it('does not use a same-length candidate path with different subpaths as the leading product', function () {
      const result = mandatoryTest_6_1_27_13(
        buildDoc(
          {
            full_product_names: names(['APP', 'HOST', 'HOST2', 'HOTFIX']),
            product_paths: [
              {
                beginning_product_reference: 'APP',
                full_product_name: { name: 'FULL', product_id: 'FULL' },
                subpaths: [
                  { category: 'installed_on', next_product_reference: 'HOST' },
                  {
                    category: 'installed_with',
                    next_product_reference: 'HOTFIX',
                  },
                ],
              },
              {
                beginning_product_reference: 'APP',
                full_product_name: { name: 'OTHER', product_id: 'OTHER' },
                subpaths: [
                  { category: 'installed_on', next_product_reference: 'HOST2' },
                ],
              },
            ],
          },
          { fixed: ['HOTFIX'], known_affected: ['OTHER'] }
        )
      )
      expect(result.isValid).to.equal(false)
      expect(result.errors).to.deep.equal(missingError('HOTFIX'))
    })

    it('fails when the fixed product owns an installed_with path whose leading product is not defined', function () {
      const result = mandatoryTest_6_1_27_13(
        buildDoc(
          {
            full_product_names: names(['APP', 'HOST', 'HOTFIX', 'UNRELATED']),
            product_paths: [
              {
                beginning_product_reference: 'APP',
                full_product_name: { name: 'FULL', product_id: 'FULL' },
                subpaths: [
                  { category: 'installed_on', next_product_reference: 'HOST' },
                  {
                    category: 'installed_with',
                    next_product_reference: 'HOTFIX',
                  },
                ],
              },
            ],
          },
          { fixed: ['FULL'], known_affected: ['UNRELATED'] }
        )
      )
      expect(result.isValid).to.equal(false)
      expect(result.errors).to.deep.equal(missingError('FULL'))
    })

    it('fails when the affected product owns an installed_with path but the fixed product is unrelated to its leading product', function () {
      const result = mandatoryTest_6_1_27_13(
        buildDoc(
          {
            full_product_names: names(['APP', 'HOTFIX', 'UNRELATED']),
            product_paths: [
              {
                beginning_product_reference: 'APP',
                full_product_name: { name: 'FULL', product_id: 'FULL' },
                subpaths: [
                  {
                    category: 'installed_with',
                    next_product_reference: 'HOTFIX',
                  },
                ],
              },
            ],
          },
          { fixed: ['UNRELATED'], known_affected: ['FULL'] }
        )
      )
      expect(result.isValid).to.equal(false)
      expect(result.errors).to.deep.equal(missingError('UNRELATED'))
    })

    it('passes when the fixed product corresponds to the leading product of the affected installed_with path', function () {
      const result = mandatoryTest_6_1_27_13(
        buildDoc(
          {
            branches: [
              {
                category: 'product_name',
                name: 'App',
                branches: [
                  {
                    category: 'product_version',
                    name: '1.0',
                    product: { name: 'App 1.0', product_id: 'APP1' },
                  },
                  {
                    category: 'product_version',
                    name: '2.0',
                    product: { name: 'App 2.0', product_id: 'APP2' },
                  },
                ],
              },
            ],
            full_product_names: names(['HOTFIX']),
            product_paths: [
              {
                beginning_product_reference: 'APP1',
                full_product_name: { name: 'FULL', product_id: 'FULL' },
                subpaths: [
                  {
                    category: 'installed_with',
                    next_product_reference: 'HOTFIX',
                  },
                ],
              },
            ],
          },
          { fixed: ['APP2'], known_affected: ['FULL'] }
        )
      )
      expect(result.isValid).to.equal(true)
      expect(result.errors.length).to.equal(0)
    })

    it('does not crash on a subpath without next_product_reference', function () {
      const result = mandatoryTest_6_1_27_13(
        buildDoc(
          {
            full_product_names: names(['BEGIN', 'NEXT']),
            product_paths: [
              {
                beginning_product_reference: 'BEGIN',
                full_product_name: { name: 'PA', product_id: 'PA' },
                subpaths: [{ category: 'installed_on' }],
              },
              {
                beginning_product_reference: 'BEGIN',
                full_product_name: { name: 'PB', product_id: 'PB' },
                subpaths: [
                  { category: 'installed_on', next_product_reference: 'NEXT' },
                ],
              },
            ],
          },
          { fixed: ['PA'], known_affected: ['PB'] }
        )
      )
      expect(result.isValid).to.equal(false)
      expect(result.errors).to.deep.equal(missingError('PA'))
    })

    it('does not crash on cyclic product paths when an affected product is listed', function () {
      const result = mandatoryTest_6_1_27_13(
        buildDoc(
          {
            full_product_names: names(['A', 'B']),
            product_paths: [
              {
                beginning_product_reference: 'A',
                full_product_name: { name: 'PA', product_id: 'PA' },
                subpaths: [
                  { category: 'installed_on', next_product_reference: 'PB' },
                ],
              },
              {
                beginning_product_reference: 'B',
                full_product_name: { name: 'PB', product_id: 'PB' },
                subpaths: [
                  { category: 'installed_on', next_product_reference: 'PA' },
                ],
              },
            ],
          },
          { fixed: ['PA'], known_affected: ['PB'] }
        )
      )
      expect(result.isValid).to.equal(false)
      expect(result.errors).to.deep.equal(missingError('PA'))
    })

    it('fails when product paths have a different number of subpaths', function () {
      const result = mandatoryTest_6_1_27_13(
        buildDoc(
          {
            full_product_names: names(['BEGIN', 'HOST', 'HOST2']),
            product_paths: [
              {
                beginning_product_reference: 'BEGIN',
                full_product_name: { name: 'PA', product_id: 'PA' },
                subpaths: [
                  { category: 'installed_on', next_product_reference: 'HOST' },
                ],
              },
              {
                beginning_product_reference: 'BEGIN',
                full_product_name: { name: 'PB', product_id: 'PB' },
                subpaths: [
                  { category: 'installed_on', next_product_reference: 'HOST' },
                  { category: 'installed_on', next_product_reference: 'HOST2' },
                ],
              },
            ],
          },
          { fixed: ['PA'], known_affected: ['PB'] }
        )
      )
      expect(result.isValid).to.equal(false)
      expect(result.errors).to.deep.equal(missingError('PA'))
    })
  })

  it('fails when an installed_with relationship at the top level has no matching beginning product listed as affected', function () {
    const result = mandatoryTest_6_1_27_13({
      document: { category: 'csaf_security_advisory' },
      product_tree: {
        full_product_names: [{ product_id: 'CSAFPID-HOTFIX2' }],
        product_paths: [
          {
            beginning_product_reference: 'CSAFPID-APP2',
            full_product_name: { product_id: 'CSAFPID-FULL2' },
            subpaths: [
              {
                category: 'installed_with',
                next_product_reference: 'CSAFPID-HOTFIX2',
              },
            ],
          },
        ],
      },
      vulnerabilities: [
        {
          product_status: {
            first_fixed: ['CSAFPID-HOTFIX2'],
            known_affected: [],
          },
        },
      ],
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors).to.deep.equal([
      {
        instancePath: '/vulnerabilities/0/product_status/first_fixed/0',
        message:
          'No corresponding version of product "CSAFPID-HOTFIX2" is listed as affected (known_affected) in the same vulnerability',
      },
    ])
  })
})
