import jwt  from "jsonwebtoken"
import { serialize } from 'cookie'
import { NextRequest, NextResponse } from "next/server"
import { PrismaClient, Account } from "@prisma/client"
import { LogIn } from "utils/types"
import prisma from "utils/prisma"

const DAYS: number = 60;
const db: PrismaClient = prisma

const daysToSeconds = (days: number): number => days * 24 * 60 * 60;

export async function POST(req: NextRequest): Promise<Response> {
  const body: LogIn = await req.json()
  // console.log(body)

  try {
    const userMatch: Account = await db.account.findFirst({
      where: {
        username: body.username
      }
    })

    if(userMatch !== null && body.username === userMatch.username && body.password === userMatch.password) {
      const user: Account = {
        id: userMatch.id,
        username: userMatch.username,
        password: userMatch.password,
        permissions: userMatch.permissions
      }
      const token: string = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + daysToSeconds(DAYS),
        ...user
      }, 'secret')

      
      // const serialized = serialize(`${userMatch.username}accesToken`, token, {
      //   httpOnly: true,
      //   secure: false, // true for production
      //   sameSite: none, // strict for same site in production
      //   maxAge: 1000 * daysToSeconds(60),
      //   path: '/'
      // })
      
      return new Response(JSON.stringify({ token }), {
        status: 200,
        headers: { 'Set-Cookie': `auth=${token}; Path=/`},
      })
    }
    else {
      return new Response('error', {
        status: 400
      })
    }
  }
  catch {
    return new Response('error', {
      status: 500
    })
  }
}