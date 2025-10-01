import '../globals.css'
import 'primereact/resources/primereact.min.css'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import type { ReactNode } from 'react'
import Providers from './providers'

export default function RootLayout({
  children
}: {
  children: ReactNode
}): ReactNode {
  return (
    <html lang='es'>
      <body className='w-full h-full'>
        <Providers>
          <div className='w-full h-full'>{children}</div>
        </Providers>
      </body>
    </html>
  )
}
