import React, { useMemo, useState } from 'react'
import { ModelContext } from './ModelContext'
import type { LoadedModel } from './ModelContext'

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState<LoadedModel>({})
  const value = useMemo(() => ({ model, setModel }), [model])
  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
}


