import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"
import { parse } from "cookie"

export async function POST(req: NextRequest): Promise<Response> {

  try {
    const cookies: Record<string, string> = parse(`${req.cookies}` || '')
    if(cookies.auth) {
      console.log(cookies)
      // const ver = jwt.verify(cookies, 'secret')
      // return new Response(JSON.stringify('OK'), {
      //   status: 200
      // })
      return NextResponse.json('ok')
    }
    else {
      // return new Response(JSON.stringify('NO OK'), {
      //   status: 400
      // })
      return NextResponse.json('no ok')
    }

  }
  catch {
    // const response = new Response(JSON.stringify('NO OK'), {
    //   status: 500
    // })
    // return response
    return NextResponse.json('no ok')
  }
}