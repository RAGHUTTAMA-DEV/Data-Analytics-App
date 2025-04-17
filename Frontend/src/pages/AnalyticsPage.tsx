import React from 'react'
import Navbar from '@/components/Layout/Navbar'
import AnalyticsView from '@/components/Analytics/AnalyticsForm'

const AnalyticsForm:React.FC=()=>{
    return(
        <div>
            <Navbar/>
            <AnalyticsView/>
        </div>
    )
}

export default AnalyticsForm;