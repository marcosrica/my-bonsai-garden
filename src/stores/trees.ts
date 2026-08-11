import { defineStore } from "pinia";
import { getAllTrees, initDatabase } from "@/services/database";

interface Tree {
  id: number;
  species: number;
  year_planted: number;
  created_at: string;
}

export const useTreeStore = defineStore('trees', {
  state: () => ({
    trees: [] as Tree[],
    loading: false,
  }),
  actions: {
    async init() {
      await initDatabase();
      await this.fetchTrees();
    },
    
    async fetchTrees() {
      this.loading = true;
      const result = await getAllTrees();
      this.trees = result.values as Tree[];
      this.loading = false;
    },
  },
});