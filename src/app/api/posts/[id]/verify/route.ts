import { NextResponse } from 'next/server';
import { createClient } from '@/src/utils/supabase/server';
import { createAdminClient } from '@/src/utils/supabase/admin';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an expert
    const supabaseAdmin = createAdminClient();
    
    // First check user_profiles for is_expert flag
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('is_expert')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profileData || !profileData.is_expert) {
      return NextResponse.json({ error: 'Only verified experts can verify species' }, { status: 403 });
    }

    // Get or create expert record
    let { data: expertData, error: expertError } = await supabaseAdmin
      .from('experts')
      .select('expert_id, is_verified')
      .eq('user_id', user.id)
      .single();

    // If no expert record exists, create one
    if (expertError && expertError.code === 'PGRST116') {
      const { data: newExpert, error: createError } = await supabaseAdmin
        .from('experts')
        .insert({
          user_id: user.id,
          occupation: 'Wildlife Expert',
          is_verified: true
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating expert record:', createError);
        return NextResponse.json({ error: 'Failed to create expert record' }, { status: 500 });
      }
      
      expertData = newExpert;
    } else if (expertError || !expertData) {
      return NextResponse.json({ error: 'Expert verification failed' }, { status: 403 });
    }

    const { id: postId } = await params;
    const body = await request.json();
    const {
      scientific_name,
      common_name,
      habitat,
      conservation_status,
      behavior,
      image_url,
      guidance,
      safety_level,
      validation_notes
    } = body;

    // Get the post to find its identification_id
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select('identification_id, user_id, media_url')
      .eq('post_id', postId)
      .single();

    if (postError || !post) {
      console.error('Post not found error:', postError);
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    console.log('Found post:', { postId, identificationId: post.identification_id });

    // If post doesn't have an identification, create one first
    let identificationId = post.identification_id;
    if (!identificationId) {
      console.log('Creating new identification for post:', postId);
      const { data: newIdentification, error: identError } = await supabaseAdmin
        .from('identifications')
        .insert({
          image_url: post.media_url,
          confidence_score: 1.0
        })
        .select()
        .single();

      if (identError || !newIdentification) {
        console.error('Failed to create identification:', identError);
        return NextResponse.json({ error: 'Failed to create identification record' }, { status: 500 });
      }

      identificationId = newIdentification.identification_id;

      // Update the post with the new identification_id
      const { error: postUpdateError } = await supabaseAdmin
        .from('posts')
        .update({ identification_id: identificationId })
        .eq('post_id', postId);

      if (postUpdateError) {
        console.error('Failed to update post with identification:', postUpdateError);
        return NextResponse.json({ error: 'Failed to link identification to post' }, { status: 500 });
      }
      
      console.log('Created identification:', identificationId);
    }

    // Create or update species entry
    const { data: speciesData, error: speciesError } = await supabaseAdmin
      .from('species')
      .insert({
        scientific_name,
        common_name,
        habitat,
        conservation_status,
        behavior,
        image_url
      })
      .select()
      .single();

    if (speciesError) {
      console.error('Species creation error:', speciesError);
      return NextResponse.json({ 
        error: 'Failed to create species entry', 
        details: speciesError.message || speciesError 
      }, { status: 500 });
    }

    // Create safety protocol for the species
    if (guidance || safety_level) {
      await supabaseAdmin
        .from('safety_protocols')
        .insert({
          species_id: speciesData.species_id,
          guidance,
          safety_level
        });
    }

    // Update the identification with the species_id
    const { error: identificationUpdateError } = await supabaseAdmin
      .from('identifications')
      .update({ species_id: speciesData.species_id })
      .eq('identification_id', identificationId);

    if (identificationUpdateError) {
      console.error('Identification update error:', identificationUpdateError);
      return NextResponse.json({ error: 'Failed to update identification', details: identificationUpdateError }, { status: 500 });
    }

    console.log('Species verified successfully:', {
      postId,
      speciesId: speciesData.species_id,
      scientificName: scientific_name,
      identificationId: identificationId
    });

    // Create expert validation record
    const { error: validationError } = await supabaseAdmin
      .from('expert_validations')
      .insert({
        identification_id: identificationId,
        expert_id: expertData!.expert_id,
        validation_status: 'verified',
        validation_notes
      });

    if (validationError) {
      return NextResponse.json({ error: 'Failed to create validation record', details: validationError }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      species: speciesData,
      message: 'Species verified successfully'
    });

  } catch (error: any) {
    console.error('Error verifying species:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}
