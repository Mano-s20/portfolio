import { createContext, useContext, type ReactNode } from 'react'
import { useEnvironment, type Environment } from '../hooks/useEnvironment'

const EnvironmentContext = createContext<Environment | null>(null)

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const environment = useEnvironment()
  return <EnvironmentContext.Provider value={environment}>{children}</EnvironmentContext.Provider>
}

export function useEnvironmentContext() {
  const value = useContext(EnvironmentContext)
  if (!value) throw new Error('useEnvironmentContext must be used inside EnvironmentProvider')
  return value
}
