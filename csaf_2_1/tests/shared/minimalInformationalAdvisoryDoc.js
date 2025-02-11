import minimalCSAFBaseDoc2_1 from './shared/minimalDocCsaf2_1.js'

export default {
  ...minimalCSAFBaseDoc2_1,
  document: {
    ...minimalCSAFBaseDoc2_1.document,
    category: 'csaf_informational_advisory',
    notes: [
      {
        category: 'description',
        text: 'Some mandatory description',
        title: 'Some description',
      },
    ],
    references: [
      ...minimalCSAFBaseDoc2_1.document.references,
      {
        category: 'external',
        summary: 'The canonical URL.',
        url: 'https://example.com/security/data/csaf/2021/OASIS_CSAF_TC-CSAF_2_0-2021-6-1-27-02-01.json',
      },
    ],
  },
}
