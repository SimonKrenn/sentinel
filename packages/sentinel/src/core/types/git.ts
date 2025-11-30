export type PRDiff = {
  modified: string[];
  created: string[];
  deleted: string[];
};

export type FileDiff = {
  before: string;
  after: string;
  added: string;
  removed: string;
  modified: string;
  diff: string;
};

export type GitMetaData = {
  base: { ref: string; sha: string };
  head: { ref: string; sha: string };
};

export type Git = {
  rawDiff(filename: string): Promise<string>;
} & GitMetaData &
  PRDiff;
