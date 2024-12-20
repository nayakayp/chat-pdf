'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


const CreateProject = () => {
  const [projectName, setProjectName] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmit = () => {
    const reformat = projectName.trim() + "-" + Date.now()
    if (projectName.trim() == "") return

    localStorage.setItem("projectName", reformat)

    window.location.reload()
  }

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && projectName !== "") {
      handleSubmit()
    }
  }

  const handleProjNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value)
  }

  useEffect(() => {
    if (localStorage.getItem("projectName")) {
      return setProjectName(localStorage.getItem("projectName") as string)
    } else {
      localStorage.setItem("projectName", "")
      setOpen(true)
    }
  }, [])

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a Project Name</AlertDialogTitle>
          <AlertDialogDescription>
            <Input type="text" onChange={handleProjNameChange} onKeyDown={onEnter} placeholder="Email" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction disabled={projectName.trim() === "" || projectName.length === 0} onClick={handleSubmit}>Submit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateProject
