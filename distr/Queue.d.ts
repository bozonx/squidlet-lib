type QueuedCb = () => Promise<void>;
type StartJobHandler = (jobId: JobId) => void;
type EndJobHandler = (error: string | undefined, jobId: JobId) => void;
export type JobId = string;
/**
 * Put callback to queue.
 * Callbacks with the same id will be make delayed.
 * Delayed cb will be called only once. The new delayed cb just will replace delayed cb to a new one.
 * Please don't use only numbers like "0" as an id. Use any other string as an id.
 */
export default class Queue {
    private readonly jobTimeoutSec;
    private readonly events;
    private queue;
    private currentJob?;
    private runningTimeout?;
    constructor(jobTimeoutSec?: number);
    destroy(): void;
    getQueueLength(): number;
    /**
     * Get ids of jobs include current job.
     */
    getJobIds(): string[];
    /**
     * Get jobs which are in the queue, not current.
     */
    getQueuedJobsId(): string[];
    /**
     * Is something in progress
     */
    isInProgress(): boolean;
    isJobInProgress(jobId: JobId): boolean;
    /**
     * Returns id of current job of undefined
     */
    getCurrentJobId(): JobId | undefined;
    /**
     * Check if queue has job with specified jobId even it it is a current job.
     */
    hasJob(jobId: JobId): boolean;
    /**
     * Cancel job with uniq id. It can be current or wait in the queue
     */
    cancelJob(jobId: JobId): void;
    /**
     * Return the promise which will be fulfilled when the current job is finished.
     */
    waitCurrentJobFinished(): Promise<void>;
    /**
     * Return the promise which will be fulfilled before the job is get started.
     * You should check that the queue has this job by calling `hasJob(jobId)`.
     * WARNING! It will be fulfilled on the next tick after event "startJob" has been risen.
     *   That is because resolve() function of promise call handlers on the next tick
     */
    waitJobStart(jobId: JobId): Promise<void>;
    /**
     * Return the promise which will be fulfilled when the job is finished.
     * You should check that the queue has this job by calling `hasJob(jobId)`.
     * WARNING! It will be fulfilled on the next tick after event "endJob" has been risen.
     *   That is because resolve() function of promise call handlers on the next tick
     * @param jobId
     * @param force - if true that don't chec if job exist in a queue
     */
    waitJobFinished(jobId: JobId, force?: boolean): Promise<void>;
    onJobStart(cb: StartJobHandler): number;
    onJobStartOnce(jobId: JobId, cb: () => void): number;
    onJobEnd(cb: EndJobHandler): number;
    onJobEndOnce(jobId: JobId, cb: (error: string | undefined) => void): number;
    removeListener(handlerIndex: number): void;
    /**
     * Add job to queue.
     * If job with the same jobId is in progress the new cb will be refused
     * If the id and current job's are different - the job will be added to the end of queue.
     * If there is a job with the same is in queue - the cb in queue will be replaced to a new one.
     * @param cb - callback which will be called when job starts
     * @param jobId - specify if of job to avoid the duplicates. It not set then it will be generated.
     * @return jobId which is specified of generated if isn't specified
     */
    add(cb: QueuedCb, jobId?: JobId): JobId;
    /**
     * Start a new job if there isn't a current job and queue has some jobs.
     * It doesn't start a new job while current is in progress.
     */
    private startNextJobIfNeed;
    /**
     * Start job. It should be current job.
     */
    private startJob;
    private handleCbFinished;
    private finalizeCurrentJob;
    private makeJobFinishPromise;
    /**
     * remove job or delayed job in queue
     */
    private removeJobFromQueue;
    /**
     * Find index of job or return -1 if it hasn't been found
     */
    private getJobIndex;
    /**
     * It uses passed jobId or generate a new one
     */
    private resolveJobId;
    private callCb;
}
export {};
