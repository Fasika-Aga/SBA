// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

function getLearnerData(course, ag, submissions) {
  // here, we would process this data to achieve the desired result.

  const learnerSubmissions = [
    {
      learner_id: 1,
      assignment_id: 101,
      submission: { submitted_at: "2023-12-30", score: 90 },
    },
    {
      learner_id: 1,
      assignment_id: 102,
      submission: { submitted_at: "2023-12-30", score: 180 },
    },
  ];

  // Function to calculate weighted average
  function calculateWeightedAverage(submissions, assignments) {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const submission of submissions) {
      const assignment = assignments.find(
        (a) => a.id === submission.assignment_id,
      );

      // Check if assignment is not yet due
      if (new Date(assignment.due_at) > new Date()) {
        continue;
      }

      // Deduct 10% for late submissions
      if (
        new Date(submission.submission.submitted_at) >
        new Date(assignment.due_at)
      ) {
        submission.submission.score *= 0.9;
      }

      totalWeightedScore +=
        (submission.submission.score / assignment.points_possible) *
        assignment.points_possible *
        assignment.weight;
      totalWeight += assignment.weight;
    }

    if (totalWeight === 0) {
      return 0; // Avoid division by zero
    }

    return (totalWeightedScore / totalWeight) * 100;
  }

  // Function to process learner submissions
  function processLearnerSubmissions(assignmentGroup, learnerSubmissions) {
    const results = [];

    for (const learnerSubmission of learnerSubmissions) {
      const learnerId = learnerSubmission.learner_id;
      const learnerAverage = calculateWeightedAverage(
        [learnerSubmission],
        assignmentGroup.assignments,
      );

      const learnerResult = {
        id: learnerId,
        avg: learnerAverage,
      };

      for (const assignment of assignmentGroup.assignments) {
        const submission = learnerSubmissions.find(
          (s) => s.assignment_id === assignment.id,
        );

        // Check if assignment is not yet due
        if (new Date(assignment.due_at) > new Date()) {
          continue;
        }

        // Add percentage score for each assignment
        learnerResult[assignment.id] =
          (submission.submission.score / assignment.points_possible) * 100;
      }

      results.push(learnerResult);
    }

    return results;
  }

  // Main function
  function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
    // Validate AssignmentGroup
    validateAssignmentGroup(courseInfo, assignmentGroup);

    // Process learnerSubmissions and calculate scores
    const results = processLearnerSubmissions(
      assignmentGroup,
      learnerSubmissions,
    );

    return results;
  }

  // Validation function
  function validateAssignmentGroup(courseInfo, assignmentGroup) {
    if (courseInfo.id !== assignmentGroup.course_id) {
      throw new Error(
        "AssignmentGroup does not belong to its course. Invalid input.",
      );
    }
  }

  // Example usage
  try {
    const learnerData = getLearnerData(
      courseInfo,
      assignmentGroup,
      learnerSubmissions,
    );
    console.log(learnerData);
  } catch (error) {
    console.error(error.message);
  }

  const result = [
    {
      id: 125,
      avg: 0.985, // (47 + 150) / (50 + 150)
      1: 0.94, // 47 / 50
      2: 1.0, // 150 / 150
    },
    {
      id: 132,
      avg: 0.82, // (39 + 125) / (50 + 150)
      1: 0.78, // 39 / 50
      2: 0.833, // late: (140 - 15) / 150
    },
  ];

  return result;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);
