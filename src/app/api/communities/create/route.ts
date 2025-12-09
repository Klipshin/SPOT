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

    // Get request body
    const body = await request.json();
    const { community_name, location, banner_image, profile_picture } = body;

    if (!community_name || !community_name.trim()) {
      return NextResponse.json(
        { error: 'Community name is required' },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS
    const supabaseAdmin = createAdminClient();
    
    // Create the community
    const { data: community, error: communityError } = await supabaseAdmin
      .from('communities')
      .insert({
        community_name: community_name.trim(),
        location: location && location.trim() ? location.trim() : null,
        created_by: user.id,
        member_count: 1,
        active_members: 1,
        banner_image: banner_image || null,
        profile_picture: profile_picture || null
      })
      .select()
      .single();

    if (communityError) {
      console.error('Error creating community:', communityError);
      return NextResponse.json(
        { 
          error: communityError.message || 'Failed to create community',
          details: communityError 
        },
        { status: 500 }
      );
    }

    // Add creator as a member with admin role
    const { error: memberError } = await supabaseAdmin
      .from('community_members')
      .insert({
        user_id: user.id,
        community_id: community.community_id,
        community_role: true, // true = admin/moderator
        is_active: true
      });

    if (memberError) {
      console.error('Error adding member:', memberError);
      // Rollback - delete the community if member insertion fails
      await supabaseAdmin.from('communities').delete().eq('community_id', community.community_id);
      return NextResponse.json(
        { 
          error: memberError.message || 'Failed to add user to community',
          details: memberError 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      community 
    });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
