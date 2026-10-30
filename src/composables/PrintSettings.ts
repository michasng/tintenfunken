import type { Ref } from 'vue'
import type { DuplexMode } from '@/domain/DuplexMode'
import type { FlipEdge } from '@/domain/FlipEdge'

export interface PrintSettings {
  duplexMode: Ref<DuplexMode>
  flipEdge: Ref<FlipEdge>
}
