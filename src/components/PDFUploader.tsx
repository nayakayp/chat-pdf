'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Loader2, File } from 'lucide-react'
import axios from 'axios'

export default function PDFUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadedPDFs, setUploadedPDFs] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setUploadSuccess(false) // Reset success state when a new file is selected
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setUploadSuccess(false) // Reset success state

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('ns', localStorage.getItem("projectName") as string);

      await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      },
      );
    } catch (error) {
      console.log(error)
    } finally {
      setUploading(false)
      setUploadSuccess(true)
      setUploadedPDFs(prev => [...prev, file.name])

      const localStorageUploadedPDFs = localStorage.getItem("uploadedPDFs")
      if (localStorageUploadedPDFs) {
        const prevUploadedPDFs = JSON.parse(localStorage.getItem("uploadedPDFs") as string);
        localStorage.setItem("uploadedPDFs", JSON.stringify([...prevUploadedPDFs, file.name]))
      } else {
        localStorage.setItem("uploadedPDFs", JSON.stringify([file.name]))
      }

      setFile(null) // Reset file input after successful upload
    };
  }



  useEffect(() => {
    if (localStorage.getItem("uploadedPDFs")) {
      setUploadedPDFs(JSON.parse(localStorage.getItem("uploadedPDFs") as string))
    }
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload PDF</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Upload
              </>
            )}
          </Button>
          {file && !uploading && !uploadSuccess && (
            <p className="text-sm text-gray-500">Selected file: {file.name}</p>
          )}
          {uploadSuccess && (
            <p className="text-sm text-green-600">File uploaded successfully!</p>
          )}
          {uploadedPDFs.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">Uploaded PDFs:</h3>
              <ul className="space-y-1">
                {uploadedPDFs.map((pdfName, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <File className="mr-2 h-4 w-4" /> {pdfName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

