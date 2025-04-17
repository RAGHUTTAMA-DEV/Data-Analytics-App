import React,{useEffect,useState} from 'react'
import { dataService } from '@/services/api'
import {toast} from '../../hooks/use-toast'
import {Upload,RefreshCcw} from 'lucide-react'
import DatasetCard from './DashBoardCard'
import { Link } from 'react-router-dom'


interface Dataset{
    _id:string;
    datasetName:string;
    uploadedAt:string;  
    rawData:string;
}

const Dashboard=()=>{
    const [datasets,setDatasets]=useState<Dataset[]>([])
    const [isLoading,setIsLoading]=useState(false)

    const fetchDatasets=async()=>{
      try{
        setIsLoading(true)
        const response=await dataService.getDatasets()
        setDatasets(response.data)
      }catch(error){
        toast({
            title:'Error',
            description:'Something went wrong',
            variant:'destructive'
        })
        console.log(error)
      }finally{
        setIsLoading(false)
      }

    }
}


