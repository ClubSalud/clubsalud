import { type ReactElement } from 'react'
import { useForm } from 'react-hook-form'
import { Class_, CreateClass_ } from 'utils/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClass } from 'queries/classes'

export default function ClassCard({ closeModal }): ReactElement {
  const query = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: createClass,
    async onSuccess(data) {
      reset()
      closeModal()
      await query.setQueryData(['class'], (oldData: Class_[]) => [
        ...oldData,
        data.data
      ])
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  return (
    <div className='w-full h-full bg-white rounded p-2'>
      <form
        action=''
        id={'class'}
        className='flex flex-col justify-start items-end'
        onSubmit={handleSubmit((data) => {
          mutate(data as CreateClass_)
        })}
      >
        <div className='flex flex-row'>
          <ul
            role='list'
            className='divide-y divide-gray-200 dark:divide-gray-700 w-full'
          >
            <li className='flex flex-row items-center justify-between w-full mb-1 mt-1'>
              <label className='block mb-2 text-lg font-medium text-gray-900'>
                Nombre
              </label>
              <div>
                <input
                  type='text'
                  id='name'
                  form={'class'}
                  className='w-36 bg-gray-50 border text-right border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  {...register('name', {
                    required: {
                      value: true,
                      message: 'El nombre requerido'
                    }
                  })}
                />
                {errors?.name && (
                  <span className='inputError'>
                    {errors.name.message as string}
                  </span>
                )}
              </div>
            </li>
            <li className='flex flex-row items-center justify-between w-full mb-1 mt-1'>
              <label className='block mb-2 text-lg font-medium text-gray-900'>
                Duración (hs)
              </label>
              <div>
                <input
                  type='number'
                  id='duration'
                  form={'class'}
                  className='w-36 bg-gray-50 border text-right border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  {...register('duration', {
                    required: {
                      value: true,
                      message: 'La duración es requerida'
                    }
                  })}
                />
                {errors?.duration && (
                  <span className='inputError'>
                    {errors.duration.message as string}
                  </span>
                )}
              </div>
            </li>
          </ul>
        </div>
        <button
          className='blueButtonForm p-1'
          type='submit'
        >
          Enviar
        </button>
      </form>
    </div>
  )
}