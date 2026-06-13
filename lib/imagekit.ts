import ImageKit from "imagekit";

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

let imagekit: ImageKit | null = null;

if (publicKey && privateKey && urlEndpoint) {
  imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });
}

export interface ImageKitSignature {
  token: string;
  expire: number;
  signature: string;
}

/**
 * Generates an upload signature for direct client-side uploads to ImageKit.
 */
export function getUploadSignature(): ImageKitSignature {
  if (imagekit) {
    try {
      const authParams = imagekit.getAuthenticationParameters();
      return {
        token: authParams.token,
        expire: authParams.expire,
        signature: authParams.signature,
      };
    } catch (error) {
      console.error("Error generating ImageKit upload signature:", error);
    }
  }

  // Fallback signature for sandbox/preview execution
  return {
    token: "mock_imagekit_token_" + Math.random().toString(36).substring(7),
    expire: Math.floor(Date.now() / 1000) + 1800,
    signature: "mock_imagekit_signature_auth_valid",
  };
}

/**
 * Gets a transformed URL endpoint for custom optimization.
 */
export function getTransformedUrl(
  path: string, 
  transformations: { crop?: string; width?: number; height?: number; filter?: string }
): string {
  if (!urlEndpoint) {
    // Return standard mock path directly if urlEndpoint is not set
    return path;
  }
  
  // Format ImageKit transformations query
  const parts: string[] = [];
  if (transformations.width) parts.push(`w-${transformations.width}`);
  if (transformations.height) parts.push(`h-${transformations.height}`);
  if (transformations.crop) parts.push(`c-${transformations.crop}`);
  if (transformations.filter) parts.push(`e-${transformations.filter}`); // e.g. contrast, grayscale
  
  const trString = parts.length > 0 ? `tr:${parts.join(",")}` : "";
  
  return `${urlEndpoint}/${trString}/${path.replace(/^\//, "")}`;
}
