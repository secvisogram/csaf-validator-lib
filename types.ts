declare module 'bcp47' {
  const bcp47: {
    parse: (tag: string) => {
      langtag: {
        language: {
          language: string | null
          extlang: string[]
        }
        script: string | null
        region: string | null
        variant: string[]
        extension: Array<{ singleton: string }>
        privateuse: string[]
      }
    } | null
  }

  export default bcp47
}
