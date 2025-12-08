-- Create default flairs for wildlife categories
-- These will be global flairs that can be used across communities

INSERT INTO public.flairs (flair_id, community_id, name, created_at) VALUES
  (gen_random_uuid(), (SELECT community_id FROM public.communities LIMIT 1), 'Mammals', NOW()),
  (gen_random_uuid(), (SELECT community_id FROM public.communities LIMIT 1), 'Birds', NOW()),
  (gen_random_uuid(), (SELECT community_id FROM public.communities LIMIT 1), 'Reptiles', NOW()),
  (gen_random_uuid(), (SELECT community_id FROM public.communities LIMIT 1), 'Amphibians', NOW()),
  (gen_random_uuid(), (SELECT community_id FROM public.communities LIMIT 1), 'Fish', NOW()),
  (gen_random_uuid(), (SELECT community_id FROM public.communities LIMIT 1), 'Insects', NOW()),
  (gen_random_uuid(), (SELECT community_id FROM public.communities LIMIT 1), 'Arachnids', NOW()),
  (gen_random_uuid(), (SELECT community_id FROM public.communities LIMIT 1), 'Mollusks', NOW()),
  (gen_random_uuid(), (SELECT community_id FROM public.communities LIMIT 1), 'Crustaceans', NOW()),
  (gen_random_uuid(), (SELECT community_id FROM public.communities LIMIT 1), 'Plants', NOW()),
  (gen_random_uuid(), (SELECT community_id FROM public.communities LIMIT 1), 'Fungi', NOW()),
  (gen_random_uuid(), (SELECT community_id FROM public.communities LIMIT 1), 'Other', NOW())
ON CONFLICT DO NOTHING;

-- Note: In a real scenario, you'd create community-specific flairs
-- For now, we'll use a shared set of flairs
