import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/src/utils/supabase/server';
import { createAdminClient } from '@/src/utils/supabase/admin';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;
    const supabase = await createServerClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, media_url, parent_comment_id } = body;

    console.log('Creating comment with:', { postId, content, media_url, parent_comment_id, userId: user.id });

    // Require either content or media_url
    if ((!content || !content.trim()) && !media_url) {
      return NextResponse.json({ error: 'Comment content or image is required' }, { status: 400 });
    }

    // Use admin client to insert comment
    const adminSupabase = createAdminClient();
    
    const commentData = {
      post_id: postId,
      user_id: user.id,
      content: content?.trim() || '[Image]', // Use placeholder text if only image
      media_url: media_url || null,
      parent_comment_id: parent_comment_id || null,
    };
    
    console.log('Inserting comment data:', commentData);
    
    const { data: comment, error: insertError } = await adminSupabase
      .from('comments')
      .insert(commentData)
      .select(`
        *,
        user_profiles (
          username,
          name,
          profile_picture
        )
      `)
      .single();

    if (insertError) {
      console.error('Error inserting comment:', insertError);
      return NextResponse.json({ error: insertError.message || 'Failed to post comment', details: insertError }, { status: 500 });
    }

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/posts/[id]/comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;
    const adminSupabase = createAdminClient();
    const supabase = await createServerClient();
    
    // Get current user (optional, for checking their votes)
    const { data: { user } } = await supabase.auth.getUser();

    const { data: comments, error } = await adminSupabase
      .from('comments')
      .select(`
        *,
        user_profiles (
          username,
          name,
          profile_picture,
          is_expert
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }

    // Get vote counts and user's votes for each comment
    const commentsWithVotes = await Promise.all(
      (comments || []).map(async (comment) => {
        // Get vote counts
        const { data: votes } = await adminSupabase
          .from('votes')
          .select('vote_type, user_id')
          .eq('comment_id', comment.comment_id);

        const upvotes = votes?.filter(v => v.vote_type === 'upvote').length || 0;
        const downvotes = votes?.filter(v => v.vote_type === 'downvote').length || 0;
        
        // Check if current user voted
        let userVote = null;
        if (user) {
          const userVoteData = votes?.find(v => v.user_id === user.id);
          if (userVoteData) {
            userVote = userVoteData.vote_type === 'upvote' ? 'up' : 'down';
          }
        }

        return {
          ...comment,
          upvotes,
          downvotes,
          userVote
        };
      })
    );

    return NextResponse.json({ comments: commentsWithVotes || [] }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/posts/[id]/comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
