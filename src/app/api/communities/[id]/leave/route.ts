import { createAdminClient } from '@/src/utils/supabase/admin';
import { createClient } from '@/src/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
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
        error: 'Not authenticated' 
      }, { status: 401 });
    }

    // Use admin client to bypass RLS
    const supabaseAdmin = createAdminClient();

    // Check if user is a moderator (moderators cannot leave their own community)
    const { data: membership } = await supabaseAdmin
      .from('community_members')
      .select('community_role')
      .eq('community_id', communityId)
      .eq('user_id', user.id)
      .single();

    if (membership?.community_role === true) {
      return NextResponse.json({ 
        error: 'Moderators cannot leave their own community' 
      }, { status: 400 });
    }

    // Remove user from community
    const { error: deleteError } = await supabaseAdmin
      .from('community_members')
      .delete()
      .eq('community_id', communityId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error leaving community:', deleteError);
      return NextResponse.json({ 
        error: 'Failed to leave community' 
      }, { status: 500 });
    }

    // Update community member count (decrement)
    const { error: updateError } = await supabaseAdmin.rpc('decrement_member_count', {
      p_community_id: communityId
    });

    if (updateError) {
      console.error('Error updating member count:', updateError);
      // Don't fail the request if this fails
    }

    return NextResponse.json({ 
      success: true,
      message: 'Successfully left community' 
    });

  } catch (error) {
    console.error('Error leaving community:', error);
    return NextResponse.json({ 
      error: 'Failed to leave community' 
    }, { status: 500 });
  }
}
