import { MongoClient } from 'mongodb';

interface DifficultyStatInterface {
  difficulty: string;
  correct: number;
  total: number;
  accuracy: number;
}

interface SkillAccuracyDataInterface {
  totalCorrect: number;
  totalQuestions: number;
  skill: string;
  overallAccuracy: number;
  difficultyStats: DifficultyStatInterface[];
}

export default async function getSkillAccuracyDifficultyWise() {

  const uri = 'mongodb+srv://tyagiharsh079:tyagi@cluster0.wdiwutx.mongodb.net/';
  const client = new MongoClient(uri);
  
  try {
     // Connect to MongoDB Atlas
     await client.connect();
     console.log('Connected to MongoDB Atlas');

     // Select the database
     const database = client.db('Chat-sat');

     // Defining the aggregation pipeline


  const pipeline = [
  { $sort: { createdAt: -1 } }, // Sort by timestamp in descending order
  { $limit: 100 },              // Limit to last n practice tests
  {
    $lookup: {                  // Joining the questions collection with the tests collection
      from: 'questions',
      localField: 'questionIds',
      foreignField: '_id',
      as: 'questions'
    }
  },
  { $unwind: '$questions' },    // Destructuring the questions array and making separate documents for each question
  {
    $project: {                 // Projecting the required fields
      skill: '$questions.skill',
      userAnswer: { $arrayElemAt: ['$answers', { $indexOfArray: ['$questionIds', '$questions._id'] }] },
      correctAnswer: '$questions.correctOption',
      difficulty: '$questions.difficulty'
    }
  },

{
$group: {                      // Grouping the documents based on skill and difficulty (composite key) and calculating the total questions and correct attempts for each skill difficulty wise
_id: {
  skill: '$skill',
  difficulty: '$difficulty'
},
totalQuesDifficultyWise: { $sum: 1 },     // Let's say [React][medium]: 10 questions appeared
correctAttemptsDifficultyWise: {
  $sum: {
    $cond: [
      { $eq: ['$userAnswer', '$correctAnswer'] },  // Say, [React][medium]: 7 questions are correctly solved
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
$group: {                       // Now as I have already calculated that how many questions correctly solved on any skill difficulty wise , so here I am just grouping on the basis of skill 
_id: '$_id.skill',
difficultyStats: {
  $push: {
    difficulty: '$_id.difficulty',             // Storing the difficulty wise correct attempts and total questions in an array
    correct: '$correctAttemptsDifficultyWise',
    total: '$totalQuesDifficultyWise'
  }
},
totalCorrect: { $sum: '$correctAttemptsDifficultyWise' },
totalQuestions: { $sum: '$totalQuesDifficultyWise' }      // Just also adding total correct attempts and total questions for each skill
// Here will be getting something like [React]:  [{difficulty: 'easy', correct: 5, total: 7}, {difficulty: 'medium', correct: 7, total: 10}] totalCorrect: 12, totalQuestions: 17
}
},
{
$project:{            // Projecting the required fields
_id:0,
skill: '$_id',
totalCorrect:1,
totalQuestions:1,
overallAccuracy: {    // Calculating the overall accuracy for each skill by using aggregation itself
  $cond: [
    { $gt: ['$totalQuestions', 0] },
    { $multiply: [{ $divide: ['$totalCorrect', '$totalQuestions'] }, 100] },
    0
  ]
},
difficultyStats: {       // Calculating the accuracy for each skill difficulty wise, could have done on client side as well but it may increase the speed so kept it inside pipeline only
  $map: {
    input: '$difficultyStats',
    as: 'stats',
    in: {
      difficulty: '$$stats.difficulty',
      correct: '$$stats.correct',
      total: '$$stats.total',
      accuracy: {
        $cond: [
          { $gt: ['$$stats.total', 0] },
          { $multiply: [{ $divide: ['$$stats.correct', '$$stats.total'] }, 100] },
          0
        ]
      }
    }
  }
}
}
}
];

const result= await database.collection('practice-mocks').aggregate(pipeline).toArray();
console.log(result);

 // Here I am trying to destructuring my result and inserting the field of difficulty inside the skill in which any of the difficulty questions are missing , say React skill only easy and medium questions appeared in last n tests , so I am including for hard total, correct and accuracy will be 0 , 0 , 0.
 // So initially set all the values to zero
 const skillAccuracyData: SkillAccuracyDataInterface[] = result.map(res => {
  const difficultyStatsMap: { [key: string]: DifficultyStatInterface } = {
    easy: { difficulty: 'easy', correct: 0, total: 0, accuracy: 0 },
    medium: { difficulty: 'medium', correct: 0, total: 0, accuracy: 0 },
    hard: { difficulty: 'hard', correct: 0, total: 0, accuracy: 0 }
  };

  // Note: I tried to do this initialization part inside the pipeline itself , but won't improving the performance much , taking around 4-5 secs to render on page in both the case for any no. of docs whether 1 or 100

  // Here updating the count of correct attempts and total questions for each skill difficulty wise as previously I have setted this to 0
  res.difficultyStats.forEach((stat: any) => {
    difficultyStatsMap[stat.difficulty] = {
      difficulty: stat.difficulty,
      correct: stat.correct,
      total: stat.total,
      accuracy: stat.accuracy
    };
  });

  // Just Converting the difficultyStatsMap into an array of difficulty stats for easier extraction on frontend side
  const difficultyStats: DifficultyStatInterface[] = Object.values(difficultyStatsMap);

  return {
    totalCorrect: res.totalCorrect,
    totalQuestions: res.totalQuestions,
    skill: res.skill,
    overallAccuracy: res.overallAccuracy,
    difficultyStats: difficultyStats
  };
});

// console.log("Data on server: ",skillAccuracyData)
return skillAccuracyData;

  } catch (error) {
    console.log('Error:', error);
  }
}
