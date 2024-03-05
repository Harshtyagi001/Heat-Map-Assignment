"use-client";

import { GetServerSideProps } from 'next';
import { Course } from '../lib/models'; 

interface HeatmapProps {
  courses: Course[];
}

export default function HeatMap({ courses }: HeatmapProps) {
  console.log("I am heatmap page");
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
