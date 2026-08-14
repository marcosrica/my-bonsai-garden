import { defineStore } from "pinia";
import { getMenuTrees, getTreeData, initDatabase } from "@/services/database";
import type treeMenuData from "@/interfaces/TreeMenuData";
import type fullTreeData from "@/interfaces/FullTreeData";

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

export const useFullTreeStore = defineStore('tree', {
  state: () => ({
    tree: undefined as fullTreeData | undefined,
    loading: false,
  }),
  actions: {
    async init(id: string) {
      await initDatabase();
      await this.getData(id);
    },
    
    async getData(id: string) {
      this.loading = true;
      const result = await getTreeData(id);
      this.tree = (result.values as fullTreeData[])[0];
      this.loading = false;
    },
  },
});