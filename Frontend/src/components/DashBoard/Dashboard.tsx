import React, { useEffect, useState } from 'react'
import { dataService } from '@/services/api'
import { toast } from '../../hooks/use-toast'
import { Upload, RefreshCcw, Database } from 'lucide-react'
import DatasetCard from './DashBoardCard'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface Dataset {
    _id: string;
    datasetName: string;
    uploadedAt: string;  
    rawData: string;
}

const Dashboard = () => {
    const [datasets, setDatasets] = useState<Dataset[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchDatasets = async () => {
      try {
        setIsLoading(true)
        const response = await dataService.getDatasets()
        setDatasets(response.data)
      } catch(error) {
        toast({
            title: 'Error',
            description: 'Something went wrong',
            variant: 'destructive'
        })
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    
    useEffect(() => {
        fetchDatasets()
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Your Datasets</h1>
              <p className="text-muted-foreground mt-1">Manage and analyze your uploaded datasets</p>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Button variant="outline" onClick={fetchDatasets} disabled={isLoading}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Link to="/upload">
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Data
                </Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : datasets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-8 border border-dashed border-muted-foreground/50 rounded-lg">
              <Database className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">No datasets yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Upload your first dataset to start analyzing your data
              </p>
              <Link to="/upload">
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Data
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {datasets.map((dataset) => (
                <DatasetCard
                  key={dataset._id}
                  id={dataset._id}
                  name={dataset.datasetName}
                  createdAt={dataset.uploadedAt}
                  dataPoints={dataset.rawData.length.toString()} // Convert number to string
                />
              ))}
            </div>
          )}
        </div>
    )
}

export default Dashboard
