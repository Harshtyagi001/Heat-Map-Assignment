import { useEffect, useState } from 'react';
import Heatmap from './component/heatmap';
import { getCourses } from './lib/fetchCourses';


// Reference:
// lib/dbConnect -> Database Connection Code
// lib/fetchCourses -> Fetchin courses from data base code
// lib/models -> My courses model Schema is defined
// component/heatmap.tsx -> Core Component (I kept it seperate to keep the code modular)


const HomePage = async() =>{
   const fetchedCourses=await getCourses();  // Here , I am fetching the courses from the database on server side itself , so that the data is fetched before the component is rendered.
 return (
    <>
    <Heatmap courses={fetchedCourses}/> {/* Passing pre-fetched data to my component for rendring*/}
    </>
  );
};

export default HomePage;
