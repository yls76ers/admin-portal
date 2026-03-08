import { readFileSync } from 'fs'
import { join } from 'path'

export function getVersionId(): string {
  try {
    return readFileSync(join(process.cwd(), 'version/ver-id.txt'), 'utf-8').trim()
  } catch {
    return '© 2026 MACCOM LABS · Admin Portal v1.0'
  }
}
