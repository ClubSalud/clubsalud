import { type PrismaClient, type Member, MemberState } from '@prisma/client'
import prisma from 'utils/ClubSalud/prisma'
import { type NextRequest } from 'next/server'
import JSONbig from 'json-bigint'
const db: PrismaClient = prisma

export async function GET(req: NextRequest): Promise<Response> {
  const searchParams: URLSearchParams = req.nextUrl.searchParams
  const page: number = Number(searchParams.get('page'))
  const state: MemberState = MemberState[searchParams.get('state') ?? 'OTHER']

  try {
    /**
     * page=-1 returns total pages number
     */
    if (page === -1) {
      const total: number = await db.member.count()
      return new Response(JSONbig.stringify({ total }), {
        status: 200
      })
    } else if (state === MemberState.ACTIVE) {
      const members: Member[] = await db.member.findMany({
        where: {
          state: MemberState.ACTIVE
        },
        include: {
          account: true,
          planSubscribed: { include: { plan: true } },
          memberSubscription: {
            include: {
              promotion: true,
              plan: true,
              payment: true,
              billedConsultation: true
            }
          },
          memberAttendance: { include: { class: true } },
          payment: true,
          registrationForm: true,
          followUpForm: true
        }
      })
      return new Response(JSONbig.stringify(members), {
        status: 200
      })
    } else if (state === MemberState.INACTIVE) {
      const members: Member[] = await db.member.findMany({
        where: {
          state: MemberState.INACTIVE
        },
        include: {
          account: true,
          planSubscribed: { include: { plan: true } },
          memberSubscription: {
            include: {
              promotion: true,
              plan: true,
              payment: true,
              billedConsultation: true
            }
          },
          memberAttendance: { include: { class: true } },
          payment: true,
          registrationForm: true,
          followUpForm: true
        }
      })
      return new Response(JSONbig.stringify(members), {
        status: 200
      })
    } else {
      /**
       * page=0 returns all accounts
       */

      const members: Member[] = await db.member.findMany({
        include: {
          account: true,
          planSubscribed: { include: { plan: true } },
          memberSubscription: {
            include: {
              promotion: true,
              plan: true,
              payment: true,
              billedConsultation: true
            }
          },
          memberAttendance: { include: { class: true } },
          payment: true,
          registrationForm: true,
          followUpForm: true
        }
      })
      return new Response(JSONbig.stringify(members), {
        status: 200
      })
    }
  } catch (error) {
    console.log(error)
    return new Response(JSONbig.stringify('Internal Server Error :('), {
      status: 500
    })
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const data = await req.json()
    const parsed = {
      name: data.name,
      lastName: data.lastName,
      dni: BigInt(data.dni as number),
      cuit: data.cuit ? BigInt(data.cuit as number) : null,
      phoneNumber: BigInt(data.phoneNumber as number),
      address: data.address,
      inscriptionDate: data.inscriptionDate,
      derivedBy: data.derivedBy,
      afiliateNumber: BigInt(data.afiliateNumber as number),
      state: MemberState.ACTIVE,
      birthday: data.birthday
    }

    const res: Member = await db.member.create({
      data: {
        ...parsed,
        account: {
          connect: {
            id: data.accountId
          }
        }
      }
    })
    if (data.planSubscribed) {
      await prisma.healthPlanSubscribed?.create({
        data: {
          afiliateNumber: data.afiliateNumberOS,
          member: {
            connect: {
              id: res.id
            }
          },
          plan: {
            connect: {
              id: data.planSubscribed
            }
          }
        }
      })
    }

    return new Response(JSONbig.stringify(res), {
      status: 200
    })
  } catch (error) {
    console.log(error)
    return new Response(JSONbig.stringify(error), {
      status: 400
    })
  }
}

export async function DELETE(req: NextRequest): Promise<Response> {
  try {
    const data: { id: number } = await req.json()
    const res: Member = await db.member.delete({
      where: {
        id: data.id
      }
    })
    return new Response(JSONbig.stringify(res), {
      status: 200
    })
  } catch (error) {
    return new Response('No se pudo eliminar el usuario', {
      status: 400
    })
  }
}

export async function PATCH(req: NextRequest): Promise<Response> {
  try {
    const data: Member = await req.json()
    const parsed = {
      name: data.name,
      lastName: data.lastName,
      dni: Number(data.dni),
      cuit: data?.cuit ? Number(data?.cuit) : null,
      phoneNumber: Number(data.phoneNumber),
      address: data.address,
      inscriptionDate: data.inscriptionDate,
      cancelationDate: data?.cancelationDate ? data?.cancelationDate : null,
      cancelationReason: data?.cancelationReason ?? null,
      derivedBy: data.derivedBy,
      afiliateNumber: Number(data.afiliateNumber),
      state: MemberState[data.state],
      birthday: data.birthday
    }
    const id: number = Number(data.id)
    const res: Member = await db.member.update({
      where: {
        id
      },
      data: parsed
    })
    return new Response(JSONbig.stringify(res), {
      status: 200
    })
  } catch (error) {
    console.log(error)
    return new Response('No se pudo crear el usuario', {
      status: 400
    })
  }
}
