import { Category } from '@/domain/Category'

export const isCategory = (value: string): value is Category =>
  Object.values<string>(Category).includes(value)
