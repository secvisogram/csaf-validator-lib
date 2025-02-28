import { expect } from 'chai'
import informativeTest_6_3_8 from '../lib/informativeTests/informativeTest_6_3_8.js'

const validMarker = 'Mocked as Valid'

const documentValidBasePart = `category": "csaf_base",
        "csaf_version": "2.0",
        "lang": "en",
        "notes": [
          {
            "category": "summary",
            "text": "${validMarker}"
          }
        ],
        "publisher": {
          "category": "other",
          "name": "OASIS CSAF TC [${validMarker}]",
          "namespace": "https://example.com"
        },`

const validTrackingpart = `"tracking": {
          "current_release_date": "2021-07-21T10:00:00.000Z",
          "id": "OASIS_CSAF_TC-CSAF_2.0-2021-6-3-08-01",
          "initial_release_date": "2021-07-21T10:00:00.000Z",
          "revision_history": [
            {
              "date": "2021-07-21T10:00:00.000Z",
              "number": "1",
              "summary": "${validMarker}"
            }
          ],
          "status": "final",
          "version": "1"
        }
      }`

/**
 * @param {object} params
 * @param {string} params.input
 * @returns
 */
async function runHunspellMock({ input }) {
  if (input.includes(validMarker)) {
    return 'Hunspell vMOCK\n\n*'
  } else {
    return 'Hunspell vMOCK\n\n# wrongword 1'
  }
}

describe('Informative test 6.3.8', function () {
  const csafWithInvalidTitle = `{
      "document": {
        "${documentValidBasePart}
        "title": "Informative test: Spell check (failing example 1)[Mocked as Invalid]",
        ${validTrackingpart}
    }`

  const csafWithInvalidProductName = `{
      "document": {
        "${documentValidBasePart}
        "title": "Informative test: Spell check (failing example 1)[${validMarker}]",
        ${validTrackingpart},
        "product_tree": {
          "branches": [
            {
              "branches": [
                {
                  "branches": [
                    {
                      "category": "product_name",
                      "name": "Mocked as Invalid",
                      "product": {
                        "name": "${validMarker}",
                        "product_id": "7Client-7.6",
                        "product_identification_helper": {
                          "cpe": "cpe:/o:redhat:enterprise_linux:7::client"
                        }
                      }
                    }
                  ],
                  "category": "product_family",
                  "name": "${validMarker}"
                }
              ],
              "category": "vendor",
              "name": "${validMarker}"
            }
          ]
        }
    }`

  describe('failing examples', function () {
    it('test invalid title', async function () {
      const result = await informativeTest_6_3_8(
        JSON.parse(csafWithInvalidTitle),
        {
          hunspell: runHunspellMock,
        }
      )
      expect(result.infos).to.have.length.greaterThan(0)
    })

    it('test invalid product name in  branch', async function () {
      const result = await informativeTest_6_3_8(
        JSON.parse(csafWithInvalidProductName),
        {
          hunspell: runHunspellMock,
        }
      )
      expect(result.infos).to.have.length.greaterThan(0)
    })
  })

  const validCsaf = `{
      "document": {
        "${documentValidBasePart}
        "title": "Informative test: Spell check (failing example 1)[Mocked as Invalid]",
        ${validTrackingpart}
    }`

  describe('valid examples', function () {
    it('test valid csaf', async function () {
      const result = await informativeTest_6_3_8(JSON.parse(validCsaf), {
        hunspell: runHunspellMock,
      })
      expect(result.infos).to.have.length.greaterThan(0)
    })
  })
})
