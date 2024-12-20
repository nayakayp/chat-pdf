'use client'
import { useEffect, useState } from 'react'
import PDFUploader from '@/components/PDFUploader'
import ChatInterface from '@/components/ChatInterface'
import CreateProject from '@/components/CreateProject'
import { CreateNewProject } from '@/components/CreateNewProject'

export default function Home() {
  const [projectName, setProjectName] = useState('')

  useEffect(() => {
    if (localStorage.getItem("projectName")) {
      return setProjectName(localStorage.getItem("projectName") as string)
    } else {
      // window.location.reload()
    }
  }, [])

  return (
    <main className="container mx-auto p-4">
      <div className='flex items-center justify-between'>
        <div>
          <h1 className="text-2xl font-bold">PDF Document Processing</h1>
          <p className="mb-4"><strong>Project name:</strong> {projectName}</p>
        </div>
        <CreateNewProject />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CreateProject />
        <PDFUploader />
        <ChatInterface />
      </div>
    </main>
  )
}


