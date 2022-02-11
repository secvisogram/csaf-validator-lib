export type DocumentTest = (doc: any) => {
  isValid?: boolean
  warnings?: Array<{ message: string; instancePath: string }>
  errors?: Array<{ message?: string; instancePath: string }>
  infos?: Array<{ message: string; instancePath: string }>
}
