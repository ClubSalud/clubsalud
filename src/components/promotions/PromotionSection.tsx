import { useQuery } from '@tanstack/react-query'
import { getPromotions } from 'queries/promotions'
import { type ReactElement } from 'react'
import PromotionCard from './PromotionCard'
import { type Promotion } from 'utils/types'

export default function PromotionSection(): ReactElement {
  const { data } = useQuery({
    queryKey: ['prom'],
    queryFn: async () => {
      const response = await getPromotions()
      return response
    }
  })

  return (
    <section
      className='h-max scrollHidden'
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(10rem,1fr))',
        gap: '0.5rem',
        alignContent: 'flex-start',
        justifyItems: 'center',
        width: '100%',
        margin: '1rem'
      }}
    >
      {data?.map((promotion: Promotion, index: number) => (
        <PromotionCard
          promotion={promotion}
          key={index}
        ></PromotionCard>
      ))}
    </section>
  )
}
