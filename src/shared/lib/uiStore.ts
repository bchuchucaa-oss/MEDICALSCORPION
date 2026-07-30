import { create } from 'zustand'

interface UiState {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

// Zustand holds transient UI/view state only (sidebar, modals, active tab).
// Domain data belongs to TanStack Query, backed by the IPC services layer.
export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
