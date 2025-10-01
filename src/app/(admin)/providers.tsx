'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PrimeReactProvider } from 'primereact/api'
import { type ReactNode, useState } from 'react'

export default function Providers({ children }: { children: ReactNode }): ReactNode {
  const [client] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={client}>
      <PrimeReactProvider>{children}</PrimeReactProvider>
    </QueryClientProvider>
  )
}
