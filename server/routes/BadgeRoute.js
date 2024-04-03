import express from 'express';

const router = express.Router();

const badges = [
  {
    id: 1,
    title: 'Initiate',
    description:
      'Earned by installing the browser extension and starting the journey to end doom-scrolling.',
    criteria: 'Install the browser extension and activate it.',
  },
  {
    id: 2,
    title: 'Task Taker',
    description: 'Given for attempting a browsing block task for the first time.',
    criteria:
      'Attempt a browsing block task (reading a chapter or doing exercise) for the first time.',
  },
  {
    id: 3,
    title: 'Task Master',
    description: 'Recognizes proficiency in completing browsing block tasks.',
    criteria: 'Successfully complete both reading and exercise tasks at least once each.',
  },
  {
    id: 4,
    title: 'Patience Practitioner',
    description:
      'Awarded for successfully waiting out the break timer without engaging in any tasks.',
    criteria: 'Wait out the entire break timer without attempting any browsing block tasks.',
  },
  {
    id: 5,
    title: 'Explorer',
    description: "Awarded for actively engaging with the extension's features.",
    criteria: 'Use the extension for browsing for at least 3 days.',
  },
  {
    id: 6,
    title: 'Focused Beginner',
    description: 'Awarded for maintaining focus during a browsing block.',
    criteria: 'Stay focused during a browsing block for at least 15 minutes.',
  },
  {
    id: 7,
    title: 'Determined Learner',
    description: 'Recognizes consistent engagement with browsing block tasks.',
    criteria: 'Complete browsing block tasks for 5 consecutive days.',
  },
  {
    id: 8,
    title: 'Time Management Trailblazer',
    description: 'Awarded for effectively managing time during browsing blocks.',
    criteria: 'Complete tasks within the allocated browsing block time consistently for a week.',
  },
  {
    id: 9,
    title: 'Browsing Breakthrough',
    description: 'Recognizes significant progress in reducing browsing time.',
    criteria: 'Reduce daily browsing time by 50% compared to the previous month.',
  },
  {
    id: 10,
    title: 'Screen Time Sleuth',
    description: 'Acknowledges conscious monitoring of screen time habits.',
    criteria: 'Track and analyze daily screen time usage for a month.',
  },
  {
    id: 11,
    title: 'Distraction Dodger',
    description: 'Given for successfully avoiding digital distractions during browsing blocks.',
    criteria: 'Maintain focus and avoid digital distractions during browsing blocks for a week.',
  },
];

router.get('/get-badges', async (req, res) => {
  res.status(200).send({ badges });
});

export { router as badgeRouter };
