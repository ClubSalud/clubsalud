import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FilterMatchMode } from 'primereact/api'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog'
import { DataTable } from 'primereact/datatable'
import { Tag } from 'primereact/tag'
import { getMembers } from 'queries/ClubSalud/members'
import { deleteParticularPayment } from 'queries/ClubSalud/payments'
import { useState, type ReactElement } from 'react'
import { DateUtils } from 'utils/ClubSalud/dates'
import {
  type Payment,
  type Member,
  type Subscription
} from 'utils/ClubSalud/types'

export default function BillTable(): ReactElement {
  const query = useQueryClient()
  const [selected, setSelected] = useState<number | null>(null)
  const [expandedRows, setExpandedRows] = useState<Subscription[]>([])
  const [expandedRowsPayments, setExpandedRowsPayments] = useState<Payment[]>(
    []
  )

  const filters = {
    dni: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    lastName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'subscription.member.dni': {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH
    }
  }

  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      return await getMembers()
    }
  })

  const { mutate: deleteBill, isPending: deleting } = useMutation({
    mutationFn: async (id: number) => {
      return await deleteParticularPayment(id)
    },
    onSuccess: async () => {
      await query.refetchQueries({ queryKey: ['members'] })
    }
  })

  const allowExpansion = (rowData: Member): boolean => {
    const subs = rowData.Subscription?.length
    return subs !== undefined && subs > 0
  }

  const allowExpansionPayments = (rowData: Subscription): boolean => {
    const pays = rowData.Payment?.length
    return pays !== undefined && pays > 0
  }

  const rowExpansionTemplatePayments = (data: Subscription): ReactElement => {
    return (
      <>
        <ConfirmDialog />
        <DataTable value={data.Payment}>
          <Column
            field='id'
            header='ID'
          />
          <Column
            field='amount'
            header='Cantidad'
          />
          <Column
            field='date'
            header='Fecha'
            body={(row: Payment) => <p>{DateUtils.formatToDDMMYY(row.date)}</p>}
          />
          <Column
            body={(e) => {
              return (
                <Button
                  icon='pi pi-trash'
                  severity='danger'
                  size='small'
                  outlined
                  loading={selected === e.id && deleting}
                  onClick={() => {
                    confirmDialog({
                      message: 'Confirmar eliminación',
                      header: 'Confirmación',
                      icon: 'pi pi-exclamation-triangle',
                      acceptLabel: 'Eliminar',
                      rejectLabel: 'Cancelar',
                      accept: () => {
                        setSelected(e.id as number)
                        deleteBill(e.id as number)
                      }
                    })
                  }}
                />
              )
            }}
          />
        </DataTable>
      </>
    )
  }

  const rowExpansionTemplate = (data: Member): ReactElement => {
    return (
      <DataTable
        value={data.Subscription}
        header='Suscripciones'
        expandedRows={expandedRowsPayments}
        onRowToggle={(e) => {
          setExpandedRowsPayments(e.data as Payment[])
        }}
        rowExpansionTemplate={rowExpansionTemplatePayments}
      >
        <Column
          expander={allowExpansionPayments}
          style={{ width: '5rem' }}
        />
        <Column
          field='id'
          header='Id'
          sortable
        />
        <Column
          field='initialDate'
          header='Inicio'
          sortable
        />
        <Column
          field='expirationDate'
          header='Vencimiento'
          body={(row: Subscription) => (
            <p>{DateUtils.formatToDDMMYY(row.expirationDate ?? '')}</p>
          )}
          sortable
        />
        <Column
          header='Oferta'
          field='Plan.title'
        />
        <Column
          header='Plan'
          field='Promotion.title'
        />
        <Column
          field='paid'
          header='Pagado'
          body={(e) => {
            const paid = e.paid
            return (
              <Tag
                severity={paid ? 'success' : 'danger'}
                className='w-full'
              >
                {paid ? 'Si' : 'No'}
              </Tag>
            )
          }}
          sortable
        />
        <Column
          field='total'
          header='Total'
          sortable
        />
        <Column
          field='remaining'
          header='Restante'
          sortable
        />
        <Column
          field='active'
          header='Activo'
          body={(e) => {
            const active = e.active
            return (
              <Tag
                severity={active ? 'success' : 'danger'}
                className='w-full'
              >
                {active ? 'Si' : 'No'}
              </Tag>
            )
          }}
          sortable
        />
      </DataTable>
    )
  }

  return (
    <DataTable
      scrollable
      scrollHeight='70dvh'
      stripedRows
      value={members}
      header={() => <h2>Cobros Particulares</h2>}
      filters={filters}
      filterDisplay='row'
      emptyMessage='Sin Datos'
      expandedRows={expandedRows}
      onRowToggle={(e) => {
        setExpandedRows(e.data as Subscription[])
      }}
      rowExpansionTemplate={rowExpansionTemplate}
    >
      <Column
        expander={allowExpansion}
        style={{ width: '5rem' }}
      />
      <Column
        field='name'
        header='Alumno'
        sortable
        filter
        filterPlaceholder='Nombre'
      />
      <Column
        field='lastName'
        header='Apellido'
        sortable
        filter
        filterPlaceholder='Apellido'
      />
      <Column
        field='dni'
        header='DNI'
        sortable
        filter
        filterPlaceholder='DNI'
      />
    </DataTable>
  )
}
