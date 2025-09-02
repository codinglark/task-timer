// task-list.js - Task list management component
function TaskList({ 
    tasks, 
    setTasks, 
    currentTaskId, 
    onCurrentTaskChange, 
    onTaskComplete, 
    onIntervalChange,
    currentInterval, 
    currentTime 
}) {
    const [editingTask, setEditingTask] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const [reorderingTasks, setReorderingTasks] = useState(new Set());

    const handleInputRef = useCallback((input) => {
        if (input) input.select();
    }, []);

    const completeTask = (taskId, completed = true) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, completed } : task
        );
        const firstIncomplete = updatedTasks.find(t => !t.completed);
        
        setTasks(updatedTasks);
        onCurrentTaskChange(firstIncomplete?.id);
        onTaskComplete(taskId, completed, firstIncomplete?.id);
    };

    const changeEditingTaskTo = (newTaskId) => {
        if (editingTask && editingValue !== undefined) {
            setTasks(prev => prev.map(task => 
                task.id === editingTask ? { ...task, name: editingValue } : task
            ));
        }
        
        if (newTaskId) {
            const task = tasks.find(t => t.id === newTaskId);
            setEditingTask(newTaskId);
            setEditingValue(task?.name || '');
        } else {
            setEditingTask(null);
            setEditingValue('');
        }
    };

    const handleKeyDown = (e, taskId) => {
        if (e.key === 'Enter') {
            const currentTask = tasks.find(t => t.id === taskId);
            const nextTask = tasks.find(t => t.position > currentTask.position);
            changeEditingTaskTo(nextTask?.id || null);
        }
    };

    const moveTaskTo = (taskId, position) => {
        const currentPosition = tasks.find(t => t.id === currentTaskId)?.position;
        const taskPosition = tasks.find(t => t.id === taskId)?.position;
        
        let targetPosition;
        if (position === 'now') targetPosition = currentPosition;
        else if (position === 'next') targetPosition = currentPosition + 1;
        else if (position === 'sooner') targetPosition = taskPosition - 1;
        
        const displacedTasks = new Set(
            tasks.filter(t => t.position >= targetPosition && t.position < taskPosition && t.id !== taskId)
                 .map(t => t.id)
        );
        
        setReorderingTasks(displacedTasks);
        
        setTimeout(() => {
            const newTasks = [...tasks];
            const [movedTask] = newTasks.splice(taskPosition, 1);
            
            if (position === 'now') {
                newTasks.splice(currentPosition, 0, movedTask);
                const firstIncomplete = newTasks.find(t => !t.completed);
                onCurrentTaskChange(firstIncomplete?.id);
            } else if (position === 'next') {
                newTasks.splice(currentPosition + 1, 0, movedTask);
            } else if (position === 'sooner') {
                newTasks.splice(taskPosition - 1, 0, movedTask);
            }
            
                                setTasks(StateManager.updatePositions(newTasks));
            
            setTimeout(() => setReorderingTasks(new Set()), 175);
        }, 175);
    };

    const currentPosition = tasks.find(t => t.id === currentTaskId)?.position ?? 9999;

    return (
        <div className="space-y-3">
            {tasks.map(task => (
                <div key={task.id} className={`border rounded p-3 transition-opacity duration-150 ${reorderingTasks.has(task.id) ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="flex items-center gap-4 mb-2">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => completeTask(task.id, e.target.checked)}
                            className="w-4 h-4"
                        />
                        {editingTask === task.id ? (
                            <input 
                                ref={handleInputRef}
                                value={editingValue}
                                onChange={e => setEditingValue(e.target.value)}
                                onBlur={() => changeEditingTaskTo(null)}
                                onKeyDown={e => handleKeyDown(e, task.id)}
                                autoFocus
                            />
                        ) : (
                            <span 
                                className={`cursor-pointer ${task.completed ? 'line-through text-gray-500' : task.name ? '' : 'text-gray-400 italic'}`}
                                onClick={() => changeEditingTaskTo(task.id)}
                            >
                                {task.name || 'Untitled task'}
                            </span>
                        )}
                        {task.position === tasks.length - 1 && !task.completed && task.id !== currentTaskId && (
                            <button 
                                onClick={() => setTasks(prev => prev.filter(t => t.id !== task.id))}
                                className="ml-auto text-red-500 text-lg leading-none"
                            >
                                ⊖
                            </button>
                        )}
                    </div>
                    <div className="text-sm text-gray-600">
                        {(() => {
                            const active = TimerUtils.getTaskTime(task, 'Active', currentInterval, currentTime);
                            const idle = TimerUtils.getTaskTime(task, 'Idle', currentInterval, currentTime);
                            
                            return (
                                <div className="flex items-center justify-between">
                                    <span>
                                        Active: <span className={active.isRunning ? 'font-bold' : ''}>{TimerUtils.formatTime(active.time)}</span> | 
                                        Idle: <span className={idle.isRunning ? 'font-bold' : ''}>{TimerUtils.formatTime(idle.time)}</span>
                                         {!currentInterval && task.position > currentPosition && (
                                             <span className="ml-4">
                                                 {task.position === currentPosition + 1 ? (
                                                     <button 
                                                         onClick={() => moveTaskTo(task.id, 'now')}
                                                         className="px-2 py-1 rounded bg-gray-200 text-xs"
                                                     >
                                                         <span className="font-bold text-sm">>></span> Now <span className="font-bold text-sm">>></span>
                                                     </button>
                                                 ) : (
                                                     <>
                                                         <button 
                                                             onClick={() => moveTaskTo(task.id, 'next')}
                                                             className={`px-2 py-1 rounded bg-gray-200 text-xs mr-2 ${task.position === currentPosition + 2 ? 'invisible' : ''}`}
                                                         >
                                                             <span className="font-bold text-sm">></span> Next
                                                         </button>
                                                         {task.position >= currentPosition + 2 && (
                                                             <button 
                                                                 onClick={() => moveTaskTo(task.id, 'sooner')}
                                                                 className="px-2 py-1 rounded bg-gray-200 text-xs"
                                                             >
                                                                 <span className="font-bold text-sm">^</span> Sooner
                                                             </button>
                                                         )}
                                                     </>
                                                 )}
                                             </span>
                                         )}
                                    </span>
                                </div>
                            );
                        })()}
                    </div>
                    {task.position === tasks.length - 1 && !task.completed && (
                        <div className="flex justify-end -mt-1">
                            <button 
                                                                        onClick={() => setTasks(prev => StateManager.updatePositions([...prev, { id: Math.max(...prev.map(t => t.id)) + 1, name: 'New Task', completed: false, Active: 0, Idle: 0 }]))}
                                className="text-green-500 text-lg leading-none"
                            >
                                ⊕
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}