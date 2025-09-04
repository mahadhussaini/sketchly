import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { SketchData } from './sketch-store'

export interface Project {
  id: string
  name: string
  description: string
  sketches: SketchData[]
  currentSketchId?: string
  createdAt: Date
  updatedAt: Date
  thumbnail?: string
  tags: string[]
}

interface ProjectStore {
  // State
  projects: Project[]
  currentProject: Project | null
  recentProjects: Project[]

  // Actions
  createProject: (name: string, description?: string) => Project
  loadProject: (projectId: string) => void
  saveProject: () => void
  deleteProject: (projectId: string) => void
  updateProject: (updates: Partial<Project>) => void
  addSketchToProject: (sketch: SketchData) => void
  removeSketchFromProject: (sketchId: string) => void
  setCurrentSketch: (sketchId: string) => void
  exportProject: (projectId: string) => void
  importProject: (projectData: Project) => void
  duplicateProject: (projectId: string) => Project
  clearRecentProjects: () => void

  // Utilities
  getProjectsByTag: (tag: string) => Project[]
  searchProjects: (query: string) => Project[]
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      // Initial state
      projects: [],
      currentProject: null,
      recentProjects: [],

      // Actions
      createProject: (name: string, description: string = '') => {
        const newProject: Project = {
          id: uuidv4(),
          name: name.trim(),
          description: description.trim(),
          sketches: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: [],
        }

        set((state) => ({
          projects: [newProject, ...state.projects],
          currentProject: newProject,
          recentProjects: [newProject, ...state.recentProjects.slice(0, 9)],
        }))

        return newProject
      },

      loadProject: (projectId: string) => {
        const { projects } = get()
        const project = projects.find(p => p.id === projectId)

        if (project) {
          set((state) => ({
            currentProject: project,
            recentProjects: [
              project,
              ...state.recentProjects.filter(p => p.id !== projectId).slice(0, 9)
            ],
          }))
        }
      },

      saveProject: () => {
        const { currentProject } = get()

        if (!currentProject) return

        const updatedProject = {
          ...currentProject,
          updatedAt: new Date(),
        }

        set((state) => ({
          projects: state.projects.map(p =>
            p.id === updatedProject.id ? updatedProject : p
          ),
          currentProject: updatedProject,
        }))
      },

      deleteProject: (projectId: string) => {
        set((state) => ({
          projects: state.projects.filter(p => p.id !== projectId),
          currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
          recentProjects: state.recentProjects.filter(p => p.id !== projectId),
        }))
      },

      updateProject: (updates: Partial<Project>) => {
        const { currentProject } = get()

        if (!currentProject) return

        const updatedProject = {
          ...currentProject,
          ...updates,
          updatedAt: new Date(),
        }

        set((state) => ({
          projects: state.projects.map(p =>
            p.id === updatedProject.id ? updatedProject : p
          ),
          currentProject: updatedProject,
        }))
      },

      addSketchToProject: (sketch: SketchData) => {
        const { currentProject } = get()

        if (!currentProject) return

        const updatedProject = {
          ...currentProject,
          sketches: [...currentProject.sketches, sketch],
          currentSketchId: sketch.id,
          updatedAt: new Date(),
        }

        set((state) => ({
          projects: state.projects.map(p =>
            p.id === updatedProject.id ? updatedProject : p
          ),
          currentProject: updatedProject,
        }))
      },

      removeSketchFromProject: (sketchId: string) => {
        const { currentProject } = get()

        if (!currentProject) return

        const updatedProject = {
          ...currentProject,
          sketches: currentProject.sketches.filter(s => s.id !== sketchId),
          currentSketchId: currentProject.currentSketchId === sketchId
            ? currentProject.sketches.find(s => s.id !== sketchId)?.id
            : currentProject.currentSketchId,
          updatedAt: new Date(),
        }

        set((state) => ({
          projects: state.projects.map(p =>
            p.id === updatedProject.id ? updatedProject : p
          ),
          currentProject: updatedProject,
        }))
      },

      setCurrentSketch: (sketchId: string) => {
        const { currentProject } = get()

        if (!currentProject) return

        const updatedProject = {
          ...currentProject,
          currentSketchId: sketchId,
          updatedAt: new Date(),
        }

        set((state) => ({
          projects: state.projects.map(p =>
            p.id === updatedProject.id ? updatedProject : p
          ),
          currentProject: updatedProject,
        }))
      },

      exportProject: (projectId: string) => {
        const { projects } = get()
        const project = projects.find(p => p.id === projectId)

        if (!project) return

        const dataStr = JSON.stringify(project, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })

        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      },

      importProject: (projectData: Project) => {
        const { projects } = get()

        // Check if project with same ID already exists
        const existingIndex = projects.findIndex(p => p.id === projectData.id)

        if (existingIndex >= 0) {
          // Update existing project
          const updatedProjects = [...projects]
          updatedProjects[existingIndex] = {
            ...projectData,
            updatedAt: new Date(),
          }

          set({
            projects: updatedProjects,
            currentProject: updatedProjects[existingIndex],
          })
        } else {
          // Add new project
          const newProject = {
            ...projectData,
            updatedAt: new Date(),
          }

          set((state) => ({
            projects: [newProject, ...state.projects],
            currentProject: newProject,
            recentProjects: [newProject, ...state.recentProjects.slice(0, 9)],
          }))
        }
      },

      duplicateProject: (projectId: string) => {
        const { projects } = get()
        const originalProject = projects.find(p => p.id === projectId)

        if (!originalProject) {
          throw new Error('Project not found')
        }

        const duplicatedProject: Project = {
          ...originalProject,
          id: uuidv4(),
          name: `${originalProject.name} (Copy)`,
          createdAt: new Date(),
          updatedAt: new Date(),
          sketches: originalProject.sketches.map(sketch => ({
            ...sketch,
            id: uuidv4(),
            uploadedAt: new Date(),
          })),
        }

        set((state) => ({
          projects: [duplicatedProject, ...state.projects],
          currentProject: duplicatedProject,
        }))

        return duplicatedProject
      },

      clearRecentProjects: () => {
        set({ recentProjects: [] })
      },

      // Utilities
      getProjectsByTag: (tag: string) => {
        const { projects } = get()
        return projects.filter(project =>
          project.tags.some(projectTag =>
            projectTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      },

      searchProjects: (query: string) => {
        const { projects } = get()
        const searchTerm = query.toLowerCase()

        return projects.filter(project =>
          project.name.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      },
    }),
    {
      name: 'haven-project-store',
      partialize: (state) => ({
        projects: state.projects,
        recentProjects: state.recentProjects,
      }),
    }
  )
)
