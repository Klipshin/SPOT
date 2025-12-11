import { NextResponse } from 'next/server';
import { createClient } from '@/src/utils/supabase/server';
import { createAdminClient } from '@/src/utils/supabase/admin';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reporter_user_id, reported_user_id, content_id, type, violation } = body;

    if (!reporter_user_id || !reported_user_id || !content_id || !type || !violation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate type
    if (type !== 'post' && type !== 'comment') {
      return NextResponse.json(
        { error: 'Invalid type. Must be "post" or "comment"' },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS
    const supabaseAdmin = createAdminClient();

    const { data: report, error: reportError } = await supabaseAdmin
      .from('reports')
      .insert({
        reporter_user_id: user.id,
        reported_user_id,
        content_id,
        type,
        violation,
      })
      .select()
      .single();

    if (reportError) {
      console.error('Error creating report:', reportError);
      return NextResponse.json(
        { error: reportError.message || 'Failed to create report', details: reportError },
        { status: 500 }
      );
    }

    return NextResponse.json({ report }, { status: 201 });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

