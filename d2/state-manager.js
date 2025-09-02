const StateManager = {
    stateFromTitlesOnly: (titles, title = "Task Timer") => ({
        title,
        tasks: titles.map((name, index) => ({
            id: index + 1, name, completed: false, Active: 0, Idle: 0, position: index
        })),
        currentTaskId: 1,
        currentInterval: null
    }),

    stateFromString: (stateString) => {
        const defaultTitles = ['Task 1', 'Task 2', 'Task 3'];
        if (!stateString.trim()) return StateManager.stateFromTitlesOnly(defaultTitles);
        
        try {
            const state = JSON.parse(atob(stateString));
            return { ...state, tasks: TimerUtils.updatePositions(state.tasks) };
        } catch {
            const lines = stateString.split('\n').map(line => line.trim()).filter(line => line !== '');
            
            let title = "";
            let taskLines = lines;
            
            if (lines.length > 0 && lines[0].startsWith('title: ')) {
                title = lines[0].substring(7);
                taskLines = lines.slice(1);
            }
            
            if (taskLines.length === 0 || taskLines.length > 100 || taskLines.some(name => name.length > 512)) {
                throw new Error('Invalid format');
            }
            
            return StateManager.stateFromTitlesOnly(taskLines, title);
        }
    },

    stringFromState: (title, tasks, currentTaskId, currentInterval) => {
        // If not started just return task titles (with title if not default)
        if (!currentInterval && 
            tasks.every(task => task.Active === 0 && task.Idle === 0 && !task.completed)) {
            const taskNames = tasks.map(task => task.name).join('\n');
            return (title && title !== "Task Timer") ? `title: ${title}\n${taskNames}` : taskNames;
        }
        
        const state = { 
            title,
            tasks: tasks.map(({position, ...task}) => task),
            currentTaskId,
            currentInterval
        };
        return btoa(JSON.stringify(state));
    }
};