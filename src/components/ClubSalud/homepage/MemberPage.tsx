import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag'
import { type ReactElement } from 'react'
import { DateUtils } from 'utils/ClubSalud/dates'
import { type Account } from 'utils/ClubSalud/types'

const classesAndInstructors = (acc: Account | undefined): ReactElement => {
  return (
    <div>
      {acc?.Member?.scheduleInscription?.map((sch) => (
        <div
          key={sch.id}
          className='flex gap-2'
        >
          <p>
            Clase: <Tag severity='success'>{sch.schedule.Class?.name}</Tag>
          </p>
          <p>
            Profesor/a: <Tag severity='info'>{sch.schedule.Class?.name}</Tag>
          </p>
        </div>
      ))}
    </div>
  )
}

const lastSubs = (acc: Account | undefined): ReactElement => {
  const subs = acc?.Member?.Subscription?.filter((sub) => sub.active)

  if (!subs || subs?.length < 1) {
    return <>No contas con una suscripción válida</>
  }

  const sub = subs[0]
  return (
    <div className='flex flex-column'>
      <p>Promoción: {sub?.Promotion?.title}</p>
      <p>Clases restantes: {sub?.remainingClasses}</p>
      <p>
        Vencimiento:{' '}
        {DateUtils.formatToDDMMYY(DateUtils.newDate(sub?.expirationDate ?? ''))}{' '}
      </p>
    </div>
  )
}

export default function MemberPage({
  account
}: {
  account: Account | undefined
}): ReactElement {
  return (
    <div className='flex flex-column gap-2'>
      <Card title='Suscripción actual'>{account && lastSubs(account)}</Card>
      <Card title='Inscripciones'>{classesAndInstructors(account)}</Card>
    </div>
  )
}
