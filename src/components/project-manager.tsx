'use client'

import { useState, useRef } from 'react'
import {
  FolderOpen,
  Save,
  Plus,
  Search,
  MoreVertical,
  Download,
  Upload,
  Copy,
  Trash2,
  FileImage,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProjectStore } from '@/store/project-store'
import { Project } from '@/store/project-store'
import { useSketchStore } from '@/store/sketch-store'

interface ProjectManagerProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectManager({ isOpen, onClose }: ProjectManagerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    projects,
    currentProject,
    recentProjects,
    createProject,
    loadProject,
    saveProject,
    deleteProject,
    exportProject,
    importProject,
    duplicateProject,
    searchProjects,
    clearRecentProjects
  } = useProjectStore()

  const { currentSketch } = useSketchStore()

  const filteredProjects = searchQuery
    ? searchProjects(searchQuery)
    : projects

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return

    createProject(newProjectName, newProjectDescription)
    setNewProjectName('')
    setNewProjectDescription('')
    setShowCreateDialog(false)
    onClose()

    // Auto-save to associate current sketches
    if (currentSketch) {
      // This would be handled by the project store integration
    }
  }

  const handleLoadProject = (project: Project) => {
    loadProject(project.id)
    onClose()
  }

  const handleSaveCurrentProject = () => {
    if (currentProject) {
      saveProject()
    } else {
      setShowCreateDialog(true)
    }
  }

  const handleExportProject = (project: Project) => {
    exportProject(project.id)
  }

  const handleImportProject = () => {
    fileInputRef.current?.click()
  }

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const projectData: Project = JSON.parse(text)
      importProject(projectData)
      onClose()
    } catch (error) {
      console.error('Failed to import project:', error)
      // TODO: Add toast notification
    }
  }

  const handleDuplicateProject = (project: Project) => {
    try {
      duplicateProject(project.id)
      onClose()
    } catch (error) {
      console.error('Failed to duplicate project:', error)
    }
  }


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <FolderOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Project Manager</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveCurrentProject}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Project
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportProject}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              ×
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-5rem)]">
          {/* Search and Actions */}
          <div className="p-4 border-b border-border">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          {/* Recent Projects */}
          {!searchQuery && recentProjects.length > 0 && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Recent Projects
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentProjects}
                  className="text-xs"
                >
                  Clear
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentProjects.slice(0, 6).map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onLoad={handleLoadProject}
                    onExport={() => handleExportProject(project)}
                    onDuplicate={() => handleDuplicateProject(project)}
                    onDelete={() => deleteProject(project.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Projects */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-3">
              <h3 className="font-medium">
                {searchQuery ? `Search Results (${filteredProjects.length})` : `All Projects (${projects.length})`}
              </h3>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {searchQuery ? 'No projects found' : 'No projects yet'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'Create your first project to get started'
                  }
                </p>
                {!searchQuery && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onLoad={handleLoadProject}
                    onExport={() => handleExportProject(project)}
                    onDuplicate={() => handleDuplicateProject(project)}
                    onDelete={() => deleteProject(project.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Project Dialog */}
        {showCreateDialog && (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4">Create New Project</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Name</label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description (optional)</label>
                  <textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Enter project description"
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={!newProjectName.trim()}
                >
                  Create Project
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden file input for import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileImport}
          className="hidden"
        />
      </div>
    </div>
  )
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))
}

interface ProjectCardProps {
  project: Project
  onLoad: (project: Project) => void
  onExport: () => void
  onDuplicate: () => void
  onDelete: () => void
}

function ProjectCard({ project, onLoad, onExport, onDuplicate, onDelete }: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{project.name}</h4>
          <p className="text-xs text-muted-foreground truncate">
            {project.description || 'No description'}
          </p>
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 p-0"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>

          {showMenu && (
            <div className="absolute right-0 top-full z-10 bg-card border border-border rounded-md shadow-lg py-1 min-w-32">
              <button
                onClick={() => {
                  onExport()
                  setShowMenu(false)
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => {
                  onDuplicate()
                  setShowMenu(false)
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center"
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this project?')) {
                    onDelete()
                  }
                  setShowMenu(false)
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent text-red-600 hover:bg-red-50 dark:hover:bg-red-950 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <div className="flex items-center">
          <FileImage className="w-3 h-3 mr-1" />
          {project.sketches.length} sketches
        </div>
        <div>{formatDate(project.updatedAt)}</div>
      </div>

      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-primary/10 text-primary rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <Button
        onClick={() => onLoad(project)}
        className="w-full"
        size="sm"
      >
        Open Project
      </Button>
    </div>
  )
}

// formatDate function removed - not used
