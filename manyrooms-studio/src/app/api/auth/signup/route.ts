// import { NextResponse, NextRequest } from 'next/server';
// import bcrypt from 'bcryptjs';
// import { sign } from 'jsonwebtoken';
// import { supabase } from '@/lib/supabase';

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// export async function POST(request: NextRequest) {
//   try {
//     const { name, email, password, role } = await request.json();

//     console.log('📝 Signup attempt:', { name, email, role });

//     // Validate
//     if (!name || !email || !password) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // First, let's get the table structure to see what columns exist
//     const { data: columns, error: columnsError } = await supabase
//       .rpc('get_table_info', { table_name: 'users' });

//     console.log('Table columns:', columns);

//     // Try to insert with basic fields first
//     const userData: any = {
//       email,
//       password: hashedPassword,
//     };

//     // Try different field name variations
//     // Check if name column exists (could be 'name', 'full_name', 'username')
//     if (name) {
//       // Try 'name' first
//       userData.name = name;
//     }

//     if (role) {
//       userData.role = role;
//     }

//     userData.created_at = new Date().toISOString();

//     console.log('Attempting insert with data:', userData);

//     const { data: user, error: insertError } = await supabase
//       .from('users')
//       .insert([userData])
//       .select()
//       .single();

//     if (insertError) {
//       console.error('❌ Insert error:', {
//         message: insertError.message,
//         details: insertError.details,
//         hint: insertError.hint,
//         code: insertError.code
//       });

//       // If error mentions 'name' column doesn't exist, try 'full_name'
//       if (insertError.message.includes('name')) {
//         console.log('Trying with full_name instead...');
//         const { data: altUser, error: altError } = await supabase
//           .from('users')
//           .insert([
//             {
//               email,
//               password: hashedPassword,
//               full_name: name,
//               role: role || 'client',
//               created_at: new Date().toISOString(),
//             }
//           ])
//           .select()
//           .single();

//         if (!altError && altUser) {
//           console.log('✅ User created with full_name');
//           const token = sign(
//             { id: altUser.id, email: altUser.email, role: altUser.role || role },
//             JWT_SECRET,
//             { expiresIn: '7d' }
//           );

//           const response = NextResponse.json({ user: altUser });
//           response.cookies.set('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict',
//             maxAge: 60 * 60 * 24 * 7,
//             path: '/',
//           });
//           return response;
//         }
//       }

//       return NextResponse.json(
//         { error: `Failed to create user: ${insertError.message}` },
//         { status: 500 }
//       );
//     }

//     console.log('✅ User created successfully:', user);

//     // Create token
//     const token = sign(
//       { id: user.id, email: user.email, role: user.role || role },
//       JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     const response = NextResponse.json({ user });
//     response.cookies.set('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 60 * 60 * 24 * 7,
//       path: '/',
//     });

//     return response;

//   } catch (error) {
//     console.error('💥 Signup unexpected error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          role: role || 'client',
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create token
    const token = sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user with metadata
    const userWithMetadata = {
      id: user.id,
      email: user.email,
      role: user.role,
      user_metadata: {
        name: user.name,
        role: user.role
      }
    };

    const response = NextResponse.json({ user: userWithMetadata });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}