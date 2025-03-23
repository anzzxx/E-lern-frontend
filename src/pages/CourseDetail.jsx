import React from 'react'
import PrevVideoPlayer from '../components/PrevVideo'
import CourseOverview from '../components/CourseOverview'
import ShowReview from '../components/Review'
import { Sidebar } from 'lucide-react'

function CourseDetail() {
  return (
    <div>
      
       <div>
        <PrevVideoPlayer src="your-video-url.mp4" />
        
        <CourseOverview/>
        <ShowReview/>
       </div>
    </div>
  )
}

export default CourseDetail
