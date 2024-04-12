'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import MemberCard from 'components/member/MemberCard'
import { useRouter } from 'next/navigation'
import { deleteAccount } from 'queries/accounts'
import { useState, type ReactElement } from 'react'
import { type Account } from 'utils/types'
import { useModal } from 'utils/useModal'
import { CreateAccountForm } from './CreateAccountForm'
import Modal from 'components/Modal'
import InstructorCard from 'components/instructor/InstructorCard'

interface params {
  account: Account | undefined
}
export default function AccountInfo({ account }: params): ReactElement {
  const [member, changeMember] = useState(false)
  const [instructor, changeInstructor] = useState(false)
  const [isOpenEdit, openEdit, closeEdit] = useModal(false)
  const router = useRouter()
  const query = useQueryClient()

  const { mutate: delete_ } = useMutation({
    mutationFn: async (id: number) => {
      await deleteAccount(id)
    },
    onSuccess: async () => {
      await query.refetchQueries({ queryKey: ['acc'] })
      router.push('/admin/accounts')
    }
  })
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between border-b-2 border-gray-400 p-2'>
        <h2 className='text-2xl'>Cuenta</h2>
        <div className='flex gap-4'>
          <button
            className='light-blue-border-button'
            onClick={openEdit}
          >
            Editar
          </button>
          <button
            className='light-red-border-button'
            onClick={async () => {
              delete_(Number(account?.id))
            }}
          >
            Eliminar
          </button>
        </div>
        <Modal
          isOpen={isOpenEdit}
          closeModal={closeEdit}
        >
          <CreateAccountForm
            account={account}
            closeModal={closeEdit}
          ></CreateAccountForm>
        </Modal>
      </div>
      <div className='flex gap-2'>
        <label className='min-w-[10rem]'>Usuario: </label>
        <p>{account?.username}</p>
      </div>
      <div className='flex gap-2'>
        <label className='min-w-[10rem]'>Permisos: </label>
        <p>{account?.permissions}</p>
      </div>
      <div className='flex flex-col gap-2'>
        <hr />
        Perfiles asociados
        {account?.memberAccount && (
          <div className='flex flex-col gap-2 w-full items-center'>
            <button
              className='bg-gray-200 rounded w-full p-2 text-start'
              onClick={() => {
                changeMember((prev) => !prev)
              }}
            >
              Alumno: {account.memberAccount.name}
            </button>
            {member && (
              <div className='w-full'>
                <MemberCard member={account.memberAccount}></MemberCard>
              </div>
            )}
          </div>
        )}
        {account?.instructorAccount && (
          <div className='flex flex-col gap-2 w-full items-center'>
            <button
              className='bg-gray-200 rounded w-full p-2 text-start'
              onClick={() => {
                changeInstructor((prev) => !prev)
              }}
            >
              Profesor: {account.instructorAccount.name}
            </button>
            {instructor && (
              <div className='w-full'>
                <InstructorCard
                  instructor={account.instructorAccount}
                ></InstructorCard>
              </div>
            )}
          </div>
        )}
        <hr />
      </div>
    </div>
  )
}