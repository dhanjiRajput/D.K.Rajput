import React from 'react'
import {Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import WriteArticle from './pages/WriteArticle';
import BlogTitle from './pages/BlogTitle';
import GenerateImages from './pages/GenerateImages';
import RemoveBackground from './pages/RemoveBackground';
import RemoveObject from './pages/RemoveObject';
import RevieResume from './pages/RevieResume';
import Community from './pages/Community';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';

const App = () => {
  const {getToken}=useAuth();
  useEffect(()=>{
    getToken().then((token)=>console.log(token));
  },[]);
  
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>                                 {/*  http://localhost:5173 */}
        <Route path='/ai' element={<Layout/>}>
            <Route index element={<Dashboard/>}/>                           {/*  http://localhost:5173/ai */}
            <Route path='write-article' element={<WriteArticle/>}/>         {/*  http://localhost:5173/ai/write-article */}
            <Route path='blog-titles' element={<BlogTitle/>}/>              {/*  http://localhost:5173/ai/blog-titles */}
            <Route path='generate-images' element={<GenerateImages/>}/>     {/*  http://localhost:5173/ai/generate-images */}
            <Route path='remove-background' element={<RemoveBackground/>}/> {/*  http://localhost:5173/ai/remove-background */}
            <Route path='remove-object' element={<RemoveObject/>}/>         {/*  http://localhost:5173/ai/remove-object */}
            <Route path='review-resume' element={<RevieResume/>}/>          {/*  http://localhost:5173/ai/review-resume */}
            <Route path='community' element={<Community/>}/>                {/*  http://localhost:5173/ai/community */}
        </Route> 
      </Routes>
    </div>
  )
}

export default App