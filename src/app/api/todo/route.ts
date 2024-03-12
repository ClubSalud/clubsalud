import { PrismaClient, AccountPermissions } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { parse } from 'cookie'
import { Account } from "@prisma/client"

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const db: PrismaClient = new PrismaClient
    const res: Account = await db.account.create({
      data: {
        username: "gabi",
        password: "pollo",
        permissions: "OWN"
      }
    })
    // const res = await db.account.deleteMany()
    return new Response(JSON.stringify(res), {
      status:200
    })
  } catch (error) {
    return new Response(JSON.stringify('Server error'), {
      status:500
    })
  }
}