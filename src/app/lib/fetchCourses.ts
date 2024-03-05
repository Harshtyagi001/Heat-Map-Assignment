import  {CourseModel}  from './models';
import { connectToDb } from './dbConnect';

// Here, I worked with dummy data initially, hence I kept these code commented to show my whole journey of development.
// export const courses = [
//   { name: 'Course 1', marks: 85 },
//   { name: 'Course 2', marks: 92 },
//   { name: 'Course 3', marks: 78 },
//   { name: 'Course 4', marks: 88 },
//   { name: 'Course 5', marks: 95 },
//   { name: 'Course 6', marks: 80 },
//   { name: 'Course 7', marks: 90 },
//   { name: 'Course 8', marks: 86 },
//   { name: 'Course 9', marks: 94 },
//   { name: 'Course 10', marks: 79 },
//   { name: 'Course 11', marks: 83 },
//   { name: 'Course 12', marks: 91 },
//   { name: 'Course 13', marks: 89 },
//   { name: 'Course 14', marks: 82 },
//   { name: 'Course 15', marks: 87 },
// ];


//  Util function to fetch the courses from the database
export const getCourses=async()=>{
   try{
    await connectToDb();
    const courses = await CourseModel.find({});
    console.log("Courses fetched successfully", courses);
    return courses;
   }
   catch(error){
    console.log("Error while fetching courses", error);
    throw new Error("Error while fetching courses");
   }
}