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

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // all, communities, people, flairs

    console.log('Search API called with query:', query, 'type:', type);

    if (!query || query.length < 1) {
      return NextResponse.json({ communities: [], people: [], flairs: [] });
    }

    const supabaseAdmin = createAdminClient();
    const results: any = {
      communities: [],
      people: [],
      flairs: []
    };

    // Search communities
    if (type === 'all' || type === 'communities') {
      const { data: communities, error: commError } = await supabaseAdmin
        .from('communities')
        .select('community_id, community_name, profile_picture, banner_image')
        .ilike('community_name', `%${query}%`);

      console.log('Communities search result for', query, ':', communities, 'error:', commError);
      results.communities = communities || [];
    }

    // Search people/users
    if (type === 'all' || type === 'people') {
      const { data: people } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id, username, profile_picture, bio')
        .ilike('username', `%${query}%`)
        .limit(10);

      results.people = people || [];
    }

    // Search flairs (unique flair names across all communities)
    if (type === 'all' || type === 'flairs') {
      const { data: flairs } = await supabaseAdmin
        .from('flairs')
        .select('flair_id, name, community_id')
        .ilike('name', `%${query}%`)
        .limit(20);

      // Group by name to get unique flair names
      const uniqueFlairs = flairs?.reduce((acc: any[], flair) => {
        if (!acc.find(f => f.name === flair.name)) {
          acc.push(flair);
        }
        return acc;
      }, []) || [];

      results.flairs = uniqueFlairs;
    }

    return NextResponse.json(results);

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
