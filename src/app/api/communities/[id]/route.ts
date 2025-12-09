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
