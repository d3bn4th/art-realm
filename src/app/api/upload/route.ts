import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64Data}`;
    
    // Upload to Cloudinary using promise-based API
    try {
      const result = await new Promise<{secure_url: string}>((resolve, reject) => {
        cloudinary.uploader.upload(
          dataURI,
          {
            folder: 'art-realm',
          },
          (err, result) => {
            if (err) return reject(err);
            return resolve(result as {secure_url: string});
          }
        );
      });
      
      return NextResponse.json({
        success: true,
        url: result.secure_url,
      });
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload to cloud storage' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload route error:', error);
    return NextResponse.json(
      { error: 'Image upload failed' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 