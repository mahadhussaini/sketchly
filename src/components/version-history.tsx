'use client'

import { useState, useMemo } from 'react'
import {
  History,
  GitBranch,
  Eye,
  RotateCcw,
  Code
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useVersionHistoryStore, CodeVersion } from '@/store/version-history-store'

interface VersionHistoryProps {
  projectId: string
  currentCode: string
  onCodeChange: (code: string, version: CodeVersion) => void
  onClose: () => void
}

export function VersionHistory({ projectId, currentCode, onCodeChange, onClose }: VersionHistoryProps) {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)

  const {
    getVersions,
    getCurrentVersion,
    rollbackToVersion,
    deleteVersion,
    compareVersions,
    hasUnsavedChanges
  } = useVersionHistoryStore()

  const versions = useMemo(() => getVersions(projectId), [projectId, getVersions])
  const currentVersion = getCurrentVersion(projectId)
  const hasUnsaved = hasUnsavedChanges(projectId, currentCode)

  const handleRollback = (versionId: string) => {
    const version = versions.find(v => v.id === versionId)
    if (!version) return

    const rolledBackVersion = rollbackToVersion(projectId, versionId)
    if (rolledBackVersion) {
      onCodeChange(rolledBackVersion.code, rolledBackVersion)
    }
  }

  const handleViewVersion = (version: CodeVersion) => {
    onCodeChange(version.code, version)
  }

  // handleCompare function removed - not used

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return timestamp.toLocaleDateString()
  }

  const comparison = useMemo(() => {
    if (selectedVersions.length === 2) {
      return compareVersions(projectId, selectedVersions[0], selectedVersions[1])
    }
    return null
  }, [selectedVersions, projectId, compareVersions])

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <History className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Version History</h2>
            {hasUnsaved && (
              <span className="px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded">
                Unsaved Changes
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {selectedVersions.length === 2 && (
              <Button
                variant={showCompare ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowCompare(!showCompare)}
              >
                <GitBranch className="w-4 h-4 mr-2" />
                {showCompare ? 'Hide Compare' : 'Compare'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              ×
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(100%-5rem)]">
          {/* Version List */}
          <div className="w-80 border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium text-sm mb-2">Versions ({versions.length})</h3>
              <p className="text-xs text-muted-foreground">
                Click on any version to view its code
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {versions.length === 0 ? (
                <div className="p-8 text-center">
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">No versions yet</h3>
                  <p className="text-xs text-muted-foreground">Start generating code to create versions</p>
                </div>
              ) : (
                <div className="p-2">
                  {versions.slice().reverse().map((version) => (
                    <VersionItem
                      key={version.id}
                      version={version}
                      isCurrent={version.id === currentVersion?.id}
                      isSelected={selectedVersions.includes(version.id)}
                      onSelect={() => {
                        if (selectedVersions.includes(version.id)) {
                          setSelectedVersions(prev => prev.filter(id => id !== version.id))
                        } else if (selectedVersions.length < 2) {
                          setSelectedVersions(prev => [...prev, version.id])
                        } else {
                          setSelectedVersions([selectedVersions[1], version.id])
                        }
                      }}
                      onView={() => handleViewVersion(version)}
                      onRollback={() => handleRollback(version.id)}
                      onDelete={() => deleteVersion(projectId, version.id)}
                      timeAgo={formatTimeAgo(version.timestamp)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col">
            {showCompare && comparison ? (
              <VersionComparison
                comparison={comparison}
                versions={versions.filter(v => selectedVersions.includes(v.id))}
              />
            ) : (
              <div className="flex-1 p-4">
                <div className="bg-muted/30 rounded-lg p-4 h-full">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">
                        {selectedVersions.length === 2 ? 'Compare Versions' : 'Select Versions to Compare'}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {selectedVersions.length === 2
                          ? 'Click the Compare button to see differences'
                          : 'Select two versions to compare their changes'
                        }
                      </p>
                      {selectedVersions.length === 2 && (
                        <Button onClick={() => setShowCompare(true)}>
                          <GitBranch className="w-4 h-4 mr-2" />
                          Compare Versions
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface VersionItemProps {
  version: CodeVersion
  isCurrent: boolean
  isSelected: boolean
  onSelect: () => void
  onView: () => void
  onRollback: () => void
  onDelete: () => void
  timeAgo: string
}

function VersionItem({
  version,
  isCurrent,
  isSelected,
  onSelect,
  onView,
  onRollback,
  onDelete,
  timeAgo
}: VersionItemProps) {
  const [showActions, setShowActions] = useState(false)

  return (
    <div
      className={`p-3 mb-2 rounded-lg border cursor-pointer transition-colors ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/30 hover:bg-muted/30'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-medium text-sm truncate">
              Version {version.versionNumber}
            </h4>
            {isCurrent && (
              <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded">
                Current
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate mb-1">
            {version.description}
          </p>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>{timeAgo}</span>
            <span>•</span>
            <span>{version.componentName}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onView()
            }}
            className="w-6 h-6 p-0"
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onRollback()
            }}
            className="w-6 h-6 p-0"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setShowActions(!showActions)
            }}
            className="w-6 h-6 p-0"
          >
            ⋯
          </Button>
        </div>
      </div>

      {showActions && (
        <div className="mt-2 flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onRollback()
            }}
            className="text-xs px-2 py-1 h-6"
          >
            Rollback
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="text-xs px-2 py-1 h-6 text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  )
}

interface VersionComparisonProps {
  comparison: {
    additions: string[]
    deletions: string[]
    modifications: string[]
  }
  versions: CodeVersion[]
}

function VersionComparison({ comparison, versions }: VersionComparisonProps) {
  const { additions, deletions, modifications } = comparison

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h3 className="font-medium text-sm mb-2">Comparing Versions</h3>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span>v{versions[0]?.versionNumber} → v{versions[1]?.versionNumber}</span>
          <span>•</span>
          <span>{additions.length} additions</span>
          <span>•</span>
          <span>{deletions.length} deletions</span>
          <span>•</span>
          <span>{modifications.length} modifications</span>
        </div>
      </div>

      <div className="p-4">
        {additions.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-sm text-green-600 dark:text-green-400 mb-2">
              Additions ({additions.length})
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {additions.slice(0, 10).map((addition, index) => (
                <div key={index} className="text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded font-mono">
                  {addition}
                </div>
              ))}
              {additions.length > 10 && (
                <div className="text-xs text-muted-foreground text-center">
                  ... and {additions.length - 10} more additions
                </div>
              )}
            </div>
          </div>
        )}

        {deletions.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-sm text-red-600 dark:text-red-400 mb-2">
              Deletions ({deletions.length})
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {deletions.slice(0, 10).map((deletion, index) => (
                <div key={index} className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded font-mono">
                  {deletion}
                </div>
              ))}
              {deletions.length > 10 && (
                <div className="text-xs text-muted-foreground text-center">
                  ... and {deletions.length - 10} more deletions
                </div>
              )}
            </div>
          </div>
        )}

        {modifications.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-sm text-blue-600 dark:text-blue-400 mb-2">
              Modifications ({modifications.length})
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {modifications.slice(0, 10).map((modification, index) => (
                <div key={index} className="text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded font-mono">
                  {modification}
                </div>
              ))}
              {modifications.length > 10 && (
                <div className="text-xs text-muted-foreground text-center">
                  ... and {modifications.length - 10} more modifications
                </div>
              )}
            </div>
          </div>
        )}

        {additions.length === 0 && deletions.length === 0 && modifications.length === 0 && (
          <div className="text-center py-8">
            <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No Changes</h3>
            <p className="text-sm text-muted-foreground">These versions are identical</p>
          </div>
        )}
      </div>
    </div>
  )
}
