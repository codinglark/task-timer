// timer.js - Timer component for Active/Idle controls
function Timer({ 
    currentTaskId, 
    currentInterval, 
    onIntervalChange, 
    onTaskComplete, 
    tasks, 
    currentTime 
}) {
    const currentTask = tasks.find(t => t.id === currentTaskId);
    
    if (!currentTask || currentTask.completed) {
        return null;
    }

    const active = TimerUtils.getTaskTime(currentTask, 'Active', currentInterval, currentTime);
    const idle = TimerUtils.getTaskTime(currentTask, 'Idle', currentInterval, currentTime);

    return (
        <div className="flex gap-2">
            <button
                onClick={() => onIntervalChange({ mode: 'Active', taskId: currentTaskId })}
                className={`px-2 py-1 rounded mr-2 ${currentInterval?.type === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
                Active: <span className={active.isRunning ? 'font-bold' : ''}>{TimerUtils.formatTime(active.time)}</span>
            </button>
            <button
                onClick={() => onIntervalChange({ mode: 'Idle', taskId: currentTaskId })}
                className={`px-2 py-1 rounded mr-2 ${currentInterval?.type === 'Idle' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            >
                Idle: <span className={idle.isRunning ? 'font-bold' : ''}>{TimerUtils.formatTime(idle.time)}</span>
            </button>
            {currentInterval && (
                <button 
                    onClick={() => onTaskComplete(currentTaskId)}
                    className="px-2 py-1 rounded bg-blue-500 text-white"
                >
                    Done
                </button>
            )}
        </div>
    );
}