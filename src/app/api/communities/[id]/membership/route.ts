import { createClient } from '@/src/utils/supabase/server';
import { createAdminClient } from '@/src/utils/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: communityId } = await params;
    const supabase = await createClient();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ 
        isMember: false, 
        role: null,
        message: 'Not authenticated' 
      }, { status: 401 });
    }

    // Use admin client to bypass RLS
    const supabaseAdmin = createAdminClient();

    // Check if user is a member of this community
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from('community_members')
      .select('community_role')
      .eq('community_id', communityId)
      .eq('user_id', user.id)
      .single();

    console.log('Membership check:', { communityId, userId: user.id, membership, error: membershipError });

    if (membershipError) {
      // User is not a member
      return NextResponse.json({ 
        isMember: false, 
        role: null 
      });
    }

    // User is a member - return their role
    const role = membership.community_role ? 'moderator' : 'member';
    console.log('Membership result:', { isMember: true, role });
    return NextResponse.json({ 
      isMember: true, 
      role // Convert boolean to string
    });

  } catch (error) {
    console.error('Error checking membership:', error);
    return NextResponse.json({ 
      error: 'Failed to check membership' 
    }, { status: 500 });
  }
}
