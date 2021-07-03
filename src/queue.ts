import { exec } from 'child_process';
import { languages } from './schemas';

type Language = keyof typeof languages;

interface Job {
  fn: (language: Language, name: string) => string,
  params: {
    language: Language,
    name: string
  },
  cb: (...args: any) => any
}
/**
 * A simple impletation of a Job Queue to queue
 * podman containers when there are already too
 * much running
 */
class Queue {
  private jobs: Job[] = []

  /**
   * Add a job to the queue
   * @param job 
   */
  public addJob(job: Job) {
    this.jobs.push(job)
  }
  /**
   * Run the first job
   */
  public runJob() {
    const job = this.jobs.shift()
    if (job) {
      const {language, name} = job.params
      exec(job.fn(language, name), job.cb)
    }
  }
}

export default new Queue()