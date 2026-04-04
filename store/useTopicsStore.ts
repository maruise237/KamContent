import { create } from 'zustand'
import type { Topic, Script } from '@/types/database'

interface TopicsState {
  topics: Topic[]
  selectedIds: string[]
  scripts: Record<string, Script>
  setTopics: (topics: Topic[]) => void
  toggleSelection: (id: string, max: number) => void
  clearSelection: () => void
  setScript: (topicId: string, script: Script) => void
  updateTopicStatus: (id: string, status: Topic['status']) => void
}

export const useTopicsStore = create<TopicsState>((set) => ({
  topics: [],
  selectedIds: [],
  scripts: {},

  setTopics: (topics) => set({ topics }),

  toggleSelection: (id, max) =>
    set((state) => {
      if (state.selectedIds.includes(id)) {
        return { selectedIds: state.selectedIds.filter((i) => i !== id) }
      }
      if (state.selectedIds.length >= max) return state
      return { selectedIds: [...state.selectedIds, id] }
    }),

  clearSelection: () => set({ selectedIds: [] }),

  setScript: (topicId, script) =>
    set((state) => ({
      scripts: { ...state.scripts, [topicId]: script },
    })),

  updateTopicStatus: (id, status) =>
    set((state) => ({
      topics: state.topics.map((t) => (t.id === id ? { ...t, status } : t)),
    })),
}))
