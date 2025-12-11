import { NextResponse } from 'next/server';
import { createAdminClient } from '@/src/utils/supabase/admin';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseAdmin = createAdminClient();
    const { id: postId } = await params;

    // Get the post with its identification
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select('identification_id')
      .eq('post_id', postId)
      .single();

    if (postError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Get identification with species and expert validation
    const { data: identification, error: identError } = await supabaseAdmin
      .from('identifications')
      .select(`
        *,
        species (*),
        expert_validations (
          *,
          experts (
            *,
            user_profiles:user_id (
              username,
              name,
              profile_picture
            )
          )
        )
      `)
      .eq('identification_id', post.identification_id)
      .single();

    if (identError) {
      return NextResponse.json({ error: 'Identification not found' }, { status: 404 });
    }

    // Get safety protocols for the species if it exists
    let safetyProtocols = null;
    if (identification.species_id) {
      const { data: protocols } = await supabaseAdmin
        .from('safety_protocols')
        .select('*')
        .eq('species_id', identification.species_id);
      
      safetyProtocols = protocols && protocols.length > 0 ? protocols[0] : null;
    }

    return NextResponse.json({
      identification,
      safety_protocols: safetyProtocols,
      is_verified: identification.expert_validations && identification.expert_validations.length > 0
    });

  } catch (error) {
    console.error('Error fetching verification details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
