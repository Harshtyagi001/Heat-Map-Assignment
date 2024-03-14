import { MongoClient } from 'mongodb';

export default async function GetSkills() {
  const uri = 'mongodb+srv://tyagiharsh079:tyagi@cluster0.wdiwutx.mongodb.net/';

  const client = new MongoClient(uri);

  try {
      // Connect to the MongoDB Atlas cluster
      await client.connect();
      console.log('Connected to MongoDB Atlas');

      // Select the database
      const database = client.db('Chat-sat');
      //  console.log("db: ",database)
      // Fetch the last 5 mock tests
      const last5MockTests = await database.collection('practice-mocks').find().sort({ createdAt: -1 }).limit(1).toArray();

      console.log('Last 5 mock tests:', last5MockTests, "size: ",last5MockTests.length);

      //Initialize an object to store skill accuracy counts
      const skillAccuracyMap = new Map<string, { total: number; correct: number }>();

     // Loop through each of the last 5 mock tests
      for (const mockTestData of last5MockTests) {
          // Fetch questions data for the current mock test
          const questionsData = await database.collection('questions').find({ _id: { $in: mockTestData.questionIds } }).toArray();
        //  console.log("questionsData: ",questionsData);
        //  console.log("Size:: ",questionsData.length)
        //  return questionsData;
         // Loop through the questions array
          for (const [index, questionId] of mockTestData.questionIds.entries()) {
            const question = await database.collection('questions').findOne({ _id: questionId });
              const userAnswer = mockTestData.answers[index];
              console.log("Questions particulars: ",question);
              // Check if the question is attempted
              if (!question) {
                console.log(`Question with ID ${questionId} not found.`);
                continue;
            }

            const skill = question.skill;

            // Update skill accuracy map
            if (!skillAccuracyMap.has(skill)) {
                skillAccuracyMap.set(skill, { correct: 0, total: 0 });
            }

            let skillAccuracy = skillAccuracyMap.get(skill);

          // If the skill is not found in the map, initialize it with initial counts
           if (!skillAccuracy) {
               skillAccuracy = { correct: 0, total: 0 };
               skillAccuracyMap.set(skill, skillAccuracy);
          }
      
              // Increment the total count for the skill
              skillAccuracy.total++;

            // If the user has provided an answer and it is correct, increment the correct count
            if (userAnswer !== null && userAnswer === question.correctOption) {
                skillAccuracy.correct++;
            }
          }
      }
      console.log("Skill Accuracy Map: ",skillAccuracyMap);
      return skillAccuracyMap;

  } catch (error) {
      console.log('Error:', error);
      // throw new Error('Error fetching skill accuracies');
  }
}
