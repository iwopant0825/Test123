import { createContext } from 'react'

export type LoadedModel = {
  file?: File
  url?: string
  ext?: string
}

export const ModelContext = createContext<{
  model: LoadedModel
  setModel: (m: LoadedModel) => void
}>({ model: {}, setModel: () => {} })


