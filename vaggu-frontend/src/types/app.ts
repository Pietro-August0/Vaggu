export type UserRole = "admin" | "shopping"

export interface UserAccount {
  id: string
  email: string
  passwordHash: string
  role: UserRole
  mallId?: string
}
export interface Mall {
  id: string
  name: string
  cnpj: string
  address: string
  managerName: string
  managerEmail: string
  managerPhone: string
  totalSpaces: number
  sensorsConnected: boolean
  insightsActive: boolean
  createdAt: string
}

export interface AppData {
  version: 1
  users: UserAccount[]
  malls: Mall[]
  sessionUserId: string | null
}

export type NewMallInput = Omit<
  Mall,
  "id" | "sensorsConnected" | "insightsActive" | "createdAt"
>

export interface GeneratedAccess {
  mall: Mall
  email: string
  temporaryPassword: string
}
