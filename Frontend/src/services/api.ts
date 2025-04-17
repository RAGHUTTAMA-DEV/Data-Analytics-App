import axios from "axios";

const API_URL="'http://localhost:3000/api/v1"

const api=axios.create({
    baseURL:API_URL,
    headers:{
        "Content-Type":"application/json"
    }
})

api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token");
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config;},(error)=>{
        return Promise.reject(error)
})

export const authService={
    signUp:async (username:string,email:string,password:string)=>{
        const response=await api.post('user/signin',{
            username,
            email,
            password
        })
        if(response.data.token){
            localStorage.setItem("token",response.data.token)
        }
        return response.data
    },
    signIn:async (email:string,password:string)=>{
        const response=await api.post('user/signin',{
            email,
            password
        })
        if(response.data.token){
            localStorage.setItem("token",response.data.token)
        }
        return response.data
    },
    signOut:()=>{
        localStorage.removeItem("token");
    },
    isAuthenticated:()=>{
        const token=localStorage.getItem("token");
        return !!token;
    }

}

export const dataService={
    uploadData:async (datasetName:string,rawdata:any[])=>{
    const response=await api.post('/data/upload',{datasetName,rawdata});
    return response.data;
    },
    getDatasets:async ()=>{
        const response=await api.get(`/data/bluk`);
        return response.data;
    },
    
    getAnalytics:async ()=>{
        const response=await api.get('/data');
        return response.data;
    },
   
}

export default api;