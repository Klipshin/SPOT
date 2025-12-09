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
    const { communityId } = body;

    if (!communityId) {
      return NextResponse.json(
        { error: 'Community ID is required' },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS
    const supabaseAdmin = createAdminClient();
    
    // Check if user is already a member
    const { data: existingMember } = await supabaseAdmin
      .from('community_members')
      .select('member_id')
      .eq('user_id', user.id)
      .eq('community_id', communityId)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: 'You are already a member of this community' },
        { status: 400 }
      );
    }

    // Add user to community_members
    const { data: member, error: memberError } = await supabaseAdmin
      .from('community_members')
      .insert({
        user_id: user.id,
        community_id: communityId,
        community_role: false, // Regular member, not moderator
        is_active: true
      })
      .select()
      .single();

    if (memberError) {
      console.error('Error adding member:', memberError);
      return NextResponse.json(
        { error: memberError.message || 'Failed to join community' },
        { status: 500 }
      );
    }

    // Update member count in communities table
    const { error: updateError } = await supabaseAdmin.rpc('increment_member_count', {
      community_id_param: communityId
    });

    // If the RPC doesn't exist, manually update the count
    if (updateError) {
      const { count } = await supabaseAdmin
        .from('community_members')
        .select('*', { count: 'exact', head: true })
        .eq('community_id', communityId);

      await supabaseAdmin
        .from('communities')
        .update({ member_count: count || 1 })
        .eq('community_id', communityId);
    }

    return NextResponse.json({ member }, { status: 201 });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
