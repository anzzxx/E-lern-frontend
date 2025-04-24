import React from 'react'
import PrevVideoPlayer from '../components/PrevVideo'
import CourseOverview from '../components/CourseOverview'
import ShowReview from '../components/Review'
import { Sidebar } from 'lucide-react'
import  Navbar from "../components/Navbar";
import Content  from '../components/unpaidWatch/Content';

function CourseDetail() {
  return (
    <div>
      <Navbar/>
      <br />
       <div>
        {/* <PrevVideoPlayer src="your-video-url.mp4" /> */}
        
        
        {/* <CourseOverview/> */}
        {/* <ShowReview/> */}
       </div>
       <Content/>
    </div>
  )
}

export default CourseDetail
