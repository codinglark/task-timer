// timer-utils.js - Timer utility functions
const TimerUtils = {
    formatTime: (ms) => {
        const seconds = Math.floor(ms / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    getTaskTime: (task, mode, currentInterval, currentTime) => {
        const baseTime = task[mode];
        const isRunning = currentInterval?.taskId === task.id && currentInterval.type === mode;
        const runningTime = isRunning ? currentTime - currentInterval.start : 0;
        return {
            time: baseTime + runningTime,
            isRunning
        };
    },

    getTotals: (tasks, currentInterval, currentTime) => {
        const totals = tasks.reduce((acc, task) => {
            const active = TimerUtils.getTaskTime(task, 'Active', currentInterval, currentTime);
            const idle = TimerUtils.getTaskTime(task, 'Idle', currentInterval, currentTime);
            return {
                Active: acc.Active + active.time,
                Idle: acc.Idle + idle.time
            };
        }, { Active: 0, Idle: 0 });
        
        const allCompleted = tasks.every(task => task.completed);
        return { ...totals, allCompleted };
    }
};