import { DEFAULT_JOB_TIMEOUT_SEC } from './constants.js';
import { IndexedEventEmitter } from './IndexedEventEmitter.js';
var JobPositions;
(function (JobPositions) {
    JobPositions[JobPositions["id"] = 0] = "id";
    JobPositions[JobPositions["cb"] = 1] = "cb";
    JobPositions[JobPositions["canceled"] = 2] = "canceled";
})(JobPositions || (JobPositions = {}));
var QueueEvents;
(function (QueueEvents) {
    // the new job has been just started
    QueueEvents[QueueEvents["startJob"] = 0] = "startJob";
    // job just finished with error or not but the next job isn't started at the moment.
    QueueEvents[QueueEvents["endJob"] = 1] = "endJob";
})(QueueEvents || (QueueEvents = {}));
let unnamedJobIdCounter = -1;
/**
 * Put callback to queue.
 * Callbacks with the same id will be make delayed.
 * Delayed cb will be called only once. The new delayed cb just will replace delayed cb to a new one.
 * Please don't use only numbers like "0" as an id. Use any other string as an id.
 */
export default class Queue {
    jobTimeoutSec;
    events = new IndexedEventEmitter();
    queue = [];
    currentJob;
    // timeout of currentJob
    runningTimeout;
    constructor(jobTimeoutSec = DEFAULT_JOB_TIMEOUT_SEC) {
        this.jobTimeoutSec = jobTimeoutSec;
    }
    destroy() {
        this.events.destroy();
        this.queue = [];
        if (this.runningTimeout) {
            clearTimeout(this.runningTimeout);
            delete this.runningTimeout;
        }
        if (this.currentJob) {
            this.currentJob[JobPositions.canceled] = true;
            delete this.currentJob;
        }
    }
    getQueueLength() {
        return this.queue.length;
    }
    /**
     * Get ids of jobs include current job.
     */
    getJobIds() {
        const queuedIds = this.getQueuedJobsId();
        if (this.currentJob) {
            return [this.currentJob[JobPositions.id], ...queuedIds];
        }
        return queuedIds;
    }
    /**
     * Get jobs which are in the queue, not current.
     */
    getQueuedJobsId() {
        return this.queue.map((item) => item[JobPositions.id]);
    }
    /**
     * Is something in progress
     */
    isInProgress() {
        // check also queue length because if it is checked at event handler of the end of job then
        // there is current job will be removed.
        return Boolean(this.currentJob) || Boolean(this.queue.length);
    }
    isJobInProgress(jobId) {
        return this.getCurrentJobId() === jobId;
    }
    /**
     * Returns id of current job of undefined
     */
    getCurrentJobId() {
        if (!this.currentJob)
            return;
        return this.currentJob[JobPositions.id];
    }
    /**
     * Check if queue has job with specified jobId even it it is a current job.
     */
    hasJob(jobId) {
        return this.getJobIds().includes(jobId);
    }
    /**
     * Cancel job with uniq id. It can be current or wait in the queue
     */
    cancelJob(jobId) {
        // cancel current job if set
        if (this.currentJob && this.currentJob[JobPositions.id] === jobId) {
            this.currentJob[JobPositions.canceled] = true;
            // delete timeout and current job
            this.finalizeCurrentJob();
            this.events.emit(QueueEvents.endJob, undefined, jobId);
        }
        this.removeJobFromQueue(jobId);
        this.startNextJobIfNeed();
    }
    /**
     * Return the promise which will be fulfilled when the current job is finished.
     */
    waitCurrentJobFinished() {
        if (!this.currentJob)
            return Promise.resolve();
        return this.makeJobFinishPromise(this.currentJob[JobPositions.id]);
    }
    /**
     * Return the promise which will be fulfilled before the job is get started.
     * You should check that the queue has this job by calling `hasJob(jobId)`.
     * WARNING! It will be fulfilled on the next tick after event "startJob" has been risen.
     *   That is because resolve() function of promise call handlers on the next tick
     */
    waitJobStart(jobId) {
        if (this.isJobInProgress(jobId))
            return Promise.resolve();
        if (!this.hasJob(jobId)) {
            return Promise.reject(`RequestQueue.waitJobFinished: There isn't any job "${jobId}"`);
        }
        return new Promise((resolve) => {
            const handlerIndex = this.events.addListener(QueueEvents.startJob, (startedJobId) => {
                if (startedJobId !== jobId)
                    return;
                this.events.removeListener(handlerIndex, QueueEvents.startJob);
                resolve();
            });
            // TODO: а если не запустится - нужен наверное таймаут ???
            // TODO: могут отменить
        });
    }
    /**
     * Return the promise which will be fulfilled when the job is finished.
     * You should check that the queue has this job by calling `hasJob(jobId)`.
     * WARNING! It will be fulfilled on the next tick after event "endJob" has been risen.
     *   That is because resolve() function of promise call handlers on the next tick
     * @param jobId
     * @param force - if true that don't chec if job exist in a queue
     */
    waitJobFinished(jobId, force = false) {
        // TODO: test force
        if (!force && !this.hasJob(jobId)) {
            return Promise.reject(`RequestQueue.waitJobFinished: There isn't any job "${jobId}"`);
        }
        return this.makeJobFinishPromise(jobId);
    }
    // TODO: test
    onJobStart(cb) {
        return this.events.addListener(QueueEvents.startJob, cb);
    }
    // TODO: test
    onJobStartOnce(jobId, cb) {
        let handlerIndex;
        const wrapper = (finishedJobId) => {
            if (finishedJobId !== jobId)
                return;
            this.events.removeListener(handlerIndex, QueueEvents.startJob);
            // TODO: what to do with error of cb?
            cb();
        };
        handlerIndex = this.events.addListener(QueueEvents.startJob, wrapper);
        return handlerIndex;
    }
    onJobEnd(cb) {
        return this.events.addListener(QueueEvents.endJob, cb);
    }
    // TODO: test
    onJobEndOnce(jobId, cb) {
        let handlerIndex;
        const wrapper = (error, finishedJobId) => {
            if (finishedJobId !== jobId)
                return;
            this.events.removeListener(handlerIndex, QueueEvents.endJob);
            // TODO: what to do with error of cb?
            cb(error);
        };
        handlerIndex = this.events.addListener(QueueEvents.endJob, wrapper);
        return handlerIndex;
    }
    // TODO: test
    removeListener(handlerIndex) {
        this.events.removeListener(handlerIndex);
    }
    /**
     * Add job to queue.
     * If job with the same jobId is in progress the new cb will be refused
     * If the id and current job's are different - the job will be added to the end of queue.
     * If there is a job with the same is in queue - the cb in queue will be replaced to a new one.
     * @param cb - callback which will be called when job starts
     * @param jobId - specify if of job to avoid the duplicates. It not set then it will be generated.
     * @return jobId which is specified of generated if isn't specified
     */
    add(cb, jobId) {
        const resolvedId = this.resolveJobId(jobId);
        // The job with specified id is running
        // do noting - don't update the current job and don't add job to queue
        if (this.currentJob && this.currentJob[JobPositions.id] === resolvedId) {
            return resolvedId;
        }
        // else job is not running
        // get job index in the queue
        const jobIndex = this.getJobIndex(resolvedId);
        // check that job is in the queue
        if (jobIndex >= 0) {
            // if the job in a queue - update cb in this job
            this.queue[jobIndex][JobPositions.cb] = cb;
        }
        else {
            // not in a queue - add a new job to queue
            this.queue.push([resolvedId, cb, false]);
            this.startNextJobIfNeed();
        }
        return resolvedId;
    }
    /**
     * Start a new job if there isn't a current job and queue has some jobs.
     * It doesn't start a new job while current is in progress.
     */
    startNextJobIfNeed = () => {
        // do nothing if there is current job or no one in queue
        if (this.currentJob || !this.queue.length)
            return;
        // move queue's first job to the current
        this.currentJob = this.queue[0];
        // remove the first element from queue
        this.queue.shift();
        this.startJob(this.currentJob);
    };
    /**
     * Start job. It should be current job.
     */
    startJob(job) {
        this.events.emit(QueueEvents.startJob, job[JobPositions.id]);
        // start timeout of current job
        this.runningTimeout = setTimeout(() => {
            // mark as canceled to get not called handlers after cb finished
            job[JobPositions.canceled] = true;
            this.handleCbFinished(new Error(`RequestQueue: Timeout of job "${job[JobPositions.id]}" has been exceeded`), job);
        }, this.jobTimeoutSec * 1000);
        // start cb
        this.callCb(job[JobPositions.cb])
            .then(() => {
            if (!job[JobPositions.canceled])
                this.handleCbFinished(undefined, job);
        })
            .catch((e) => {
            if (!job[JobPositions.canceled])
                this.handleCbFinished(e, job);
        });
    }
    handleCbFinished(err, job) {
        if (!this.currentJob) {
            throw new Error(`RequestQueue: No current job when the job finished`);
        }
        else if (this.currentJob[JobPositions.id] !== job[JobPositions.id]) {
            throw new Error(`RequestQueue: Current job id doesn't match with the finished job id`);
        }
        // delete timeout and current job
        this.finalizeCurrentJob();
        // rise "end" event between current job finished and starting a new job
        this.events.emit(QueueEvents.endJob, err, job[JobPositions.id]);
        this.startNextJobIfNeed();
    }
    finalizeCurrentJob() {
        if (this.runningTimeout)
            clearTimeout(this.runningTimeout);
        delete this.runningTimeout;
        // delete finished job
        delete this.currentJob;
    }
    makeJobFinishPromise(jobId) {
        return new Promise((resolve, reject) => {
            let handlerIndex;
            const cb = (error, finishedJobId) => {
                if (finishedJobId !== jobId)
                    return;
                this.events.removeListener(handlerIndex, QueueEvents.endJob);
                if (error)
                    return reject(error);
                resolve();
            };
            handlerIndex = this.events.addListener(QueueEvents.endJob, cb);
        });
    }
    /**
     * remove job or delayed job in queue
     */
    removeJobFromQueue(jobId) {
        const jobIndex = this.getJobIndex(jobId);
        if (jobIndex < 0)
            return;
        this.queue.splice(jobIndex, 1);
    }
    /**
     * Find index of job or return -1 if it hasn't been found
     */
    getJobIndex(jobId) {
        return this.queue.findIndex((item) => item[JobPositions.id] === jobId);
    }
    /**
     * It uses passed jobId or generate a new one
     */
    resolveJobId(jobId) {
        if (typeof jobId === 'string')
            return jobId;
        unnamedJobIdCounter++;
        return String(unnamedJobIdCounter);
    }
    async callCb(cb) {
        await cb();
    }
}
