import { type ReactElement } from 'react'
import { Button } from 'primereact/button'

export default function ManagementProfile({
  src,
  name,
  description,
  socialmedia
}: {
  src: any
  name: string
  description: string
  socialmedia: Array<{ url: string; icon: string }>
}): ReactElement {
  return (
    <div
      className='management-profile-card flex flex-column overflow-hidden text-primary border-round-3xl h-full'
      style={{ minHeight: '28rem' }}
    >
      <div className='w-full overflow-hidden flex-shrink-0' style={{ height: '16rem' }}>
        <img
          src={`${src}`}
          alt=""
          className='w-full h-full border-round-top-3xl'
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>
      <div
        className='border-round-bottom-3xl p-3 shadow-4 flex flex-column gap-3 flex-grow-1'
        style={{
          backdropFilter: 'blur(5px)',
          background:
            'linear-gradient(to bottom, rgba(90, 90, 90, 0.57), rgb(58, 58, 58))'
        }}
      >
        <div className='flex flex-column xl:flex-row align-items-center justify-content-between'>
          <span className='font-bold text-white'>{name}</span>
          <div>
            {socialmedia.map((item, index) => (
              <Button
                key={index}
                link
                onClick={() => {
                  window.open(`${item.url}`, '_blank')
                }}
                icon={item.icon}
                style={{ color: 'white' }}
              />
            ))}
          </div>
        </div>
        <div className='flex-grow-1 flex align-items-center'>
          <span className='text-sm text-white line-height-3'>{description}</span>
        </div>
      </div>
    </div>
  )
}
