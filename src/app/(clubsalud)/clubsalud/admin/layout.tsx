'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef, type ReactElement } from 'react'
import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { Permissions } from 'utils/ClubSalud/types'
import { PanelMenu } from 'primereact/panelmenu'
import logo from '../../../../../public/logos/logo_large.png'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { ScrollPanel } from 'primereact/scrollpanel'
import {
  hasPermission,
  hasValidClubSaludToken,
  removeDataSessionClubSalud
} from 'utils/ClubSalud/auth'
import { type MenuItem } from 'primereact/menuitem'
import { Toast } from 'primereact/toast'
import { setToastRef } from 'components/ClubSalud/toastService'

const logOut = (router: AppRouterInstance): void => {
  try {
    removeDataSessionClubSalud()
    router.push('/clubsalud')
  } catch (error) {}
}

const itemRenderer = (item, options): ReactElement => {
  return (
    <a
      href={item.url}
      className='flex align-items-center px-3 py-3 cursor-pointer no-underline text-white'
    >
      <span className={`${item.icon} text-primary`} />
      <span className='mx-2 font-semibold'>{item.label}</span>
      {item.badge && (
        <Badge
          className='ml-auto'
          value={item.badge}
        />
      )}
      {item.shortcut && (
        <span className='ml-auto border-1 surface-border border-round surface-100 text-xs p-1'>
          {item.shortcut}
        </span>
      )}
    </a>
  )
}

const getItems = async (setItems, router: AppRouterInstance): Promise<void> => {
  const items = [
    {
      label: 'Cuentas',
      icon: 'pi pi-users',
      template: itemRenderer,
      url: '/clubsalud/admin/accounts',
      show: hasPermission([Permissions.ADM, Permissions.OWN])
    },
    {
      label: 'Clases y Ofertas',
      icon: 'pi pi-megaphone',
      template: itemRenderer,
      url: '/clubsalud//admin/classes',
      show: hasPermission([Permissions.ADM, Permissions.OWN, Permissions.MEM])
    },
    {
      label: 'Asistencia',
      icon: 'pi pi-calendar',
      template: itemRenderer,
      url: '/clubsalud/admin/attendance',
      show: hasPermission([Permissions.ADM, Permissions.OWN])
    },
    {
      label: 'Suscripciones',
      icon: 'pi pi-list-check',
      template: itemRenderer,
      url: '/clubsalud/admin/subscriptions',
      show: hasPermission([Permissions.ADM, Permissions.OWN])
    },
    {
      label: 'Cobros',
      icon: 'pi pi-dollar',
      template: itemRenderer,
      url: '/clubsalud/admin/bills',
      show: hasPermission([Permissions.ADM, Permissions.OWN])
    },
    {
      label: 'Pagos',
      icon: 'pi pi-money-bill',
      template: itemRenderer,
      url: '/clubsalud/admin/payments',
      show: hasPermission([Permissions.ADM, Permissions.OWN])
    },
    {
      label: 'Notificaciones',
      icon: 'pi pi-bell',
      template: itemRenderer,
      url: '/clubsalud/admin/notifications',
      show: hasPermission([
        Permissions.ADM,
        Permissions.OWN,
        Permissions.INS,
        Permissions.MEM,
        Permissions.OTHER
      ])
    },
    {
      label: 'Empleados',
      icon: 'pi pi-user',
      template: itemRenderer,
      url: '/clubsalud/admin/employees',
      show: hasPermission([Permissions.OWN])
    },
    {
      label: 'Horarios',
      icon: 'pi pi-clock',
      template: itemRenderer,
      url: '/clubsalud/admin/schedule',
      show: hasPermission([
        Permissions.ADM,
        Permissions.OWN,
        Permissions.INS,
        Permissions.MEM
      ])
    },
    {
      label: 'Obras sociales',
      icon: 'pi pi-heart',
      template: itemRenderer,
      url: '/clubsalud/admin/healthPlan',
      show: hasPermission([Permissions.OWN])
    },
    {
      label: 'Balances',
      icon: 'pi pi-chart-line',
      template: itemRenderer,
      url: '/clubsalud/admin/accounting',
      show: hasPermission([Permissions.OWN])
    },
    {
      label: 'Reportes',
      icon: 'pi pi-chart-bar',
      template: itemRenderer,
      url: '/clubsalud/admin/reports',
      show: hasPermission([Permissions.OWN, Permissions.ADM])
    },
    {
      label: 'Inicio',
      icon: 'pi pi-id-card',
      template: itemRenderer,
      url: '/clubsalud/admin',
      show: hasPermission([
        Permissions.ADM,
        Permissions.OWN,
        Permissions.INS,
        Permissions.MEM,
        Permissions.OTHER
      ])
    },
    {
      label: 'LOGS',
      icon: 'pi pi-align-justify',
      template: itemRenderer,
      url: '/clubsalud/admin/logs',
      show: hasPermission([Permissions.OWN])
    },
    {
      label: 'Salir',
      icon: 'pi pi-sign-out',
      template: itemRenderer,
      command: () => {
        logOut(router)
      },
      show: hasPermission([
        Permissions.ADM,
        Permissions.OWN,
        Permissions.INS,
        Permissions.MEM,
        Permissions.OTHER
      ])
    }
  ]
  setItems(items.filter((item) => item.show))
}

export default function AdminLayout({ children }: any): ReactElement {
  const toast = useRef(null)

  useEffect(() => {
    setToastRef(toast)
  }, [])

  const router: AppRouterInstance = useRouter()
  const [drop, setDrop] = useState<boolean>(false)
  const [items, setItems] = useState<MenuItem[]>([])

  useEffect(() => {
    if (!hasValidClubSaludToken()) {
      router.push('/clubsalud')
    }
    void getItems(setItems, router)
  }, [router])

  return (
    <div className='flex flex-row w-full'>
      <Toast
        ref={toast}
        position='top-right'
      />
      <div className='flex-grow-1 h-screen z-0'>{children}</div>
      <div className='md:relative absolute'>
        {drop && (
          <ScrollPanel className='max-h-screen h-screen'>
            <div className='p-2 rounded flex flex-column'>
              <Image
                src={logo}
                height={80}
                alt='Club Salud'
                className='align-self-center my-1 border-round-lg'
              />
              <PanelMenu
                model={items}
                className=''
                // pt={{ menuitem: { className: 'bg-black' } }}
              />
            </div>
          </ScrollPanel>
        )}
        <Button
          icon='pi pi-bars'
          className='fixed md:absolute top-0 right-0 md:right-100 m-2 z-5'
          onClick={() => {
            setDrop((drop) => !drop)
          }}
        />
      </div>
    </div>
  )
}
