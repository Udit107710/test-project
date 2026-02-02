import { Comment, ReviewJob } from "./types";

export class Store {
  jobs: ReviewJob[] = [];
  comments: Comment[] = [];

  upsertJob(job: ReviewJob) {
    const idx = this.jobs.findIndex(
      j => j.prNumber === job.prNumber && j.repo === job.repo
    );
    if (idx === -1) this.jobs.push(job);
    else this.jobs[idx] = job;
  }

  addComment(comment: Comment) {
    this.comments.push(comment);
  }

  getJob(repo: string, prNumber: number) {
    return this.jobs.find(j => j.repo === repo && j.prNumber === prNumber);
  }
}
