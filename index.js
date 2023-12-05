
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

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

function calculateWeightedAverage(submissions, assignments) {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const submission of submissions) {
    const assignment = assignments.find((a) => a.id === submission.assignment_id);

    if (new Date(assignment.due_at) > new Date()) {
      continue;
    }

    if (new Date(submission.submission.submitted_at) > new Date(assignment.due_at)) {
      submission.submission.score *= 0.9;
    }

    totalWeightedScore += (submission.submission.score / assignment.points_possible) * assignment.points_possible * assignment.group_weight;
    totalWeight += assignment.group_weight;
  }

  if (totalWeight === 0) {
    return 0;
  }

  return (totalWeightedScore / totalWeight) * 100;
}

function processLearnerSubmissions(assignmentGroup, learnerSubmissions) {
  const results = [];

  for (const learnerSubmission of learnerSubmissions) {
    const learnerId = learnerSubmission.learner_id;
    const learnerAverage = calculateWeightedAverage([learnerSubmission], assignmentGroup.assignments);

    const learnerResult = {
      id: learnerId,
      avg: learnerAverage,
    };

    for (const assignment of assignmentGroup.assignments) {
      const submission = learnerSubmissions.find((s) => s.assignment_id === assignment.id);

      if (new Date(assignment.due_at) > new Date()) {
        continue;
      }

      learnerResult[assignment.id] = (submission.submission.score / assignment.points_possible) * 100;
    }

    results.push(learnerResult);
  }

  return results;
}

function validateAssignmentGroup(courseInfo, assignmentGroup) {
  if (courseInfo.id !== assignmentGroup.course_id) {
    throw new Error("AssignmentGroup does not belong to its course. Invalid input.");
  }
}

function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
  validateAssignmentGroup(courseInfo, assignmentGroup);

  const results = processLearnerSubmissions(assignmentGroup, learnerSubmissions);

  return results;
}

// Example usage
try {
  const learnerData = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  console.log(learnerData);
} catch (error) {
  console.error(error.message);
}

