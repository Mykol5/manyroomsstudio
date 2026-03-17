import { NextResponse, NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    // Verify token
    const decoded: any = verify(token, JWT_SECRET);
    
    // Get fresh user data from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return NextResponse.json({ user: null });
    }

    // Return user with metadata structure
    const userWithMetadata = {
      id: user.id,
      email: user.email,
      role: user.role,
      user_metadata: {
        name: user.name,
        role: user.role
      }
    };

    return NextResponse.json({ user: userWithMetadata });

  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json({ user: null });
  }
}




// import { NextResponse, NextRequest } from 'next/server';
// import { verify } from 'jsonwebtoken';
// import { supabase } from '@/lib/supabase';

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// export async function GET(request: NextRequest) {
//   try {
//     const token = request.cookies.get('token')?.value;

//     if (!token) {
//       return NextResponse.json({ user: null });
//     }

//     // Verify token
//     const decoded: any = verify(token, JWT_SECRET);
    
//     // Get fresh user data from Supabase
//     const { data: user, error } = await supabase
//       .from('users')
//       .select('id, name, email, role, created_at')
//       .eq('id', decoded.id)
//       .single();

//     if (error || !user) {
//       return NextResponse.json({ user: null });
//     }

//     return NextResponse.json({ user });

//   } catch (error) {
//     console.error('Me endpoint error:', error);
//     return NextResponse.json({ user: null });
//   }
// }