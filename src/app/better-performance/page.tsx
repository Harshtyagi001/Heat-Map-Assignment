import getSkillAccuracy from "../lib/fetchSkillsPipeline"

export default async function BetterPerformance(){

  const skillsDetails=await getSkillAccuracy();
  console.log("skillsDetails on page: ",skillsDetails)
  return <>
   <h1>Better Performance</h1>
   {skillsDetails && (
        <div>
          <h2>Skill Accuracy</h2>
          <ul>
            {Object.entries(skillsDetails).map(([skill, accuracy]) => (
              <li key={skill}>
                {skill}: {accuracy}%
              </li>
            ))}
          </ul>
        </div>
      )}
  </>
}