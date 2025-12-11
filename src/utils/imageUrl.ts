import { createClient } from '@/src/utils/supabase/client';

/**
 * Utility functions to convert Supabase storage paths to public URLs
 */

/**
 * Check if a string is already a full URL
 */
function isFullUrl(path: string | null | undefined): boolean {
  if (!path) return false;
  // Check for http/https URLs
  if (path.startsWith('http://') || path.startsWith('https://')) return true;
  // Check for data URLs (base64 images)
  if (path.startsWith('data:')) return true;
  // Check if it looks like a full URL (contains ://)
  if (path.includes('://')) return true;
  return false;
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
  if (!filePath) {
    console.log('getCommunityProfilePictureUrl: No file path provided');
    return null;
  }
  
  // Check if it's already a full URL (http, https, or data URL)
  if (isFullUrl(filePath)) {
    console.log('getCommunityProfilePictureUrl: Already a full URL:', filePath);
    return filePath;
  }
  
  console.log('getCommunityProfilePictureUrl: Converting path to URL:', filePath);
  
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
    
    console.log('Supabase URL:', supabaseUrl);
    
    // Clean the file path (remove leading slash if present, but keep internal slashes)
    let cleanPath = filePath.trim();
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.slice(1);
    }
    
    console.log('Cleaned path:', cleanPath);
    
    // Try multiple bucket names - community images are stored in "community-images" bucket
    const buckets = [
      'community-images', // PRIMARY: Confirmed bucket name for community images
      'community-pictures', // Fallback option
      'communities', 
      'community-profiles',
      'community-avatars',
      'profile-pictures', // Sometimes community images might be here
      'post-media',
      'media',
      'images',
      'chat-images'
    ];
    
    // Try using Supabase's getPublicUrl method for each bucket
    // Note: getPublicUrl doesn't verify file existence, it just constructs URLs
    // So we'll try all buckets and return URLs for the most likely ones
    const urls: { bucket: string; url: string }[] = [];
    
    for (const bucket of buckets) {
      try {
        const { data, error } = supabase.storage
          .from(bucket)
          .getPublicUrl(cleanPath);
        
        if (data?.publicUrl && !error && data.publicUrl.startsWith('http')) {
          urls.push({ bucket, url: data.publicUrl });
          console.log(`✓ Generated URL for bucket: ${bucket}`, data.publicUrl);
        }
      } catch (e) {
        console.log(`Exception trying bucket ${bucket}:`, e);
        continue;
      }
    }
    
    // If we got URLs from getPublicUrl, return the first one (most likely bucket)
    if (urls.length > 0) {
      const result = urls[0];
      console.log(`✓ Community profile picture URL converted using bucket: ${result.bucket}`, { 
        original: filePath, 
        cleaned: cleanPath,
        converted: result.url 
      });
      return result.url;
    }
    
    // If getPublicUrl didn't work, construct URLs manually for all buckets
    // Return the most likely one first, but log all options for debugging
    console.log(`⚠ getPublicUrl didn't work, trying manual URL construction for all buckets`);
    for (const bucket of buckets.slice(0, 3)) { // Try top 3 most likely
      const manualUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
      console.log(`  - ${bucket}: ${manualUrl}`);
    }
    
    // Return URL for the confirmed bucket name: community-images
    const primaryBucket = 'community-images'; // Confirmed bucket name
    const manualUrl = `${supabaseUrl}/storage/v1/object/public/${primaryBucket}/${cleanPath}`;
    console.log(`✓ Using manual URL construction for community profile picture:`, { 
      original: filePath, 
      cleaned: cleanPath,
      bucket: primaryBucket, 
      url: manualUrl
    });
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
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) return filePath;
    
    // Clean the path
    let cleanPath = filePath.trim();
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.slice(1);
    }
    
    // Try multiple bucket names - community images are stored in "community-images" bucket
    const buckets = [
      'community-images', // PRIMARY: Confirmed bucket name for community images
      'community-pictures',
      'communities', 
      'community-banners',
      'community-profiles',
      'profile-pictures',
      'post-media',
      'media',
      'images',
      'chat-images'
    ];
    
    // Try getPublicUrl first
    for (const bucket of buckets) {
      try {
        const { data, error } = supabase.storage
          .from(bucket)
          .getPublicUrl(cleanPath);
        
        if (data?.publicUrl && !error && data.publicUrl.startsWith('http')) {
          console.log(`✓ Community banner URL converted using bucket: ${bucket}`, data.publicUrl);
          return data.publicUrl;
        }
      } catch (e) {
        continue;
      }
    }
    
    // Fallback to manual URL construction using confirmed bucket name
    const primaryBucket = 'community-images'; // Confirmed bucket name
    const manualUrl = `${supabaseUrl}/storage/v1/object/public/${primaryBucket}/${cleanPath}`;
    console.log(`✓ Using manual URL construction for community banner:`, { bucket: primaryBucket, url: manualUrl });
    return manualUrl;
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
    
    // Try common bucket names for post media (including chat-images for AI chat, expert-files, and species-images)
    const buckets = ['post-media', 'species-images', 'chat-images', 'expert-files', 'identification-images', 'posts', 'post-images', 'media'];
    
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
  
  try {
    const supabase = createClient();
    if (!supabase) return filePath;
    
    // Try comment-media bucket first, then fallback to post-media
    const buckets = ['comment-media', 'post-media', 'chat-images', 'expert-files', 'posts', 'post-images', 'media'];
    
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
      return `${supabaseUrl}/storage/v1/object/public/comment-media/${filePath}`;
    }
    
    return filePath;
  } catch (error) {
    console.error('Error getting comment media URL:', error);
    return filePath;
  }
}

