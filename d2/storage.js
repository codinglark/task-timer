// storage.js - Pure storage operations
// Slots is a dictionary; if localStorage is unset, start with empty dictionary.
// Slot is anytype; if unset it's undefined (not null)
const getSlots = () => {
  try {
    return JSON.parse(localStorage.getItem('taskTimerSlots') || '{}');
  } catch {
    alert('Corrupt state found in taskTimerSlots.');
    return {};
  }
};

const storage = {
  save: (state, slotId) => {
    try {
      const slots = getSlots();
      slots[slotId] = state;
      
      localStorage.setItem('taskTimerSlots', JSON.stringify(slots));
      localStorage.setItem('taskTimerCurrentSlot', slotId.toString());
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },

  load: (slotId) => {
    const slots = getSlots();
    return slots[slotId];
  },

  getAllSlots: () => {
    const slots = getSlots();
    return [1, 2, 3, 4, 5].map(i => ({
      id: i,
      data: slots[i] || null
    }));
  },

  clearAll: () => {
    localStorage.removeItem('taskTimerSlots');
    localStorage.removeItem('taskTimerCurrentSlot');
  },

  getCurrentSlot: () => parseInt(localStorage.getItem('taskTimerCurrentSlot') || '1')
};