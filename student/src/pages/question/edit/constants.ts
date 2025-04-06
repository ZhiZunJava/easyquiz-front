export const INITIAL_DATA_SINGLE_CHOICE = {
  id: undefined,
  questionType: 1,
  gradeLevel: undefined,
  subjectId: undefined,
  title: '',
  items: [
    { prefix: 'A', content: '' },
    { prefix: 'B', content: '' },
    { prefix: 'C', content: '' },
    { prefix: 'D', content: '' },
  ],
  analyze: '',
  correct: '',
  score: '',
  difficult: 0,
};

export const INITIAL_DATA_MULTIPLE_CHOICE = {
  id: undefined,
  questionType: 2,
  gradeLevel: undefined,
  subjectId: undefined,
  title: '',
  items: [
    { id: null, prefix: 'A', content: '' },
    { id: null, prefix: 'B', content: '' },
    { id: null, prefix: 'C', content: '' },
    { id: null, prefix: 'D', content: '' },
  ],
  analyze: '',
  correct: '',
  correctArray: [],
  score: '',
  difficult: 0,
};

export const INITIAL_DATA_TRUE_FALSE = {
  id: undefined,
  questionType: 3,
  gradeLevel: undefined,
  subjectId: undefined,
  title: '',
  items: [
    { id: null, prefix: 'A', content: '正确' },
    { id: null, prefix: 'B', content: '错误' },
  ],
  analyze: '',
  correct: '',
  score: '',
  difficult: 0,
};

export const INITIAL_DATA_GAP_FILLING = {
  id: undefined,
  questionType: 4,
  gradeLevel: undefined,
  subjectId: undefined,
  title: '',
  items: [],
  analyze: '',
  correct: '',
  score: '',
  difficult: 0,
};

export const INITIAL_DATA_SHORT_ANSWER = {
  id: undefined,
  questionType: 5,
  gradeLevel: undefined,
  subjectId: undefined,
  title: '',
  items: [],
  analyze: '',
  correct: '',
  score: '',
  difficult: 0,
};
