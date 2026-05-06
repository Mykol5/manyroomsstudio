import { NextResponse, NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    // Get and verify token
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = verify(token, JWT_SECRET);
    if (decoded.role !== 'owner' && decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Only studio owners can create studios' }, { status: 403 });
    }

    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const capacity = parseInt(formData.get('capacity') as string);
    const description = formData.get('description') as string;
    const streetAddress = formData.get('streetAddress') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const postalCode = formData.get('postalCode') as string;
    const country = formData.get('country') as string;
    const hourlyRate = parseFloat(formData.get('hourlyRate') as string);
    const dailyRate = parseFloat(formData.get('dailyRate') as string);
    const weeklyRate = parseFloat(formData.get('weeklyRate') as string);
    const cleaningFee = parseFloat(formData.get('cleaningFee') as string);
    const amenities = JSON.parse(formData.get('amenities') as string || '[]');
    const availability = JSON.parse(formData.get('availability') as string || '{}');
    
    // Handle images
    const images = [];
    for (let i = 0; i < 10; i++) {
      const image = formData.get(`image_${i}`);
      if (image && image instanceof File) {
        // Convert to base64 or upload to Supabase Storage
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const mimeType = image.type;
        images.push(`data:${mimeType};base64,${base64}`);
      }
    }

    // Validate required fields
    if (!name || !category || !description || !streetAddress || !city || !hourlyRate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert into Supabase
    const { data: studio, error: insertError } = await supabase
      .from('studios')
      .insert([
        {
          owner_id: decoded.id,
          name,
          category,
          capacity,
          description,
          street_address: streetAddress,
          city,
          state,
          postal_code: postalCode,
          country,
          hourly_rate: hourlyRate,
          daily_rate: dailyRate,
          weekly_rate: weeklyRate,
          cleaning_fee: cleaningFee,
          amenities,
          availability,
          images,
          status: 'pending',
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json({ error: 'Failed to create studio' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      studio,
      message: 'Studio created successfully! It will be reviewed by our team.'
    });

  } catch (error) {
    console.error('Studio creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}