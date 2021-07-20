import { languages } from './schemas';

type Language = keyof typeof languages;

interface Job {
  fn: (language: Language, name: string, memoryLimit: number, timeLimit: number) => Promise<{stdout: string, stderr: string}>,
  params: {
    language: Language,
    name: string,
    memoryLimit: number,
    timeLimit: number
  },
  cb: (...args: any) => any
}
/**
 * A simple implementation of a Job Queue to queue
 * containers when there are already too
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
      const {language, name, memoryLimit, timeLimit} = job.params
      job.fn(language, name, memoryLimit, timeLimit).then(job.cb)
    }
  }
}

export default new Queue()
