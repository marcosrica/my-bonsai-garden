import { defineStore } from "pinia";
import { getEntries, getMenuTrees, getTreeData, initDatabase } from "@/services/database";
import type treeMenuData from "@/interfaces/TreeMenuData";
import type fullTreeData from "@/interfaces/FullTreeData";
import type Entries from "@/interfaces/Entries";
import { ensureDatabaseReady } from "@/services/dbInit";

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
      await ensureDatabaseReady();
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
      await ensureDatabaseReady();
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

export const useFeedStore = defineStore('entries', {
  state: () => ({
    entries: [] as Entries[],
    loading: false,
  }),
  actions: {
    async init(id: string) {
      await ensureDatabaseReady();
      await this.getData(id);
    },

    async getData(id: string) {
      this.loading = true;
      const result = await getEntries(id);
      const entries = result.values as Entries[];
    
      // Sort by created_at descending (dd/mm/yyyy)
      entries.sort((a, b) => {
        const dateA = this.parseDate(a.created_at);
        const dateB = this.parseDate(b.created_at);
        return dateB.getTime() - dateA.getTime(); // descending
      });
    
      this.entries = entries;
      this.loading = false;
    },

    parseDate(dateStr: string) {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year || 0, (month || 1) - 1, day);
    }
  }
})