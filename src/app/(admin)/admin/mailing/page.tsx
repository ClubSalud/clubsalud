'use client'

import { useMutation } from '@tanstack/react-query'
import { Button } from 'primereact/button'
import { FileUpload, type FileUploadHandlerEvent } from 'primereact/fileupload'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { sendMails } from 'queries/Medintt/mailing'
import { type ReactElement } from 'react'
import { Controller, useForm } from 'react-hook-form'

interface MailingFormValues {
  subject: string
  message: string
  filename: string
  pdf: File | null
}

export default function Mailing(): ReactElement {
  const { control, handleSubmit, register } = useForm<MailingFormValues>({
    defaultValues: {
      subject: '',
      message: '',
      filename: '',
      pdf: null
    }
  })

  const { mutate: sendMail } = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await sendMails(data)
      console.log(response)
    },
    onSuccess: () => {
      alert('Emails enviados correctamente')
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const onSubmit = (data: MailingFormValues): void => {
    const body = new FormData()
    body.append('subject', data.subject)
    body.append('message', data.message)
    body.append('filename', data.filename)
    if (data.pdf != null) {
      body.append('pdf', data.pdf, data.pdf.name)
      sendMail(body)
    } else {
      alert('Adjuntar archivo')
    }
  }

  const handleFileChange = (
    event: FileUploadHandlerEvent,
    onChange: (file: File | null) => void
  ): void => {
    const file = event.files?.[0] ?? null
    onChange(file)
  }

  return (
    <form
      onSubmit={handleSubmit((data: MailingFormValues, event): void => {
        event?.preventDefault()
        console.log(data)
        onSubmit(data)
      })}
      className='flex flex-column gap-4 p-4 w-full align-items-stretch'
      style={{ maxWidth: '30rem', margin: '0 auto' }}
    >
      <FloatLabel>
        <InputText
          id='subject'
          {...register('subject', { required: true })}
          className='w-full'
        />
        <label htmlFor='subject'>Asunto</label>
      </FloatLabel>
      <FloatLabel>
        <InputTextarea
          id='message'
          {...register('message', { required: true })}
          className='w-full'
          autoResize
          rows={5}
        />
        <label htmlFor='message'>Mensaje</label>
      </FloatLabel>
      <FloatLabel>
        <InputText
          id='fileName'
          {...register('filename', { required: true })}
          className='w-full'
        />
        <label htmlFor='fileName'>Nombre del archivo</label>
      </FloatLabel>
      <Controller
        name='pdf'
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className='w-full'>
            <FileUpload
              name='pdf'
              mode='basic'
              chooseLabel='Seleccionar PDF'
              accept='application/pdf'
              multiple={false}
              auto
              customUpload
              className='w-full'
              chooseOptions={{ className: 'w-full justify-content-center' }}
              uploadHandler={(event) => {
                handleFileChange(event, onChange)
                event.options?.clear?.()
              }}
            />
            {value != null ? <p>{value.name}</p> : null}
          </div>
        )}
      />
      <Button
        type='submit'
        label='Enviar'
        size='small'
        outlined
        className='w-full'
      />
    </form>
  )
}
