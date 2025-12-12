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

    console.log('Report request body:', { reporter_user_id, reported_user_id, content_id, type, violation });

    if (!reporter_user_id || !reported_user_id || !content_id || !type || !violation) {
      return NextResponse.json(
        { error: 'Missing required fields', received: { reporter_user_id: !!reporter_user_id, reported_user_id: !!reported_user_id, content_id: !!content_id, type: !!type, violation: !!violation } },
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

    // Validate UUID format (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(content_id)) {
      return NextResponse.json(
        { error: `Invalid content_id format. Expected UUID, got: ${content_id}` },
        { status: 400 }
      );
    }
    if (!uuidRegex.test(reported_user_id)) {
      return NextResponse.json(
        { error: `Invalid reported_user_id format. Expected UUID, got: ${reported_user_id}` },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS
    const supabaseAdmin = createAdminClient();

    // Verify that the content exists (post or comment)
    if (type === 'post') {
      const { data: postExists, error: postCheckError } = await supabaseAdmin
        .from('posts')
        .select('post_id')
        .eq('post_id', content_id)
        .single();
      
      if (postCheckError || !postExists) {
        return NextResponse.json(
          { error: 'Post not found', details: postCheckError },
          { status: 404 }
        );
      }
    } else if (type === 'comment') {
      const { data: commentExists, error: commentCheckError } = await supabaseAdmin
        .from('comments')
        .select('comment_id')
        .eq('comment_id', content_id)
        .single();
      
      if (commentCheckError || !commentExists) {
        return NextResponse.json(
          { error: 'Comment not found', details: commentCheckError },
          { status: 404 }
        );
      }
    }

    // Verify reported user exists
    const { data: reportedUserExists, error: userCheckError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id')
      .eq('user_id', reported_user_id)
      .single();
    
    if (userCheckError || !reportedUserExists) {
      return NextResponse.json(
        { error: 'Reported user not found', details: userCheckError },
        { status: 404 }
      );
    }

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

