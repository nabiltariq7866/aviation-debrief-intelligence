import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Debriefs from './pages/Debriefs'
import NewDebrief from './pages/NewDebrief'
import DebriefDetail from './pages/DebriefDetail'
import Lessons from './pages/Lessons'
import LessonDetail from './pages/LessonDetail'
import Trends from './pages/Trends'
import Knowledge from './pages/Knowledge'
import TrainingProfiles from './pages/TrainingProfiles'
import ProfileDetail from './pages/ProfileDetail'
import Review from './pages/Review'
import Audit from './pages/Audit'
import Extensions from './pages/Extensions'
import Settings from './pages/Settings'

const router=createBrowserRouter([
  {
    path:'/',
    element:<Layout/>,
    children:[
      {index:true,element:<Navigate to="/dashboard" replace/>},
      {path:'dashboard',element:<Dashboard/>},
      {path:'debriefs',element:<Debriefs/>},
      {path:'debriefs/new',element:<NewDebrief/>},
      {path:'debriefs/:id',element:<DebriefDetail/>},
      {path:'lessons',element:<Lessons/>},
      {path:'lessons/:id',element:<LessonDetail/>},
      {path:'trends',element:<Trends/>},
      {path:'knowledge',element:<Knowledge/>},
      {path:'training-profiles',element:<TrainingProfiles/>},
      {path:'training-profiles/:id',element:<ProfileDetail/>},
      {path:'review',element:<Review/>},
      {path:'audit',element:<Audit/>},
      {path:'extensions',element:<Extensions/>},
      {path:'settings',element:<Settings/>},
      {path:'*',element:<Navigate to="/dashboard" replace/>},
    ],
  },
])

export default function App(){
  return <RouterProvider router={router}/>
}
