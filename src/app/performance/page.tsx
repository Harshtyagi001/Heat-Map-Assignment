import GetSkills from "../lib/fetchSkills";

export default async function Performance(){

  const mockData=await GetSkills();

  return (
    <div>
      <h1>Performance</h1>
    </div>
  );
}