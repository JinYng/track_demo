import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material'
import type { AssemblyDropdownProps } from './types'

/**
 * AssemblyDropdown component displays assembly versions for the selected species
 * Dynamically shows title as "[Species Name] Assembly"
 */
export default function AssemblyDropdown({
  speciesName,
  assemblies,
  currentAssemblyId,
  onSelectAssembly,
  disabled = false,
}: AssemblyDropdownProps) {
  const labelId = 'assembly-dropdown-label'
  const label = `${speciesName} Assembly`

  return (
    <FormControl fullWidth disabled={disabled} size="small">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        value={currentAssemblyId}
        label={label}
        onChange={e => onSelectAssembly(e.target.value)}
      >
        {assemblies.map(assembly => (
          <MenuItem key={assembly.id} value={assembly.id}>
            <div>
              <Typography variant="body2">{assembly.name}</Typography>
              {assembly.description && (
                <Typography variant="caption" color="text.secondary">
                  {assembly.description}
                </Typography>
              )}
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
