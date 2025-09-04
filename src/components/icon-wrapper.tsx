'use client'

import { forwardRef } from 'react'
import { LucideProps } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamic imports for all icons to prevent SSR issues
const ZapIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Zap })), { ssr: false })
const MenuIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Menu })), { ssr: false })
const KeyboardIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Keyboard })), { ssr: false })
const FolderOpenIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.FolderOpen })), { ssr: false })
const MoonIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Moon })), { ssr: false })
const SunIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Sun })), { ssr: false })
const SettingsIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Settings })), { ssr: false })
const DownloadIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Download })), { ssr: false })
const HistoryIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.History })), { ssr: false })
const PaletteIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Palette })), { ssr: false })
const TrendingUpIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })), { ssr: false })

// Additional icons for component library
const SearchIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Search })), { ssr: false })
const PlusIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Plus })), { ssr: false })
const CopyIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Copy })), { ssr: false })
const LayoutIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Layout })), { ssr: false })
const MousePointerIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.MousePointer })), { ssr: false })
const TypeIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Type })), { ssr: false })
const ListIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.List })), { ssr: false })
const ChevronDownIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ChevronDown })), { ssr: false })
const ChevronRightIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ChevronRight })), { ssr: false })
const XIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.X })), { ssr: false })

// Performance analyzer icons
const AlertTriangleIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.AlertTriangle })), { ssr: false })
const CheckCircleIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.CheckCircle })), { ssr: false })
const RefreshCwIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.RefreshCw })), { ssr: false })
const BarChart3Icon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.BarChart3 })), { ssr: false })
const CpuIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Cpu })), { ssr: false })
const HardDriveIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.HardDrive })), { ssr: false })
const GlobeIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Globe })), { ssr: false })
const EyeIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Eye })), { ssr: false })
const EyeOffIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.EyeOff })), { ssr: false })
const GitBranchIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.GitBranch })), { ssr: false })

// Project manager icons
const SaveIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Save })), { ssr: false })
const UploadIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Upload })), { ssr: false })
const Trash2Icon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Trash2 })), { ssr: false })
const FileImageIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.FileImage })), { ssr: false })
const ClockIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Clock })), { ssr: false })

// Icon mapping for easy access
export const Icons = {
  Zap: ZapIcon,
  Menu: MenuIcon,
  Keyboard: KeyboardIcon,
  FolderOpen: FolderOpenIcon,
  Moon: MoonIcon,
  Sun: SunIcon,
  Settings: SettingsIcon,
  Download: DownloadIcon,
  History: HistoryIcon,
  Palette: PaletteIcon,
  TrendingUp: TrendingUpIcon,
  Search: SearchIcon,
  Plus: PlusIcon,
  Copy: CopyIcon,
  Layout: LayoutIcon,
  MousePointer: MousePointerIcon,
  Type: TypeIcon,
  List: ListIcon,
  ChevronDown: ChevronDownIcon,
  ChevronRight: ChevronRightIcon,
  X: XIcon,
  AlertTriangle: AlertTriangleIcon,
  CheckCircle: CheckCircleIcon,
  RefreshCw: RefreshCwIcon,
  BarChart3: BarChart3Icon,
  Cpu: CpuIcon,
  HardDrive: HardDriveIcon,
  Globe: GlobeIcon,
  Eye: EyeIcon,
  EyeOff: EyeOffIcon,
  GitBranch: GitBranchIcon,
  Save: SaveIcon,
  Upload: UploadIcon,
  Trash2: Trash2Icon,
  FileImage: FileImageIcon,
  Clock: ClockIcon,
} as const

// Generic Icon component with proper typing
interface IconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof Icons
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(({ name, ...props }, ref) => {
  const IconComponent = Icons[name]

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  return <IconComponent ref={ref} {...props} />
})

Icon.displayName = 'Icon'

// Individual icon exports for direct usage
export { ZapIcon, MenuIcon, KeyboardIcon, FolderOpenIcon, MoonIcon, SunIcon, SettingsIcon, DownloadIcon, HistoryIcon, PaletteIcon, TrendingUpIcon, AlertTriangleIcon, CheckCircleIcon, RefreshCwIcon, BarChart3Icon, CpuIcon, HardDriveIcon, GlobeIcon, EyeIcon, EyeOffIcon, GitBranchIcon, SaveIcon, UploadIcon, Trash2Icon, FileImageIcon, ClockIcon }
