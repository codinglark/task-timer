// storage.js - Pure storage operations
// Slots is a dictionary; if localStorage is unset, start with empty dictionary.
// Slot is anytype; if unset it's undefined (not null)
const storage = {
  save: (state, slotId) => {
    try {
      const slots = JSON.parse(localStorage.getItem('taskTimerSlots') || '{}');
      slots[slotId] = state;
      
      localStorage.setItem('taskTimerSlots', JSON.stringify(slots));
      localStorage.setItem('taskTimerCurrentSlot', slotId.toString());
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },

  load: (slotId) => {
    try {
      const slots = JSON.parse(localStorage.getItem('taskTimerSlots') || '{}');
      return slots[slotId];
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