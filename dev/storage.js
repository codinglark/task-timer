// storage.js - Pure storage operations
alert('storage.js loading');
const storage = {
  save: (state, slotId = 1) => {
    try {
      const stateToSave = {
        title: state.title,
        tasks: state.tasks.map(({position, ...task}) => task),
        currentTaskId: state.currentTaskId,
        currentInterval: state.currentInterval,
        savedAt: new Date().toISOString()
      };
      
      const slots = JSON.parse(localStorage.getItem('taskTimerSlots') || '{}');
      slots[slotId] = stateToSave;
      
      localStorage.setItem('taskTimerSlots', JSON.stringify(slots));
      localStorage.setItem('taskTimerCurrentSlot', slotId.toString());
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },

  load: (slotId = null) => {
    try {
      const targetSlot = slotId || localStorage.getItem('taskTimerCurrentSlot') || '1';
      const slots = JSON.parse(localStorage.getItem('taskTimerSlots') || '{}');
      const saved = slots[targetSlot];
      
      if (!saved) return null;
      
      return {
        ...saved,
        tasks: saved.tasks.map((task, index) => ({ ...task, position: index }))
      };
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return null;
    }
  },

  getAllSlots: () => {
    try {
      const slots = JSON.parse(localStorage.getItem('taskTimerSlots') || '{}');
      return [1, 2, 3, 4, 5].map(i => ({
        id: i,
        data: slots[i] || null
      }));
    } catch (error) {
      console.warn('Failed to load slots:', error);
      return [1, 2, 3, 4, 5].map(i => ({ id: i, data: null }));
    }
  },

  clearAll: () => {
    localStorage.removeItem('taskTimerSlots');
    localStorage.removeItem('taskTimerCurrentSlot');
  },

  getCurrentSlot: () => parseInt(localStorage.getItem('taskTimerCurrentSlot') || '1')
};