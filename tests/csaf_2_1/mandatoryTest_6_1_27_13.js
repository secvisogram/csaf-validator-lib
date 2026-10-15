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

  it('passes when exactly one subpath component differs between corresponding product paths', function () {
    // ProductB 1.0 installed_on ProductA 4.1 (P1) vs. ProductB 1.0 installed_on
    // ProductA 4.2 (P2): only the `installed_on` target differs, and that
    // target is itself a corresponding pair of branch versions.
    const result = mandatoryTest_6_1_27_13({
      document: { category: 'csaf_security_advisory' },
      product_tree: {
        branches: [
          {
            category: 'vendor',
            name: 'Example Company',
            branches: [
              {
                category: 'product_name',
                name: 'Product A',
                branches: [
                  {
                    category: 'product_version',
                    name: '4.1',
                    product: {
                      name: 'Product A 4.1',
                      product_id: 'CSAFPID-A1',
                    },
                  },
                  {
                    category: 'product_version',
                    name: '4.2',
                    product: {
                      name: 'Product A 4.2',
                      product_id: 'CSAFPID-A2',
                    },
                  },
                ],
              },
              {
                category: 'product_name',
                name: 'Product B',
                branches: [
                  {
                    category: 'product_version',
                    name: '1.0',
                    product: {
                      name: 'Product B 1.0',
                      product_id: 'CSAFPID-B1',
                    },
                  },
                ],
              },
            ],
          },
        ],
        product_paths: [
          {
            beginning_product_reference: 'CSAFPID-B1',
            full_product_name: {
              name: 'Product B 1.0 installed on Product A 4.1',
              product_id: 'CSAFPID-P1',
            },
            subpaths: [
              {
                category: 'installed_on',
                next_product_reference: 'CSAFPID-A1',
              },
            ],
          },
          {
            beginning_product_reference: 'CSAFPID-B1',
            full_product_name: {
              name: 'Product B 1.0 installed on Product A 4.2',
              product_id: 'CSAFPID-P2',
            },
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

  it('fails when product paths differ in more than one component', function () {
    // Both the `installed_on` target for ProductB and the one for ProductA
    // differ at the same time, so P1 and P2 do not count as corresponding
    // products even though each individual pair of targets corresponds.
    const result = mandatoryTest_6_1_27_13({
      document: { category: 'csaf_security_advisory' },
      product_tree: {
        branches: [
          {
            category: 'vendor',
            name: 'Example Company',
            branches: [
              {
                category: 'product_name',
                name: 'Product A',
                branches: [
                  {
                    category: 'product_version',
                    name: '3.0',
                    product: {
                      name: 'Product A 3.0',
                      product_id: 'CSAFPID-A1',
                    },
                  },
                  {
                    category: 'product_version',
                    name: '3.1',
                    product: {
                      name: 'Product A 3.1',
                      product_id: 'CSAFPID-A2',
                    },
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
                    product: {
                      name: 'Product B 2.0',
                      product_id: 'CSAFPID-B1',
                    },
                  },
                  {
                    category: 'product_version',
                    name: '2.1',
                    product: {
                      name: 'Product B 2.1',
                      product_id: 'CSAFPID-B2',
                    },
                  },
                ],
              },
              {
                category: 'product_name',
                name: 'Product C',
                branches: [
                  {
                    category: 'product_version',
                    name: '1.0',
                    product: {
                      name: 'Product C 1.0',
                      product_id: 'CSAFPID-C0',
                    },
                  },
                ],
              },
            ],
          },
        ],
        product_paths: [
          {
            beginning_product_reference: 'CSAFPID-C0',
            full_product_name: {
              name: 'Product C 1.0 installed on B 2.0 installed on A 3.0',
              product_id: 'CSAFPID-P1',
            },
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
            full_product_name: {
              name: 'Product C 1.0 installed on B 2.1 installed on A 3.1',
              product_id: 'CSAFPID-P2',
            },
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
        branches: [
          {
            category: 'vendor',
            name: 'Example Company',
            branches: [
              {
                category: 'product_name',
                name: 'App',
                branches: [
                  {
                    category: 'product_version',
                    name: '1.0',
                    product: { name: 'App 1.0', product_id: 'CSAFPID-APP1' },
                  },
                ],
              },
              {
                category: 'product_name',
                name: 'Host',
                branches: [
                  {
                    category: 'product_version',
                    name: '2.0',
                    product: {
                      name: 'Host 2.0',
                      product_id: 'CSAFPID-HOST1',
                    },
                  },
                ],
              },
              {
                category: 'product_name',
                name: 'Hotfix',
                branches: [
                  {
                    category: 'product_version',
                    name: 'H1',
                    product: {
                      name: 'Hotfix H1',
                      product_id: 'CSAFPID-HOTFIX1',
                    },
                  },
                ],
              },
            ],
          },
        ],
        product_paths: [
          {
            beginning_product_reference: 'CSAFPID-APP1',
            full_product_name: {
              name: 'App 1.0 installed on Host 2.0',
              product_id: 'CSAFPID-BASE1',
            },
            subpaths: [
              {
                category: 'installed_on',
                next_product_reference: 'CSAFPID-HOST1',
              },
            ],
          },
          {
            beginning_product_reference: 'CSAFPID-APP1',
            full_product_name: {
              name: 'App 1.0 installed on Host 2.0 installed with Hotfix H1',
              product_id: 'CSAFPID-FULL1',
            },
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
        branches: [
          {
            category: 'vendor',
            name: 'Example Company',
            branches: [
              {
                category: 'product_name',
                name: 'App',
                branches: [
                  {
                    category: 'product_version',
                    name: '1.0',
                    product: { name: 'App 1.0', product_id: 'CSAFPID-APP1' },
                  },
                ],
              },
              {
                category: 'product_name',
                name: 'Host',
                branches: [
                  {
                    category: 'product_version',
                    name: '2.0',
                    product: {
                      name: 'Host 2.0',
                      product_id: 'CSAFPID-HOST1',
                    },
                  },
                ],
              },
              {
                category: 'product_name',
                name: 'Hotfix',
                branches: [
                  {
                    category: 'product_version',
                    name: 'H1',
                    product: {
                      name: 'Hotfix H1',
                      product_id: 'CSAFPID-HOTFIX1',
                    },
                  },
                ],
              },
            ],
          },
        ],
        product_paths: [
          {
            beginning_product_reference: 'CSAFPID-APP1',
            full_product_name: {
              name: 'App 1.0 installed on Host 2.0',
              product_id: 'CSAFPID-BASE1',
            },
            subpaths: [
              {
                category: 'installed_on',
                next_product_reference: 'CSAFPID-HOST1',
              },
            ],
          },
          {
            beginning_product_reference: 'CSAFPID-APP1',
            full_product_name: {
              name: 'App 1.0 installed on Host 2.0 installed with Hotfix H1',
              product_id: 'CSAFPID-FULL1',
            },
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

  it('fails when an installed_with relationship at the top level has no matching beginning product listed as affected', function () {
    const result = mandatoryTest_6_1_27_13({
      document: { category: 'csaf_security_advisory' },
      product_tree: {
        branches: [
          {
            category: 'vendor',
            name: 'Example Company',
            branches: [
              {
                category: 'product_name',
                name: 'App',
                branches: [
                  {
                    category: 'product_version',
                    name: '1.0',
                    product: { name: 'App 1.0', product_id: 'CSAFPID-APP2' },
                  },
                ],
              },
              {
                category: 'product_name',
                name: 'Hotfix',
                branches: [
                  {
                    category: 'product_version',
                    name: 'H1',
                    product: {
                      name: 'Hotfix H1',
                      product_id: 'CSAFPID-HOTFIX2',
                    },
                  },
                ],
              },
            ],
          },
        ],
        product_paths: [
          {
            beginning_product_reference: 'CSAFPID-APP2',
            full_product_name: {
              name: 'App 1.0 installed with Hotfix H1',
              product_id: 'CSAFPID-FULL2',
            },
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
