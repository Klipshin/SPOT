import { NextResponse } from 'next/server';
import { createClient } from '@/src/utils/supabase/server';
import { createAdminClient } from '@/src/utils/supabase/admin';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: postId } = await params;
    const body = await request.json();
    const { reason } = body; // Optional reason for moderator deletions

    const supabaseAdmin = createAdminClient();
    
    // Get the post to check ownership and community
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select('post_id, user_id, community_id')
      .eq('post_id', postId)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user is the post author
    const isAuthor = post.user_id === user.id;

    // Check if user is a moderator of the community
    const { data: moderatorData } = await supabaseAdmin
      .from('community_members')
      .select('community_role')
      .eq('community_id', post.community_id)
      .eq('user_id', user.id)
      .single();

    const isModerator = moderatorData?.community_role === true;

    // User must be either the author or a moderator
    if (!isAuthor && !isModerator) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to delete this post' },
        { status: 403 }
      );
    }

    // If moderator is deleting someone else's post, create a deletion record
    if (isModerator && !isAuthor) {
      await supabaseAdmin
        .from('moderation_logs')
        .insert({
          community_id: post.community_id,
          moderator_id: user.id,
          action: 'delete_post',
          target_post_id: postId,
          reason: reason || 'No reason provided'
        });
    }

    // Delete the post
    const { error: deleteError } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('post_id', postId);

    if (deleteError) {
      console.error('Error deleting post:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete post' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      deletedBy: isModerator && !isAuthor ? 'moderator' : 'author',
      reason: isModerator && !isAuthor ? reason : null
    });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
