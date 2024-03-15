import getSkillAccuracyDifficultyWise from "../lib/fetchSkillsDifficultyWise";

interface SkillData {
  totalCorrect: number;
  totalQuestions: number;
  skill: string;
  overallAccuracy: number;
  difficultyStats: {
    difficulty: string;
    correct: number;
    total: number;
    accuracy: number;
  }[];
}

export default async function SkillAccuracyDifficultyWisePage() {
  const skillAccuracyData: SkillData[] | undefined = await getSkillAccuracyDifficultyWise();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Skill Accuracy</h1>
      <hr className="mb-8" />
      <div className="grid grid-cols-1 gap-4">
        {skillAccuracyData?.map(skillData => (
          <div key={skillData.skill} className="border border-gray-200 p-4">
            <h2 className="text-xl font-bold mb-2">{skillData.skill}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold mb-2">Details</h3>
                <p>Total Correct: {skillData.totalCorrect}</p>
                <p>Total Questions: {skillData.totalQuestions}</p>
                <p>Overall Accuracy: {skillData.overallAccuracy}%</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Difficulty Stats</h3>
                <ul>
                  {skillData.difficultyStats.map(difficultyStat => (
                    <li key={difficultyStat.difficulty} className="mb-2">
                      <p>Difficulty: {difficultyStat.difficulty}</p>
                      <p>Correct: {difficultyStat.correct}</p>
                      <p>Total: {difficultyStat.total}</p>
                      <p>Accuracy: {difficultyStat.accuracy}%</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
