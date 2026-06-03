const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: string | number;
  format?: string;
  crop?: string;
}

export function cloudinaryUrl(
  publicId: string,
  {
    width = 600,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
  }: CloudinaryOptions = {}
): string {
  if (!CLOUD_NAME || !publicId) return publicId;
  if (publicId.startsWith('http')) return publicId; // Already a full URL
  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    `w_${width}`,
    height ? `h_${height}` : null,
    `c_${crop}`,
    'dpr_auto',
  ]
    .filter(Boolean)
    .join(',');
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}
