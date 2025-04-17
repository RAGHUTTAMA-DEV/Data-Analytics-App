import React from 'react'
import {Card,CardContent,CardHeader,CardTitle,CardFooter} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import { BarChart3,Calendar,Database } from 'lucide-react'
import { Link } from 'react-router-dom'

interface DatasetCardProps{
    id:string;
    name:string;
    createdAt:string;
    dataPoints:string;
}


const DatasetCard:React.FC<DatasetCardProps>=({id,name,createdAt,dataPoints})=>{
    const formattedDate=new Date(createdAt).toLocaleDateString('en-US',{
        year:'numeric',
        month:'short',
        day:'numeric',
    
    })

    return(
        <Card className='dataset-card overflow-hidden'>
            <CardHeader className='pb-2'>
                <div className='flex items-center justify-betweem'>
                    <h3 className='font-semibold text-lg truncate max-w-[200px]'>{name}</h3>
                    <Database className='h-5 w-5 text-muted-foreground flex-shrink-0'/>
                </div>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col space-y-2'>
                    <div className='flex items-center text-sm text-muted-foreground'>
                        <Calendar className='h-4 w-4 mr-1'/>
                        <span>{formattedDate}</span>
                    </div>
                    <div className='flex items-center text-sm text-muted-foreground'>
                        <Database className='h-4 w-4 mr-1'/>
                        <span>{dataPoints} data points</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
             <Link to={`/analytics/${id}`} className="w-full">
            <Button variant="outline" className="w-full">
             <BarChart3 className="h-4 w-4 mr-2" />
             View Analytics
           </Button>
         </Link>
            </CardFooter>
        </Card>
    )
}


export default DatasetCard