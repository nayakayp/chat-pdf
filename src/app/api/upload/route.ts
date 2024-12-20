import axios from 'axios';

export async function POST(request: Request) {
  try {
    // Get the FormData from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    await axios.post('https://n8n.nayakayoga.com/webhook/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    },
    );

    return Response.json({
      status: 200,
      message: 'File uploaded and text stored in Pinecone',
    })
  } catch (error) {
    console.error('Error processing file:', error);
    return Response.json(
      { error: 'Error processing file' },
      { status: 500 }
    );
  }

}

// export async function POST(request: Request) {
//   try {
//     // Get the FormData from the request
//     const formData = await request.formData();
//     const file = formData.get('file') as File;
//
//     if (!file) {
//       return NextResponse.json(
//         { error: 'No file uploaded' },
//         { status: 400 }
//       );
//     }
//
//     // Convert File to ArrayBuffer
//     const arrayBuffer = await file.arrayBuffer();
//     // Convert ArrayBuffer to Buffer
//     const buffer = Buffer.from(arrayBuffer);
//
//     // Extract text from PDF
//     const text = await extractTextFromPDF(buffer);
//     console.log('Extracted text:', text);
//
//     // Store in Pinecone
//     // await storeTextInPinecone(text, file.name);
//
//     return Response.json({
//       status: 200,
//       message: 'File uploaded and text stored in Pinecone',
//     })
//   } catch (error) {
//     console.error('Error processing file:', error);
//     return Response.json(
//       { error: 'Error processing file' },
//       { status: 500 }
//     );
//   }
// }
