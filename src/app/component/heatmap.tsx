"use-client";

import { Course } from '../lib/models'; 

// Interface defined for the props of the component
interface HeatmapProps {
  courses: Course[];
}

// This is the component which is by-default server side but to enable user ineration , I have to make it client side by using "use-client" pragma but data is still being fetched from server side, so it is well-organized and no delay in data fetcging is there.

export default function HeatMap({ courses }: HeatmapProps) {
  // console.log("I am heatmap page");
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to My Quizzy Heatmap</h1>
      <div className="grid grid-cols-5 gap-4">
        {courses?.map((course: Course, index: number) => (
          <div key={index} className="p-4 border border-gray-300 rounded-lg">
            <h2 className="text-lg font-semibold">{course.name}</h2>
            <p className="text-sm">Marks: {course.marks}</p>
          </div>
        ))}
      </div>
    </div>
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
