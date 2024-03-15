'use client';
import { Course } from '../lib/models';
import { useState , useMemo } from 'react';
import CircularProgression from './CircularProgression';

// Interface defined for the props of the component
interface HeatmapProps {
  courses: Course[];
}

// This is the component which is by-default server side but to enable user interaction , I have to make it client side by using "use client" pragma but data is still being fetched from server side, so it is well-organized and no delay in data fetching is there.

export default function HeatMap({ courses }: HeatmapProps) {
  // console.log("I am heatmap page");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleClick = (course: Course) => {
    setSelectedCourse(course);
  };

  // I am making custom heatmap color for the courses, so that it looks more intuitive
  const CalculateColor = (marks: number) => {

    const MAX_MARKS=100;
    const MIN_MARKS=0;
    const maxColor=[0,0,0]; // RGB values for maximum color (black)
    const minColor=[255,255,255]; // RGB values for minimum color (white)

    // Normalize marks between 0 and 1
    const normalizedMarks=(marks-MIN_MARKS)/(MAX_MARKS-MIN_MARKS);

    const color = useMemo(() => {
        return minColor.map((channel, index) => {
        return Math.round(channel + (maxColor[index] - channel) * normalizedMarks);
      });
    }, [normalizedMarks]);

    // Return the color in rgba format
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.9)`; // Adjusting the Alpha Channel
  };

  return (
    <>
    <h1 className="text-4xl font-bold text-center mb-8 mt-4">Quizzy Heatmap Assignment</h1>
    <div className="flex flex-col justify-center items-center w-auto md:flex-row px-[10%]">
      <div className="grid lg:grid-cols-5 justify-center gap-4 px-2 md:grid-cols-3 md:px-2 sm: grid-cols-2">
        {courses?.map((course: Course, index: number) => (
          <div key={index} className="w-full ">
            <div style={{ backgroundColor: CalculateColor(course.marks)}}
            onClick={() => handleClick(course)} className="text-[#FFA500] p-4 border border-gray-300 rounded-lg cursor-pointer hover: bg-transparent"
            >
              <h2 className="xl:text-lg font-semibold sm:text-sm break-all">{course.name}</h2>
              <p className="text-sm">Marks: {course.marks}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        {selectedCourse && (
            <div className="w-full h-full mt-4">
              <div className="flex lg:justify-around lg:flex-row flex-col justify-center">
                <div className="flex flex-col items-center">
                  <div className="text-3xl text-yellow-700">{selectedCourse.name}</div>
                  <div>
                    <CircularProgression serviceTab={courses} index={courses.indexOf(selectedCourse)}  marks={selectedCourse.marks} />   {/* This is for showing percentage inside loader when particular course is clicked*/}
                  </div>
                </div>
              </div>
            </div>
          )}
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
