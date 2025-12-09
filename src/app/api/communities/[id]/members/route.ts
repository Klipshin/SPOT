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
    
    // Get members of this community with their profiles
    const { data: members, error } = await supabaseAdmin
      .from('community_members')
      .select(`
        user_id,
        community_role,
        is_active,
        user_profiles (
          username,
          name,
          profile_picture
        )
      `)
      .eq('community_id', communityId)
      .order('community_role', { ascending: false });

    if (error) {
      console.error('Error fetching members:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch members' },
        { status: 500 }
      );
    }

    return NextResponse.json({ members: members || [] });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
