import { Button } from 'primereact/button'
import { type ReactElement } from 'react'

export default function Appointment(): ReactElement {
  return (
    <section className='w-screen bg-gray-100 p-6 flex gap-8 justify-content-center align-items-center'>
      <div className='flex flex-column gap-4 align-items-center justify-content-center'>
        <span className='text-primary text-2xl'>TURNOS</span>
        <span className='text-600'>Solicitá turnos ahora</span>
      </div>
      <div className='flex flex-column gap-4 align-items-center justify-content-center'>
        <span className='flex justify-content-center align-items-center gap-2'>
          <i className='pi pi-whatsapp'></i>
          <b>2994 58-7079</b>
        </span>
        <span className='flex flex-column gap-2 justify-content-center align-items-center text-600'>
          <span>Lunes a Viernes de 8:30 a 20:30 hs.</span>
          <span>Sólo mensajes de Whtasapp.</span>
        </span>
      </div>
      <Button
        label='SOLICITAR TURNO'
        size='small'
        rounded
      />
    </section>
  )
}
