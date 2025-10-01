'use client'

import { type ReactElement } from 'react'
import { Carousel } from 'primereact/carousel'
import ManagementProfile from './ManagementProfile'

export default function Management(): ReactElement {
  const profiles = [
    {
      src: '/images/profesionales/oscar_franchi.jpg',
      name: 'Dr. Oscar Franchi',
      description:
        'Director de Medintt. Médico especialista en Ortopedia, Traumatología y Medicina del Trabajo. Formación en Cirugía Mini Invasiva del Pie.',
      socialmedia: [
        {
          url: 'https://www.instagram.com/droscarfranchi',
          icon: 'pi pi-instagram'
        },
        {
          url: 'https://www.facebook.com/oscar.franchi.9',
          icon: 'pi pi-facebook'
        },
        {
          url: 'https://www.linkedin.com/in/oscar-franchi-74b0b810',
          icon: 'pi pi-linkedin'
        }
      ]
    },
    {
      src: '/images/profesionales/cecilia_chacon.jpg',
      name: 'Dra. Cecilia Chacón',
      description:
        'Gerente general. Especialista en clínica médica. Auditoría médica y Gestión de los Servicios de Salud.',
      socialmedia: [
        {
          url: 'https://www.instagram.com/cecilia.mariela.chacon',
          icon: 'pi pi-instagram'
        },
        {
          url: 'https://www.facebook.com/ceciliamchacon',
          icon: 'pi pi-facebook'
        },
        {
          url: 'https://www.linkedin.com/in/cecilia-chacon-37003b10',
          icon: 'pi pi-linkedin'
        }
      ]
    },
    {
      src: '/images/profesionales/sergio_luscher.jpg',
      name: 'Dr. Sergio Luscher',
      description:
        'Especialista en Medicina del Deporte, Especialista en Traumatología y Ortopedia, Profesor Nacional de Educación Física.',
      socialmedia: [
        {
          url: 'https://www.instagram.com/sergio.luscher',
          icon: 'pi pi-instagram'
        },
        {
          url: 'https://www.facebook.com/sergiohugo.luscher',
          icon: 'pi pi-facebook'
        }
      ]
    },
    {
      src: '/images/profesionales/viviana.jpg',
      name: 'Dra. Viviana',
      description: 'Desmatóloga',
      socialmedia: []
    },
    {
      src: '/images/profesionales/araceli.jpg',
      name: 'Araceli',
      description: 'Secretaria',
      socialmedia: []
    },
    {
      src: '/images/profesionales/miguel_briñon.jpg',
      name: 'Dr. Briñon Miguel',
      description: 'Cirujano',
      socialmedia: []
    },
    {
      src: '/images/profesionales/claudio_martinez.jpg',
      name: 'Martinez Claudio',
      description: 'Nutricionista',
      socialmedia: []
    },
    {
      src: '/images/profesionales/constantini_pablo.jpg',
      name: 'Dr. Constantini Pablo',
      description: 'Neurólogo',
      socialmedia: []
    },
    {
      src: '/images/profesionales/fillippelli_fernando.jpg',
      name: 'Dr. Fillippelli Fernando',
      description: 'Gastroenterólogo',
      socialmedia: []
    },
    {
      src: '/images/profesionales/riffo_mauricio.jpg',
      name: 'Riffo Mauricio',
      description: 'Técnico de egometrías',
      socialmedia: []
    },
    {
      src: '/images/profesionales/constanza_olga.jpg',
      name: 'Dra. Constanza Fernandez Olga',
      description: 'Otorrinolaringóloga',
      socialmedia: []
    },
    {
      src: '/images/profesionales/carla.jpg',
      name: 'Carla',
      description: '',
      socialmedia: []
    },
    {
      src: '/images/profesionales/pereyra_paula.jpg',
      name: 'Pereyra Cerasuolo Maria Paula',
      description: '',
      socialmedia: []
    }
  ]

  return (
    <div className='flex flex-column p-4 justify-content-center align-items-center gap-4'>
      <span className='text-2xl font-bold'>Nuestros profesionales</span>
      <div className='w-full'>
        <Carousel
          value={profiles}
          numVisible={3}
          numScroll={1}
          circular
          autoplayInterval={6000}
          className='management-carousel'
          showNavigators
          prevIcon='pi pi-chevron-left'
          nextIcon='pi pi-chevron-right'
          itemTemplate={(profile) => (
            <div
              key={profile.name}
              className='flex justify-content-center h-full'
            >
              <ManagementProfile
                src={profile.src}
                name={profile.name}
                description={profile.description}
                socialmedia={profile.socialmedia}
              />
            </div>
          )}
          responsiveOptions={[
            {
              breakpoint: '1199px',
              numVisible: 2,
              numScroll: 1
            },
            {
              breakpoint: '767px',
              numVisible: 1,
              numScroll: 1
            }
          ]}
        />
      </div>
    </div>
  )
}
