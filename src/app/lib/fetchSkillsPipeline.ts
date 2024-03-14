import { MongoClient } from 'mongodb';


interface SkillData {
  skill: string;
  correct: number;
  total: number;
}

interface SkillAccuracy {
  [key: string]: number;
}

export default async function getSkillAccuracy() {
  const uri = 'mongodb+srv://tyagiharsh079:tyagi@cluster0.wdiwutx.mongodb.net/';
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB Atlas
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    // Select the database
    const database = client.db('Chat-sat');

    // Define the aggregation pipeline
    const pipeline = [
      { $sort: { createdAt: -1 } }, // Sort by timestamp in descending order
      { $limit: 5 }, // Limit to last 5 mock tests
      {
        $lookup: {
          from: 'questions',
          localField: 'questionIds',
          foreignField: '_id',
          as: 'questions'
        }
      },
      { $unwind: '$questions' },
      {
        $project: {
          skill: '$questions.skill',
          userAnswer: { $arrayElemAt: ['$answers', { $indexOfArray: ['$questionIds', '$questions._id'] }] },
          correctAnswer: '$questions.correctOption'
        }
      },
      {
        $group: {
          _id: '$skill',
          totalAttempts: { $sum: 1 },
          correctAttempts: {
            $sum: {
              $cond: [
                { $eq: ['$userAnswer', '$correctAnswer'] },
                { $cond: [
                    { $ne: ['$userAnswer', null] },
                    1,
                    0
                ]},
                0
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          skillAccuracyMap: {
            $push: {
              skill: '$_id',
              correct: '$correctAttempts',
              total: '$totalAttempts'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          skillAccuracyMap: 1
        }
      }
    ];

    // Execute the aggregation pipeline
    const result = await database.collection('practice-mocks').aggregate(pipeline).toArray();

    // Extract skill accuracy map from the result
    const skillAccuracyMap:SkillData[] = result.length > 0 ? result[0].skillAccuracyMap : [];

    console.log('Skill Accuracy Map:', skillAccuracyMap);
    

  const skillAccuracy: SkillAccuracy = {};

skillAccuracyMap.forEach(skillData => {
  const { skill, correct, total } = skillData;
  const accuracy = (correct / total) * 100;
  skillAccuracy[skill] = parseFloat(accuracy.toFixed(2)); // Round to 2 decimal places
});

  console.log('Skill Accuracy:', skillAccuracy);
  return skillAccuracy;

  } catch (error) {
    console.log('Error:', error);
  }
}
