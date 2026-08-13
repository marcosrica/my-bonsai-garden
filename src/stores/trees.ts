import { defineStore } from "pinia";
import { getAllTrees, getMenuTrees, initDatabase } from "@/services/database";
import type treeMenuData from "@/interfaces/TreeMenuData";

export interface Tree {
  id: number;
  name: string;
  species: number;
  year_planted: number;
  created_at: string;
}

export const useTreeStore = defineStore('trees', {
  state: () => ({
    trees: [] as treeMenuData[],
    loading: false,
  }),
  actions: {
    async init() {
      await initDatabase();
      await this.fetchTrees();
    },
    
    async fetchTrees() {
      this.loading = true;
      const result = await getMenuTrees();
      this.trees = result.values as treeMenuData[];
      this.loading = false;
    },
  },
});