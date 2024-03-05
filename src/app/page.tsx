import { useEffect, useState } from 'react';
import { TopicModel } from '../../models/mongoDataModels'; // Assuming you have defined the TopicModel in models.ts
import Heatmap from './component/heatmap';
import { getCourses } from './lib/fetchCourses';


const HomePage = async() =>{
  // console.log("I am home page")
   const fetchedCourses=await getCourses();  // Here , I am fetching the courses from the database on server side itself
  //  console.log("courses fetched: ",fetchedCourses)
 return (
    <>
    <Heatmap courses={fetchedCourses}/>
    </>
  );
};

export default HomePage;
