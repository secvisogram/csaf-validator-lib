import sortObjectKeys from '../../lib/shared/sortObjectKeys.js'
import minimalDocCsaf2_1 from './shared/minimalDocCsaf2_1.js'

export default /** @type {typeof minimalDocCsaf2_1} */ (
  sortObjectKeys(new Intl.Collator(), {
    ...minimalDocCsaf2_1,
    document: {
      ...minimalDocCsaf2_1.document,
      category: 'generic_csaf',
    },
  })
)
