export interface UserSettings {
  language?: string
  emailNotifications?: boolean
}

export interface UserProfile {
  id: string
  nick: string
  username: string
  email: string
  email_verified: boolean
  bio: string | null
  avatar_url: string | null
  settings: UserSettings
  created_at: string
  last_login: string | null
}

export interface UpdateProfilePayload {
  bio?: string
  settings?: UserSettings
}
