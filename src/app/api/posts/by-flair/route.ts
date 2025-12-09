import { NextResponse } from 'next/server';
import { createClient } from '@/src/utils/supabase/server';
import { createAdminClient } from '@/src/utils/supabase/admin';

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const flairName = searchParams.get('flair');

    if (!flairName) {
      return NextResponse.json(
        { error: 'Flair name is required' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();
    
    // Get user's communities
    const { data: memberData } = await supabaseAdmin
      .from('community_members')
      .select('community_id')
      .eq('user_id', user.id);

    const communityIds = memberData?.map(m => m.community_id) || [];

    if (communityIds.length === 0) {
      return NextResponse.json({ posts: [] });
    }

    // Find flairs with matching name in user's communities
    const { data: flairs } = await supabaseAdmin
      .from('flairs')
      .select('flair_id')
      .eq('name', flairName)
      .in('community_id', communityIds);

    const flairIds = flairs?.map(f => f.flair_id) || [];

    if (flairIds.length === 0) {
      return NextResponse.json({ posts: [] });
    }

    // Get posts with these flairs via junction table
    const { data: postFlairs } = await supabaseAdmin
      .from('post_flairs')
      .select('post_id')
      .in('flair_id', flairIds);

    const postIds = postFlairs?.map(pf => pf.post_id) || [];

    if (postIds.length === 0) {
      return NextResponse.json({ posts: [] });
    }

    // Fetch posts
    const { data: posts } = await supabaseAdmin
      .from('posts')
      .select(`
        post_id,
        title,
        content,
        media_url,
        created_at,
        user_profiles!posts_user_id_fkey (
          username,
          profile_picture
        ),
        communities!posts_community_id_fkey (
          community_id,
          community_name,
          profile_picture
        ),
        identifications (
          image_url,
          confidence_score,
          species (
            scientific_name,
            common_name
          )
        )
      `)
      .in('post_id', postIds)
      .order('created_at', { ascending: false })
      .limit(50);

    // Add vote counts and flairs
    const postsWithDetails = await Promise.all(
      (posts || []).map(async (post) => {
        const { count: upvotes } = await supabaseAdmin
          .from('votes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.post_id)
          .eq('vote_type', 'upvote');

        const { count: downvotes } = await supabaseAdmin
          .from('votes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.post_id)
          .eq('vote_type', 'downvote');

        const { count: commentCount } = await supabaseAdmin
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.post_id);

        const { data: postFlairs } = await supabaseAdmin
          .from('post_flairs')
          .select(`
            flairs (
              flair_id,
              name
            )
          `)
          .eq('post_id', post.post_id);

        const flairNames = postFlairs
          ?.map(pf => (pf.flairs as any)?.name)
          .filter(Boolean) || [];

        return {
          ...post,
          upvotes: upvotes || 0,
          downvotes: downvotes || 0,
          commentCount: commentCount || 0,
          flairNames
        };
      })
    );

    return NextResponse.json({ posts: postsWithDetails });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
