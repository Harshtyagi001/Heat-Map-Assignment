import getSkillAccuracy from "../lib/fetchSkillsPipeline"

export default function BetterPerformance(){

  const skillsDetails=getSkillAccuracy()
  return <>
   <h1>Better Performance</h1>
  </>
}