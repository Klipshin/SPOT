import { createClient } from '@/src/utils/supabase/server';
import { createAdminClient } from '@/src/utils/supabase/admin';
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

    // Check if user is already a member
    const { data: existingMember } = await supabaseAdmin
      .from('community_members')
      .select('*')
      .eq('community_id', communityId)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      return NextResponse.json({ 
        error: 'Already a member of this community' 
      }, { status: 400 });
    }

    // Add user as a member
    const { error: insertError } = await supabaseAdmin
      .from('community_members')
      .insert({
        community_id: communityId,
        user_id: user.id,
        community_role: false, // false = regular member, true = moderator
        is_active: true
      });

    if (insertError) {
      console.error('Error joining community:', insertError);
      return NextResponse.json({ 
        error: 'Failed to join community' 
      }, { status: 500 });
    }

    // Update community member count
    const { error: updateError } = await supabaseAdmin.rpc('increment_member_count', {
      p_community_id: communityId
    });

    if (updateError) {
      console.error('Error updating member count:', updateError);
      // Don't fail the request if this fails
    }

    return NextResponse.json({ 
      success: true,
      message: 'Successfully joined community' 
    });

  } catch (error) {
    console.error('Error joining community:', error);
    return NextResponse.json({ 
      error: 'Failed to join community' 
    }, { status: 500 });
  }
}
