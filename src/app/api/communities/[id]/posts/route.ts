import { NextResponse } from 'next/server';
import { createAdminClient } from '@/src/utils/supabase/admin';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: communityId } = await context.params;
    
    // Use admin client to bypass RLS
    const supabaseAdmin = createAdminClient();
    
    // Get posts for this community with user profiles
    const { data: posts, error } = await supabaseAdmin
      .from('posts')
      .select(`
        post_id,
        user_id,
        title,
        content,
        media_url,
        created_at,
        location,
        latitude,
        longitude,
        user_profiles (
          username,
          profile_picture,
          is_expert
        )
      `)
      .eq('community_id', communityId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    // Get vote counts for each post
    const postsWithVotes = await Promise.all(
      (posts || []).map(async (post) => {
        const { data: votes } = await supabaseAdmin
          .from('votes')
          .select('vote_type')
          .eq('post_id', post.post_id);

        const upvotes = votes?.filter(v => v.vote_type === 'upvote').length || 0;
        const downvotes = votes?.filter(v => v.vote_type === 'downvote').length || 0;

        // Get comment count
        const { count: commentCount } = await supabaseAdmin
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.post_id);

        return {
          ...post,
          upvotes,
          downvotes,
          comment_count: commentCount || 0
        };
      })
    );

    return NextResponse.json({ posts: postsWithVotes });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
