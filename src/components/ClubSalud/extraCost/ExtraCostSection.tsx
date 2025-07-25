'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { deleteExtraCost, getExtraCost } from 'queries/ClubSalud/extraCost'
import { useState, type ReactElement, useEffect } from 'react'
import { useModal } from 'utils/ClubSalud/useModal'
import { Dialog } from 'primereact/dialog'
import ExtraCostForm from './ExtraCostForm'
import { Calendar } from 'primereact/calendar'
import { confirmDialog } from 'primereact/confirmdialog'
import { type dateType, type ExtraCost } from 'utils/ClubSalud/types'
import { DateUtils } from 'utils/ClubSalud/dates'

export default function ExtraCostSection(): ReactElement {
  const [selected, setSelected] = useState<number | null>(null)
  const [filterExtraCost, setFilterExtraCost] = useState<ExtraCost[]>([])
  const [selectedDate, setSelectedDate] = useState<dateType | null>(null)

  const [createExtraCost, openCreateExtraCost, closeCreateExtraCost] =
    useModal(false)

  const { data: extracost, refetch } = useQuery({
    queryKey: ['extracost'],
    queryFn: async () => {
      return await getExtraCost()
    }
  })

  const { mutate: deleteExtra, isPending: deleting } = useMutation({
    mutationFn: async (id: number) => {
      return await deleteExtraCost(id)
    },
    onSuccess: async () => {
      await refetch()
    }
  })

  useEffect(() => {
    if (extracost && selectedDate) {
      setFilterExtraCost(
        extracost.filter(
          (extra: ExtraCost) =>
            DateUtils.getMonth(extra.date) === selectedDate.month &&
            DateUtils.getYear(extra.date) === selectedDate.year
        )
      )
    } else if (extracost) {
      setFilterExtraCost(extracost)
    }
  }, [extracost, selectedDate])

  return (
    <>
      <Dialog
        visible={createExtraCost}
        onHide={closeCreateExtraCost}
        header='Agregar gasto extra'
      >
        <ExtraCostForm />
      </Dialog>
      <DataTable
        value={filterExtraCost}
        header={() => (
          <nav className='w-full flex align-items-center justify-content-between'>
            <Button
              label='Agegar gasto extra'
              size='small'
              icon='pi pi-plus'
              iconPos='right'
              onClick={openCreateExtraCost}
            />
            <div className='flex gap-4'>
              <Calendar
                view='month'
                dateFormat='mm/yy'
                onChange={(e) => {
                  if (e.value) {
                    setSelectedDate({
                      month: DateUtils.getMonth(e.value),
                      year: DateUtils.getYear(e.value)
                    })
                  }
                }}
              />
              <Button
                icon='pi pi-filter-slash'
                onClick={() => {
                  setSelectedDate(null)
                }}
              />
            </div>
          </nav>
        )}
      >
        <Column
          field='id'
          header='ID'
        />
        <Column
          field='amount'
          header='Cantidad'
        />
        <Column
          field='description'
          header='Descripción'
        />
        <Column
          field='date'
          header='Fecha'
          body={(e) => (
            <Calendar
              value={DateUtils.newDate(e.date as string)}
              disabled
              dateFormat='dd/mm/yy'
            />
          )}
        />
        <Column
          body={(e) => (
            <Button
              label='Eliminar'
              icon='pi pi-trash'
              iconPos='right'
              size='small'
              outlined
              severity='danger'
              loading={deleting && selected === e.id}
              onClick={() => {
                setSelected(e.id as number)
                confirmDialog({
                  message: 'Quieres eliminar este gasto?',
                  header: 'Confirmación',
                  icon: 'pi pi-info-circle',
                  defaultFocus: 'reject',
                  acceptClassName: 'p-button-danger',
                  accept: () => {
                    deleteExtra(e.id as number)
                  }
                })
              }}
            />
          )}
        />
      </DataTable>
    </>
  )
}
