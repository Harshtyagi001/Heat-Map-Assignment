import HeatMap from "../component/heatmap";
import getSkillAccuracy from "../lib/fetchSkillsPipeline"
import { Course } from '../lib/models';

export default async function BetterPerformance(){

  const skillsDetails=await getSkillAccuracy();
  console.log("skillsDetails on page: ",skillsDetails)

  if (!skillsDetails) {
    // Handle the case where skillsDetails is undefined
    return <div>No skill details available</div>;
  }
      // Convert skill accuracy data to Course objects
      const skills: Course[] = Object.entries(skillsDetails).map(([skill, accuracy]) => ({
        name: skill,
        marks: accuracy,
      })) as Course[];
      

  return <>
   <h1>Better Performance Page</h1>
   {skillsDetails && (
        <div>
          {/* <h2>Skill Accuracy</h2> */}
          {/* <ul>
            {Object.entries(skillsDetails).map(([skill, accuracy]) => (
              <li key={skill}>
                {skill}: {accuracy}%
              </li>
            ))}
          </ul> */}
          <HeatMap courses={skills}/>
        </div>
      )}
  </>
}