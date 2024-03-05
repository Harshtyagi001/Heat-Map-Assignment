'use client';
import { Course } from '../lib/models';
import { useState } from 'react';
import { HeatMapLoader } from './HeatMapLoader';
// Interface defined for the props of the component
interface HeatmapProps {
  courses: Course[];
}


// This is the component which is by-default server side but to enable user ineration , I have to make it client side by using "use-client" pragma but data is still being fetched from server side, so it is well-organized and no delay in data fetcging is there.

export default function HeatMap({ courses }: HeatmapProps) {
  // console.log("I am heatmap page");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleClick = (course: Course) => {
    setSelectedCourse(course);
  };
  return (
    <>
    <h1 className="text-4xl font-bold text-center mb-8">Welcome to My Quizzy Heatmap</h1>
    <div className="flex flex-col justify-center items-center w-auto md:flex-row px-[10%]">
      <div className="grid lg:grid-cols-5 justify-center gap-4 px-4 md:grid-cols-3 md:px-2 sm: grid-cols-1"> {/* Updated container */}
        {courses?.map((course: Course, index: number) => (
          <div key={index} className="w-full "> {/* Updated column width */}
            <div onClick={() => handleClick(course)} className="p-4 border border-gray-300 rounded-lg cursor-pointer hover: bg-transparent">
              <h2 className="text-lg font-semibold">{course.name}</h2>
              <p className="text-sm">Marks: {course.marks}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center"> {/* Updated loader container */}
       {selectedCourse ? `${selectedCourse.name}: ${selectedCourse.marks}` : ''}
        {/* <HeatMapLoader /> */}
      </div>
      </div>
      </>
  );
}


// I was also trying to do this , but is older version now, so I  an working with App-Router now. 

// export const getServerSideProps: GetServerSideProps<HeatmapProps> = async () => {
//   try {
//     const courses = await fetchData();
//     console.log("Inside server side props: ", courses);
//     return {
//       props: {
//         courses,
//       },
//     };
//   } catch (error) {
//     console.error('Error fetching courses:', error);
//     return {
//       props: {
//         courses: [],
//       },
//     };
//   }
// };
