import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/src/utils/supabase/server';
import { createAdminClient } from '@/src/utils/supabase/admin';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: commentId } = await context.params;
    const supabase = await createServerClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { vote_type, action } = body; // vote_type: 'upvote' | 'downvote', action: 'insert' | 'update' | 'delete'

    if (!vote_type || !action) {
      return NextResponse.json({ error: 'vote_type and action are required' }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    if (action === 'delete') {
      // Remove vote
      const { error: deleteError } = await adminSupabase
        .from('votes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Error deleting comment vote:', deleteError);
        return NextResponse.json({ error: 'Failed to remove vote' }, { status: 500 });
      }

      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (action === 'insert') {
      // Insert new vote
      const { error: insertError } = await adminSupabase
        .from('votes')
        .insert({
          comment_id: commentId,
          post_id: null,
          user_id: user.id,
          vote_type: vote_type
        });

      if (insertError) {
        console.error('Error inserting comment vote:', insertError);
        return NextResponse.json({ error: 'Failed to add vote' }, { status: 500 });
      }

      return NextResponse.json({ success: true }, { status: 201 });
    }

    if (action === 'update') {
      // Update existing vote
      const { error: updateError } = await adminSupabase
        .from('votes')
        .update({ vote_type: vote_type })
        .eq('comment_id', commentId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating comment vote:', updateError);
        return NextResponse.json({ error: 'Failed to update vote' }, { status: 500 });
      }

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in POST /api/comments/[id]/vote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
