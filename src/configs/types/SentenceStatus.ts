export type SentenceStatus =
  | 'AUTO'
  | 'DONE'
  | 'TODO'
  | 'IGNORE'
  | 'TAGGED'
  | 'REVIEW'
  | 'ERROR';

export const SentenceStatusNames = {
  AUTO: 'sentence.status.auto',
  DONE: 'sentence.status.done',
  TODO: 'sentence.status.todo',
  IGNORE: 'sentence.status.ignore',
  TAGGED: 'sentence.status.tagged',
  REVIEW: 'sentence.status.review',
  ERROR: 'sentence.status.error',
};

export default SentenceStatus;
