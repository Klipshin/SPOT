import { NextResponse } from 'next/server';
import { createAdminClient } from '@/src/utils/supabase/admin';
import { createClient } from '@/src/utils/supabase/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: communityId } = await context.params;
    
    // Use admin client to bypass RLS
    const supabaseAdmin = createAdminClient();
    
    // Get community data
    const { data: community, error } = await supabaseAdmin
      .from('communities')
      .select('*')
      .eq('community_id', communityId)
      .single();

    if (error) {
      console.error('Error fetching community:', error);
      return NextResponse.json(
        { error: error.message || 'Community not found' },
        { status: 404 }
      );
    }

    // Get actual member counts
    const { count: totalMembers } = await supabaseAdmin
      .from('community_members')
      .select('*', { count: 'exact', head: true })
      .eq('community_id', communityId);

    const { count: activeMembers } = await supabaseAdmin
      .from('community_members')
      .select('*', { count: 'exact', head: true })
      .eq('community_id', communityId)
      .eq('is_active', true);

    // Update the counts with actual values
    community.member_count = totalMembers || 0;
    community.active_members = activeMembers || 0;

    return NextResponse.json({ community });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: communityId } = await context.params;
    
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use admin client for operations
    const supabaseAdmin = createAdminClient();

    // Verify user is a moderator of this community
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from('community_members')
      .select('community_role')
      .eq('community_id', communityId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership || !membership.community_role) {
      return NextResponse.json(
        { error: 'Only moderators can delete communities' },
        { status: 403 }
      );
    }

    // Delete community (cascade deletes should handle related records)
    const { error: deleteError } = await supabaseAdmin
      .from('communities')
      .delete()
      .eq('community_id', communityId);

    if (deleteError) {
      console.error('Error deleting community:', deleteError);
      return NextResponse.json(
        { error: deleteError.message || 'Failed to delete community' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Community deleted successfully' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
