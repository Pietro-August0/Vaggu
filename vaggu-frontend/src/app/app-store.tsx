import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { DEMO_ACCOUNTS, STORAGE_KEY } from "@/lib/constants"
import type {
  AppData,
  GeneratedAccess,
  Mall,
  NewMallInput,
  UserAccount,
} from "@/types/app"

interface AppStoreValue {
  ready: boolean
  currentUser: UserAccount | null
  currentMall: Mall | null
  malls: Mall[]
  login: (email: string, password: string) => Promise<UserAccount | null>
  logout: () => void
  createMall: (input: NewMallInput) => Promise<GeneratedAccess>
}

const AppStoreContext = createContext<AppStoreValue | null>(null)

async function hashPassword(password: string) {
  const encoded = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest("SHA-256", encoded)

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

function generateTemporaryPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#"
  const bytes = new Uint32Array(14)
  crypto.getRandomValues(bytes)

  return Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("")
}

function persist(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

function isAppData(value: unknown): value is AppData {
  if (!value || typeof value !== "object") return false

  const candidate = value as Partial<AppData>
  const validUsers =
    Array.isArray(candidate.users) &&
    candidate.users.every(
      (user) =>
        typeof user?.id === "string" &&
        typeof user.email === "string" &&
        typeof user.passwordHash === "string" &&
        (user.role === "admin" || user.role === "shopping"),
    )
  const validMalls =
    Array.isArray(candidate.malls) &&
    candidate.malls.every(
      (mall) =>
        typeof mall?.id === "string" &&
        typeof mall.name === "string" &&
        typeof mall.managerEmail === "string" &&
        typeof mall.totalSpaces === "number" &&
        typeof mall.sensorsConnected === "boolean" &&
        typeof mall.insightsActive === "boolean",
    )

  return (
    candidate.version === 1 &&
    validUsers &&
    validMalls &&
    (candidate.sessionUserId === null || typeof candidate.sessionUserId === "string")
  )
}

function readStoredData(): AppData | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (!value) return null

    const parsed: unknown = JSON.parse(value)
    return isAppData(parsed) ? parsed : null
  } catch {
    return null
  }
}

async function createSeedData(): Promise<AppData> {
  const demoMall: Mall = {
    id: "shopping-demo",
    name: "Shopping VAGGU Demo",
    cnpj: "12.345.678/0001-90",
    address: "Av. Paulista, 1000 — São Paulo, SP",
    managerName: "Marina Oliveira",
    managerEmail: DEMO_ACCOUNTS.shopping.email,
    managerPhone: "(11) 99999-9999",
    totalSpaces: 480,
    sensorsConnected: false,
    insightsActive: false,
    createdAt: new Date().toISOString(),
  }

  return {
    version: 1,
    sessionUserId: null,
    malls: [demoMall],
    users: [
      {
        id: "admin-demo",
        email: DEMO_ACCOUNTS.admin.email,
        passwordHash: await hashPassword(DEMO_ACCOUNTS.admin.password),
        role: "admin",
      },
      {
        id: "shopping-user-demo",
        email: DEMO_ACCOUNTS.shopping.email,
        passwordHash: await hashPassword(DEMO_ACCOUNTS.shopping.password),
        role: "shopping",
        mallId: demoMall.id,
      },
    ],
  }
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null)

  useEffect(() => {
    let active = true

    async function initialize() {
      const stored = readStoredData()
      const initial = stored ?? (await createSeedData())
      if (!stored) persist(initial)
      if (active) setData(initial)
    }

    void initialize()
    return () => {
      active = false
    }
  }, [])

  const currentUser = useMemo(
    () => data?.users.find((user) => user.id === data.sessionUserId) ?? null,
    [data],
  )

  const currentMall = useMemo(
    () => data?.malls.find((mall) => mall.id === currentUser?.mallId) ?? null,
    [currentUser, data],
  )

  async function login(email: string, password: string) {
    if (!data) return null

    const normalizedEmail = email.trim().toLowerCase()
    const passwordHash = await hashPassword(password)
    const user = data.users.find(
      (item) =>
        item.email.toLowerCase() === normalizedEmail &&
        item.passwordHash === passwordHash,
    )

    if (!user) return null

    const next = { ...data, sessionUserId: user.id }
    persist(next)
    setData(next)
    return user
  }

  function logout() {
    if (!data) return
    const next = { ...data, sessionUserId: null }
    persist(next)
    setData(next)
  }

  async function createMall(input: NewMallInput) {
    if (!data) throw new Error("O protótipo ainda está carregando.")

    const cleanedInput: NewMallInput = {
      ...input,
      name: input.name.trim(),
      cnpj: input.cnpj.trim(),
      address: input.address.trim(),
      managerName: input.managerName.trim(),
      managerEmail: input.managerEmail.trim(),
      managerPhone: input.managerPhone.trim(),
      totalSpaces: Number(input.totalSpaces),
    }
    const requiredText = [
      cleanedInput.name,
      cleanedInput.cnpj,
      cleanedInput.address,
      cleanedInput.managerName,
      cleanedInput.managerEmail,
      cleanedInput.managerPhone,
    ]

    if (requiredText.some((value) => !value)) {
      throw new Error("Preencha todos os dados do shopping e do responsável.")
    }
    if (cleanedInput.cnpj.replace(/\D/g, "").length !== 14) {
      throw new Error("Informe um CNPJ com 14 dígitos.")
    }
    const phoneLength = cleanedInput.managerPhone.replace(/\D/g, "").length
    if (phoneLength < 10 || phoneLength > 13) {
      throw new Error("Informe um telefone ou WhatsApp válido, com DDD.")
    }
    if (!/^\S+@\S+\.\S+$/.test(cleanedInput.managerEmail)) {
      throw new Error("Informe um e-mail corporativo válido.")
    }
    if (!Number.isInteger(cleanedInput.totalSpaces) || cleanedInput.totalSpaces < 1) {
      throw new Error("O total previsto de vagas deve ser um número inteiro maior que zero.")
    }

    const normalizedEmail = cleanedInput.managerEmail.toLowerCase()
    if (data.users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
      throw new Error("Já existe um acesso associado a este e-mail.")
    }

    const id = crypto.randomUUID()
    const temporaryPassword = generateTemporaryPassword()
    const mall: Mall = {
      ...cleanedInput,
      id,
      managerEmail: normalizedEmail,
      sensorsConnected: false,
      insightsActive: false,
      createdAt: new Date().toISOString(),
    }
    const user: UserAccount = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      passwordHash: await hashPassword(temporaryPassword),
      role: "shopping",
      mallId: id,
    }
    const next: AppData = {
      ...data,
      malls: [mall, ...data.malls],
      users: [...data.users, user],
    }

    persist(next)
    setData(next)
    return { mall, email: normalizedEmail, temporaryPassword }
  }

  return (
    <AppStoreContext.Provider
      value={{
        ready: Boolean(data),
        currentUser,
        currentMall,
        malls: data?.malls ?? [],
        login,
        logout,
        createMall,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  )
}

export function useAppStore() {
  const context = useContext(AppStoreContext)
  if (!context) {
    throw new Error("useAppStore deve ser usado dentro de AppStoreProvider")
  }

  return context
}
