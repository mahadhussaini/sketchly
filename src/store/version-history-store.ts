import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export interface CodeVersion {
  id: string
  code: string
  timestamp: Date
  description: string
  aiSuggestions?: string[]
  changes?: string[]
  componentName: string
  versionNumber: number
  parentVersionId?: string
}

export interface VersionHistory {
  projectId: string
  versions: CodeVersion[]
  currentVersionId: string
}

interface VersionHistoryStore {
  // State
  histories: Record<string, VersionHistory>
  currentProjectId: string | null

  // Actions
  initializeHistory: (projectId: string, initialCode: string, componentName: string) => void
  addVersion: (projectId: string, code: string, description?: string, componentName?: string) => CodeVersion
  getVersions: (projectId: string) => CodeVersion[]
  getCurrentVersion: (projectId: string) => CodeVersion | null
  rollbackToVersion: (projectId: string, versionId: string) => CodeVersion | null
  deleteVersion: (projectId: string, versionId: string) => void
  updateVersion: (projectId: string, versionId: string, updates: Partial<CodeVersion>) => void
  compareVersions: (projectId: string, versionId1: string, versionId2: string) => {
    additions: string[]
    deletions: string[]
    modifications: string[]
  } | null
  getVersionTree: (projectId: string) => CodeVersion[]
  setCurrentProject: (projectId: string) => void
  clearHistory: (projectId: string) => void

  // Utilities
  getVersionCount: (projectId: string) => number
  getLatestVersion: (projectId: string) => CodeVersion | null
  hasUnsavedChanges: (projectId: string, currentCode: string) => boolean
}

export const useVersionHistoryStore = create<VersionHistoryStore>()(
  persist(
    (set, get) => ({
      // Initial state
      histories: {},
      currentProjectId: null,

      // Actions
      initializeHistory: (projectId: string, initialCode: string, componentName: string) => {
        const initialVersion: CodeVersion = {
          id: uuidv4(),
          code: initialCode,
          timestamp: new Date(),
          description: 'Initial version',
          componentName,
          versionNumber: 1,
        }

        const history: VersionHistory = {
          projectId,
          versions: [initialVersion],
          currentVersionId: initialVersion.id,
        }

        set((state) => ({
          histories: {
            ...state.histories,
            [projectId]: history,
          },
          currentProjectId: projectId,
        }))
      },

      addVersion: (projectId: string, code: string, description = 'Updated code', componentName?: string) => {
        const { histories } = get()
        const history = histories[projectId]

        if (!history) {
          throw new Error('History not found for project')
        }

        const latestVersion = history.versions[history.versions.length - 1]
        const newVersion: CodeVersion = {
          id: uuidv4(),
          code,
          timestamp: new Date(),
          description,
          componentName: componentName || latestVersion.componentName,
          versionNumber: latestVersion.versionNumber + 1,
          parentVersionId: latestVersion.id,
        }

        const updatedHistory = {
          ...history,
          versions: [...history.versions, newVersion],
          currentVersionId: newVersion.id,
        }

        set((state) => ({
          histories: {
            ...state.histories,
            [projectId]: updatedHistory,
          },
        }))

        return newVersion
      },

      getVersions: (projectId: string) => {
        const { histories } = get()
        const history = histories[projectId]
        return history ? history.versions : []
      },

      getCurrentVersion: (projectId: string) => {
        const { histories } = get()
        const history = histories[projectId]

        if (!history) return null

        const currentVersion = history.versions.find(v => v.id === history.currentVersionId)
        return currentVersion || null
      },

      rollbackToVersion: (projectId: string, versionId: string) => {
        const { histories } = get()
        const history = histories[projectId]

        if (!history) return null

        const targetVersion = history.versions.find(v => v.id === versionId)
        if (!targetVersion) return null

        const updatedHistory = {
          ...history,
          currentVersionId: versionId,
        }

        set((state) => ({
          histories: {
            ...state.histories,
            [projectId]: updatedHistory,
          },
        }))

        return targetVersion
      },

      deleteVersion: (projectId: string, versionId: string) => {
        const { histories } = get()
        const history = histories[projectId]

        if (!history) return

        // Don't allow deleting the only version
        if (history.versions.length <= 1) return

        const updatedVersions = history.versions.filter(v => v.id !== versionId)
        let newCurrentVersionId = history.currentVersionId

        // If we're deleting the current version, switch to the latest remaining version
        if (history.currentVersionId === versionId) {
          const latestVersion = updatedVersions[updatedVersions.length - 1]
          newCurrentVersionId = latestVersion.id
        }

        const updatedHistory = {
          ...history,
          versions: updatedVersions,
          currentVersionId: newCurrentVersionId,
        }

        set((state) => ({
          histories: {
            ...state.histories,
            [projectId]: updatedHistory,
          },
        }))
      },

      updateVersion: (projectId: string, versionId: string, updates: Partial<CodeVersion>) => {
        const { histories } = get()
        const history = histories[projectId]

        if (!history) return

        const updatedVersions = history.versions.map(version =>
          version.id === versionId ? { ...version, ...updates } : version
        )

        const updatedHistory = {
          ...history,
          versions: updatedVersions,
        }

        set((state) => ({
          histories: {
            ...state.histories,
            [projectId]: updatedHistory,
          },
        }))
      },

      compareVersions: (projectId: string, versionId1: string, versionId2: string) => {
        const { histories } = get()
        const history = histories[projectId]

        if (!history) return null

        const version1 = history.versions.find(v => v.id === versionId1)
        const version2 = history.versions.find(v => v.id === versionId2)

        if (!version1 || !version2) return null

        const lines1 = version1.code.split('\n')
        const lines2 = version2.code.split('\n')

        const additions: string[] = []
        const deletions: string[] = []
        const modifications: string[] = []

        // Simple diff implementation
        const maxLines = Math.max(lines1.length, lines2.length)

        for (let i = 0; i < maxLines; i++) {
          const line1 = lines1[i] || ''
          const line2 = lines2[i] || ''

          if (line1 === '' && line2 !== '') {
            additions.push(`+ ${line2}`)
          } else if (line1 !== '' && line2 === '') {
            deletions.push(`- ${line1}`)
          } else if (line1 !== line2) {
            modifications.push(`~ ${line1} → ${line2}`)
          }
        }

        return { additions, deletions, modifications }
      },

      getVersionTree: (projectId: string) => {
        const { histories } = get()
        const history = histories[projectId]

        if (!history) return []

        // Build version tree based on parent-child relationships
        const versions = [...history.versions]
        versions.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

        return versions
      },

      setCurrentProject: (projectId: string) => {
        set({ currentProjectId: projectId })
      },

      clearHistory: (projectId: string) => {
        set((state) => ({
          histories: {
            ...state.histories,
            [projectId]: {
              projectId,
              versions: [],
              currentVersionId: '',
            },
          },
        }))
      },

      // Utilities
      getVersionCount: (projectId: string) => {
        const { histories } = get()
        const history = histories[projectId]
        return history ? history.versions.length : 0
      },

      getLatestVersion: (projectId: string) => {
        const { histories } = get()
        const history = histories[projectId]

        if (!history || history.versions.length === 0) return null

        return history.versions[history.versions.length - 1]
      },

      hasUnsavedChanges: (projectId: string, currentCode: string) => {
        const currentVersion = get().getCurrentVersion(projectId)
        return currentVersion ? currentVersion.code !== currentCode : true
      },
    }),
    {
      name: 'haven-version-history-store',
      partialize: (state) => ({
        histories: state.histories,
        currentProjectId: state.currentProjectId,
      }),
    }
  )
)
