'use client'

import { useQuery } from '@tanstack/react-query'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { getAusentismos } from 'queries/Medintt/users'
import { useEffect, useState, type ReactElement } from 'react'
import { useForm } from 'react-hook-form'
import { DateUtils } from 'utils/ClubSalud/dates'
import { getDataSessionMedintt } from 'utils/Medintt/session'

export default function Ausentimos(): ReactElement {
  const [user, setUser] = useState<any>(undefined)
  const [desde, setDesde] = useState<Date | null>(null)
  const [hasta, setHasta] = useState<Date | null>(null)
  const [mesReferencia, setMesReferencia] = useState<Date | null>(null)

  useEffect(() => {
    const userData = getDataSessionMedintt()
    setDesde(DateUtils.startOfMonth(DateUtils.getCurrentDate()))
    setHasta(DateUtils.endOfMonth(DateUtils.getCurrentDate()))
    setMesReferencia(DateUtils.getCurrentDate())
    setUser(userData.user)
  }, [])

  const { register } = useForm()

  const { data: ausentimos } = useQuery({
    queryKey: ['ausentimos', user?.Id_Prestataria, desde, hasta, mesReferencia],
    queryFn: async () => {
      const data = {
        idPrestataria: Number(user?.Id_Prestataria),
        desde,
        hasta,
        mesReferencia
      }
      const response = await getAusentismos(data)
      if (response.ok) {
        return response.data
      }
      return []
    },
    enabled: user !== undefined && desde !== null && hasta !== null
  })

  return (
    <div className='flex flex-column'>
      <form className='flex flex-row align-items-center justify-content-start gap-4'>
        <div className='flex flex-row gap-2 align-items-center'>
          <p>Desde</p>
          <Calendar
            required
            value={desde}
            className='w-8rem h-2rem'
            {...register('desde')}
            onChange={(e) => {
              if (e.value !== undefined) {
                setDesde(e.value)
              }
            }}
          />
        </div>
        <div className='flex flex-row gap-2 align-items-center'>
          <p>Hasta</p>
          <Calendar
            required
            value={hasta}
            className='w-8rem h-2rem'
            {...register('hasta')}
            onChange={(e) => {
              if (e.value !== undefined) {
                setHasta(e.value)
              }
            }}
          />
        </div>
        <div className='flex flex-row gap-2 align-items-center'>
          <p>Mes de Referencia</p>
          <Calendar
            required
            value={mesReferencia}
            className='w-8rem h-2rem'
            {...register('mesReferencia')}
            onChange={(e) => {
              if (e.value !== undefined) {
                setMesReferencia(e.value)
              }
            }}
          />
        </div>
      </form>
      <DataTable
        value={ausentimos}
        scrollable
        scrollHeight='92dvh'
        size='small'
        paginator
        paginatorPosition='bottom'
        alwaysShowPaginator
        rows={20}
        tableStyle={{ minWidth: '200px' }}
      >
        <Column
          field='Paciente'
          header='Empleado'
        />
        <Column
          field='DNI'
          header='DNI'
        />
        <Column
          field='Cargo'
          header='Cargo'
        />
        <Column
          field='Funcion'
          header='Funcion'
        />
        <Column
          field='Del'
          header='Del'
          body={(rowData) => (
            <p className='w-5rem'>{DateUtils.formatToDDMMYYutc(rowData.Del as Date)}</p>
          )}
        />
        <Column
          field='Al'
          header='Al'
          body={(rowData) => (
            <p className='w-5rem'>{DateUtils.formatToDDMMYYutc(rowData.Al as Date)}</p>
          )}
        />
        <Column
          field='Notificacion'
          header='Notificacion'
          body={(rowData) => (
            <p>{DateUtils.formatToDDMMYYutc(rowData.Notificacion as Date)}</p>
          )}
        />
        <Column
          field='Dias'
          header='Dias'
        />
        <Column
          field='Categoria'
          header='Categoria'
        />
        <Column
          field='Diagnostico'
          header='Diagnostico'
        />
        <Column
          field='Evolucion'
          header='Evolucion'
        />
      </DataTable>
    </div>
  )
}
