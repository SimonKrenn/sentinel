export type PRDiff = {
  modified: string[];
  created: string[];
  deleted: string[];
};

export type FileDiff = {
  before: string;
  after: string;
  diff: string;
  added: string;
  removed: string;
};

export type GitMetaData = {
  base: { ref: string; sha: string };
  head: { ref: string; sha: string };
};

export type Git = {
  fileDiff(filename: string): Promise<FileDiff>;
} & GitMetaData &
  PRDiff;
