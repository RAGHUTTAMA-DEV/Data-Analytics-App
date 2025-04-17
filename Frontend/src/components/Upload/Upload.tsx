import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'  
import { Textarea } from '@/components/ui/textarea'
import { toast } from '../../hooks/use-toast'
import { dataService } from '@/services/api'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { FileUp, AlertCircle, CheckCircle2 } from 'lucide-react'

const UploadForm: React.FC = () => {
  const [datasetName, setDatasetName] = useState('')
  const [jsonData, setJsonData] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [showFormatGuide, setShowFormatGuide] = useState(false)
  const [errors, setErrors] = useState({ datasetName: '', data: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Read the file contents
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          try {
            // Validate JSON format when file is loaded
            JSON.parse(event.target.result as string)
            setJsonData(event.target.result as string)
            setErrors(prev => ({ ...prev, data: '' }))
          } catch (e) {
            setJsonData(event.target.result as string)
            setErrors(prev => ({ ...prev, data: 'Invalid JSON format in uploaded file' }))
          }
        }
      }
      reader.onerror = () => {
        toast({
          title: 'File reading error',
          description: 'Failed to read the selected file. Please try again.',
          variant: 'destructive',
        })
      }
      reader.readAsText(selectedFile)
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { datasetName: '', data: '' }

    if (!datasetName.trim()) {
      newErrors.datasetName = 'Dataset name is required'
      valid = false
    }

    if (!jsonData.trim()) {
      newErrors.data = 'Data is required'
      valid = false
    } else {
      try {
        JSON.parse(jsonData)
      } catch (e) {
        newErrors.data = 'Invalid JSON format'
        valid = false
      }
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      const parsedData = JSON.parse(jsonData)
      
      // Make sure the data is an array
      const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData]
      
      const response = await dataService.uploadData(datasetName, dataArray)
      
      toast({
        title: 'Data uploaded successfully!',
        description: 'Your dataset has been uploaded and is ready for analysis.',
      })
      
      // Validate response before navigation
      if (response && response.id) {
        // Navigate to the analytics page for the new dataset
        navigate(`/analytics/${response.id}`)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: typeof error === 'string' ? error : 'There was an error uploading your data. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setDatasetName('')
    setJsonData('')
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setErrors({ datasetName: '', data: '' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Upload Dataset</h1>
          <p className="text-muted-foreground mt-1">
            Upload your JSON data for analysis. Data should be in a valid JSON array format.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="datasetName">Dataset Name</Label>
              <Input
                id="datasetName"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                placeholder="e.g., Sales Data 2025"
                className={errors.datasetName ? 'border-destructive' : ''}
              />
              {errors.datasetName && (
                <p className="text-destructive text-xs mt-1">{errors.datasetName}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="jsonData">JSON Data</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFormatGuide(true)}
                  className="text-xs"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Format Guide
                </Button>
              </div>
              <Textarea
                id="jsonData"
                value={jsonData}
                onChange={(e:any) => setJsonData(e.target.value)}
                placeholder='[{"id": 1, "name": "Item 1", "value": 100}, {"id": 2, "name": "Item 2", "value": 200}]'
                className={`min-h-[200px] font-mono text-sm ${errors.data ? 'border-destructive' : ''}`}
              />
              {errors.data && <p className="text-destructive text-xs mt-1">{errors.data}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUpload">Or Upload JSON File</Label>
              <Input
                id="fileUpload"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="cursor-pointer"
              />
              {file && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                  <span>{file.name} selected</span>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={resetForm} disabled={loading}>
                Reset
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FileUp className="h-4 w-4 mr-2" />
                    Upload Data
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <AlertDialog open={showFormatGuide} onOpenChange={setShowFormatGuide}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>JSON Data Format Guide</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="mb-4">
                Your data should be in a valid JSON array format, where each item in the array is an object with
                key-value pairs.
              </p>
              <div className="bg-secondary p-3 rounded-md">
                <pre className="text-xs overflow-x-auto">
                  {`[
  {
    "id": 1,
    "name": "Product A",
    "sales": 1250,
    "date": "2025-01-15"
  },
  {
    "id": 2,
    "name": "Product B",
    "sales": 890,
    "date": "2025-01-16"
  }
]`}
                </pre>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default UploadForm
