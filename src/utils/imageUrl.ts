import { createClient } from '@/src/utils/supabase/client';

/**
 * Utility functions to convert Supabase storage paths to public URLs
 */

/**
 * Check if a string is already a full URL
 */
function isFullUrl(path: string | null | undefined): boolean {
  if (!path) return false;
  return path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:');
}

/**
 * Get public URL for a profile picture
 */
export function getProfilePictureUrl(filePath: string | null | undefined): string | null {
  if (!filePath) return null;
  if (isFullUrl(filePath)) return filePath;
  
  try {
    const supabase = createClient();
    if (!supabase) return filePath; // Fallback to original if client unavailable
    
    const { data } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting profile picture URL:', error);
    return filePath; // Fallback to original path
  }
}

/**
 * Get public URL for a community profile picture
 */
export function getCommunityProfilePictureUrl(filePath: string | null | undefined): string | null {
  if (!filePath) return null;
  if (isFullUrl(filePath)) return filePath;
  
  try {
    const supabase = createClient();
    if (!supabase) {
      console.warn('Supabase client not available for community profile picture URL conversion');
      return filePath;
    }
    
    // Get Supabase URL from environment variable (should be available on client)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    if (!supabaseUrl) {
      console.error('NEXT_PUBLIC_SUPABASE_URL is not set');
      return filePath;
    }
    
    // Clean the file path (remove leading slash if present, handle URL encoding)
    let cleanPath = filePath.trim();
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.slice(1);
    }
    
    // Most common bucket names for community images (in order of likelihood)
    const buckets = [
      'community-pictures',
      'communities', 
      'community-images',
      'community-profiles',
      'community-avatars'
    ];
    
    // Try using Supabase's getPublicUrl method first (most reliable)
    for (const bucket of buckets) {
      try {
        const { data, error } = supabase.storage
          .from(bucket)
          .getPublicUrl(cleanPath);
        
        if (data?.publicUrl && !error) {
          const url = data.publicUrl;
          if (url && url.startsWith('http')) {
            console.log(`✓ Community profile picture URL converted using bucket: ${bucket}`, { original: filePath, converted: url });
            return url;
          }
        }
      } catch (e) {
        // Try next bucket
        continue;
      }
    }
    
    // If getPublicUrl didn't work, construct URL manually for the primary bucket
    // This is a fallback - the browser will show a broken image if the bucket/path is wrong
    const primaryBucket = buckets[0];
    const manualUrl = `${supabaseUrl}/storage/v1/object/public/${primaryBucket}/${encodeURIComponent(cleanPath)}`;
    console.log(`⚠ Using manual URL construction for community profile picture:`, { original: filePath, bucket: primaryBucket, url: manualUrl });
    return manualUrl;
    
  } catch (error) {
    console.error('Error getting community profile picture URL:', error, { filePath });
    return filePath;
  }
}

/**
 * Get public URL for a community banner image
 */
export function getCommunityBannerUrl(filePath: string | null | undefined): string | null {
  if (!filePath) return null;
  if (isFullUrl(filePath)) return filePath;
  
  try {
    const supabase = createClient();
    if (!supabase) return filePath;
    
    // Try common bucket names for community images
    const buckets = ['community-pictures', 'communities', 'community-images', 'community-banners'];
    
    for (const bucket of buckets) {
      try {
        const { data } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);
        
        if (data.publicUrl) {
          return data.publicUrl;
        }
      } catch (e) {
        continue;
      }
    }
    
    // Fallback to manual URL construction
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      return `${supabaseUrl}/storage/v1/object/public/community-pictures/${filePath}`;
    }
    
    return filePath;
  } catch (error) {
    console.error('Error getting community banner URL:', error);
    return filePath;
  }
}

/**
 * Get public URL for post media
 */
export function getPostMediaUrl(filePath: string | null | undefined): string | null {
  if (!filePath) return null;
  if (isFullUrl(filePath)) return filePath;
  
  try {
    const supabase = createClient();
    if (!supabase) return filePath;
    
    // Try common bucket names for post media
    const buckets = ['post-media', 'posts', 'post-images', 'media'];
    
    for (const bucket of buckets) {
      try {
        const { data } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);
        
        if (data.publicUrl) {
          return data.publicUrl;
        }
      } catch (e) {
        continue;
      }
    }
    
    // Fallback to manual URL construction
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      return `${supabaseUrl}/storage/v1/object/public/post-media/${filePath}`;
    }
    
    return filePath;
  } catch (error) {
    console.error('Error getting post media URL:', error);
    return filePath;
  }
}

/**
 * Get public URL for identification image
 */
export function getIdentificationImageUrl(filePath: string | null | undefined): string | null {
  if (!filePath) return null;
  if (isFullUrl(filePath)) return filePath;
  
  // Identification images might be in the same bucket as post media
  return getPostMediaUrl(filePath);
}

/**
 * Get public URL for comment media
 */
export function getCommentMediaUrl(filePath: string | null | undefined): string | null {
  if (!filePath) return null;
  if (isFullUrl(filePath)) return filePath;
  
  // Comment media might be in the same bucket as post media
  return getPostMediaUrl(filePath);
}

