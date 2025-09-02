// slot-manager.js - Multi-slot persistence UI component
function SlotManager({ 
    showSlots, 
    setShowSlots, 
    currentSlot, 
    onSlotSwitch, 
    onDeleteAll, 
    currentTime 
}) {
    if (!showSlots) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowSlots(false)}>
            <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-bold mb-3">Saved Timers</h2>
                <div className="space-y-2">
                    {storage.getAllSlots().map(slot => (
                        <div 
                            key={slot.id}
                            onClick={() => onSlotSwitch(slot.id)}
                            className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${currentSlot === slot.id ? 'border-blue-500 bg-blue-50' : ''}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium">
                                    {!slot.data ? 'Task Timer' : 
                                     slot.data.title === '' ? 'Untitled' : 
                                     slot.data.title}
                                </span>
                                {currentSlot === slot.id && <span className="text-blue-500 text-sm">Current</span>}
                            </div>
                            <div className="text-sm text-gray-600">
                                {(() => {
                                    if (!slot.data) return 'Task 1';
                                    
                                    const currentTask = slot.data.tasks.find(t => t.id === slot.data.currentTaskId);
                                    if (!currentTask) return 'No current task';
                                    
                                    const taskName = currentTask.name || 'Untitled task';
                                    const interval = slot.data.currentInterval;
                                    
                                    if (!interval || interval.taskId !== currentTask.id) {
                                        return taskName;
                                    }
                                    
                                    let timeValue;
                                    if (interval.start) {
                                        const baseTime = currentTask[interval.type];
                                        const runningTime = currentTime - interval.start;
                                        timeValue = TimerUtils.formatTime(baseTime + runningTime);
                                    } else {
                                        timeValue = TimerUtils.formatTime(currentTask[interval.type]);
                                    }
                                    
                                    const buttonStyle = interval.type === 'Active' 
                                        ? 'bg-green-500 text-white px-1 rounded text-xs'
                                        : 'bg-red-500 text-white px-1 rounded text-xs';
                                    
                                    return (
                                        <span>
                                            {taskName} 
                                            <span className={`ml-2 ${buttonStyle}`}>
                                                {interval.type}: {timeValue}
                                            </span>
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex gap-2">
                    <button 
                        onClick={() => setShowSlots(false)}
                        className="flex-1 px-3 py-2 rounded bg-gray-200"
                    >
                        Close
                    </button>
                    <button 
                        onClick={() => {
                            setShowSlots(false);
                            setTimeout(() => {
                                if (confirm('Delete ALL app state? This cannot be undone!')) {
                                    onDeleteAll();
                                }
                            }, 100);
                        }}
                        className="px-3 py-2 rounded bg-red-500 text-white text-sm"
                        title="Delete all saved timers and reset to fresh app state"
                    >
                        Delete all app state (!)
                    </button>
                </div>
            </div>
        </div>
    );
}