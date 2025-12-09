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
    
    // Get user's communities
    const { data, error } = await supabaseAdmin
      .from('community_members')
      .select(`
        community_role,
        communities (
          community_id,
          created_by,
          community_name,
          created_at,
          member_count,
          active_members,
          location,
          banner_image,
          profile_picture
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching communities:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch communities' },
        { status: 500 }
      );
    }

    // Extract communities and add role from the nested structure
    const communities = data?.map((item: any) => ({
      ...item.communities,
      role: item.community_role ? 'moderator' : 'member' // Convert boolean to string
    })).filter(Boolean) || [];

    console.log('User communities result:', { userId: user.id, count: communities.length, communities });

    return NextResponse.json({ communities });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
