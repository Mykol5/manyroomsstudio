// src/app/api/auth/signup/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for admin actions
)

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json()

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role }
    })

    if (authError) throw authError

    // Additional user data in your table
    const { error: dbError } = await supabase
      .from('users')
      .insert([{ 
        id: authData.user.id, 
        name, 
        email, 
        role 
      }])

    if (dbError) throw dbError

    return NextResponse.json({ 
      message: 'User created successfully',
      user: authData.user 
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}