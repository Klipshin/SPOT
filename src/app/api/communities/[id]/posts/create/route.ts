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
    const { communityId, title, content, mediaUrl, flairNames } = body;

    if (!communityId || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS
    const supabaseAdmin = createAdminClient();
    
    // Handle multiple flairs - find existing or create new
    const flairIds: string[] = [];
    if (flairNames && Array.isArray(flairNames) && flairNames.length > 0) {
      for (const flairName of flairNames) {
        // Try to find existing flair
        const { data: existingFlair } = await supabaseAdmin
          .from('flairs')
          .select('flair_id')
          .eq('community_id', communityId)
          .eq('name', flairName)
          .single();
        
        if (existingFlair) {
          flairIds.push(existingFlair.flair_id);
        } else {
          // Create new flair for this community
          const { data: newFlair } = await supabaseAdmin
            .from('flairs')
            .insert({
              community_id: communityId,
              name: flairName
            })
            .select()
            .single();
          
          if (newFlair) {
            flairIds.push(newFlair.flair_id);
          }
        }
      }
    }
    
    // For posts without AI identification, we'll skip the identification requirement
    // or use a nullable field. For now, let's try to make identification_id optional
    // by checking if we can insert without it
    let identificationId = null;
    
    // If there's an image, create a placeholder identification
    if (mediaUrl) {
      // Get or create a placeholder species
      let { data: species } = await supabaseAdmin
        .from('species')
        .select('species_id')
        .limit(1)
        .single();
      
      // If no species exist, create a placeholder
      if (!species) {
        const { data: newSpecies } = await supabaseAdmin
          .from('species')
          .insert({
            scientific_name: 'Unknown',
            common_name: 'Unknown Species',
            conservation_status: 'Unknown'
          })
          .select()
          .single();
        species = newSpecies;
      }
      
      if (species) {
        const { data: identification } = await supabaseAdmin
          .from('identifications')
          .insert({
            user_id: user.id,
            species_id: species.species_id,
            confidence_score: 0,
            image_url: mediaUrl
          })
          .select()
          .single();
        
        if (identification) {
          identificationId = identification.identification_id;
        }
      }
    }
    
    // If we still don't have an identification_id, create a minimal one
    if (!identificationId) {
      // Get or create placeholder species
      let { data: species } = await supabaseAdmin
        .from('species')
        .select('species_id')
        .limit(1)
        .single();
        
      if (!species) {
        const { data: newSpecies } = await supabaseAdmin
          .from('species')
          .insert({
            scientific_name: 'Unknown',
            common_name: 'Unknown Species',
            conservation_status: 'Unknown'
          })
          .select()
          .single();
        species = newSpecies;
      }
      
      if (species) {
        const { data: identification } = await supabaseAdmin
          .from('identifications')
          .insert({
            user_id: user.id,
            species_id: species.species_id,
            confidence_score: 0
          })
          .select()
          .single();
          
        if (identification) {
          identificationId = identification.identification_id;
        }
      }
    }
    
    if (!identificationId) {
      return NextResponse.json(
        { error: 'Failed to create identification' },
        { status: 500 }
      );
    }

    // Create the post
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .insert({
        user_id: user.id,
        community_id: communityId,
        identification_id: identificationId,
        title,
        content,
        media_url: mediaUrl || null
      })
      .select()
      .single();

    if (postError) {
      console.error('Error creating post:', postError);
      return NextResponse.json(
        { error: postError.message || 'Failed to create post' },
        { status: 500 }
      );
    }

    // Create post_flairs junction entries
    if (flairIds.length > 0 && post) {
      const postFlairEntries = flairIds.map(flairId => ({
        post_id: post.post_id,
        flair_id: flairId
      }));

      const { error: flairError } = await supabaseAdmin
        .from('post_flairs')
        .insert(postFlairEntries);

      if (flairError) {
        console.error('Error creating post_flairs:', flairError);
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json({ post }, { status: 201 });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
