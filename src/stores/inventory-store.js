import { defineStore } from 'pinia';

export const InventoryStore = defineStore('inventory', {
  state: () => ({
    inventoryRequest: null,
    inventoryId: null,
    inventory: null,
  }),
  getters: {
    loadingInventory: (state) => state.inventoryLoading
  },
  actions: {
    async getInventory(client, route) {
      
    }
  }
});
