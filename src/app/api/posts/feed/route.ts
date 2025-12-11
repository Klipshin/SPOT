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

    // Use admin client to bypass RLS
    const supabaseAdmin = createAdminClient();
    
    // Get communities the user is a member of for Join/Joined status
    const { data: memberData, error: memberError } = await supabaseAdmin
      .from('community_members')
      .select('community_id')
      .eq('user_id', user.id);

    if (memberError) {
      console.error('Error fetching user communities:', memberError);
      return NextResponse.json(
        { error: 'Failed to fetch communities' },
        { status: 500 }
      );
    }

    // Fetch ALL posts from all communities with community info
    // OPTIMIZED: Limit to 20 posts to reduce bandwidth
    const { data: posts, error: postsError } = await supabaseAdmin
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
        identification_id,
        user_profiles!posts_user_id_fkey (
          username,
          profile_picture,
          is_expert
        ),
        communities!posts_community_id_fkey (
          community_id,
          community_name,
          profile_picture
        )
      `)
      .order('created_at', { ascending: false })
      .range(0, 19)
      .limit(20);

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      return NextResponse.json(
        { error: postsError.message },
        { status: 500 }
      );
    }

    // Fetch identification and species data separately for each post
    const postsWithIdentifications = await Promise.all(
      (posts || []).map(async (post) => {
        let identificationData = null;
        
        if (post.identification_id) {
          const { data: identification } = await supabaseAdmin
            .from('identifications')
            .select(`
              identification_id,
              image_url,
              confidence_score,
              species_id,
              species (
                species_id,
                scientific_name,
                common_name
              )
            `)
            .eq('identification_id', post.identification_id)
            .single();
          
          identificationData = identification;
        }

        return {
          ...post,
          identifications: identificationData
        };
      })
    );

    // Count votes for each post - OPTIMIZED: using head: true to avoid fetching data
    const postsWithVotes = await Promise.all(
      (postsWithIdentifications || []).map(async (post) => {
        const { count: upvotes } = await supabaseAdmin
          .from('votes')
          .select('vote_id', { count: 'exact', head: true })
          .eq('post_id', post.post_id)
          .eq('vote_type', 'upvote');

        const { count: downvotes } = await supabaseAdmin
          .from('votes')
          .select('vote_id', { count: 'exact', head: true })
          .eq('post_id', post.post_id)
          .eq('vote_type', 'downvote');

        const { count: commentCount } = await supabaseAdmin
          .from('comments')
          .select('comment_id', { count: 'exact', head: true })
          .eq('post_id', post.post_id);

        // Fetch flairs for this post via junction table
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

    return NextResponse.json({ posts: postsWithVotes });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
