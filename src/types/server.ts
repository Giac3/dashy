

export type TServer = {
  id: string
  name?: string
  color?: string
  url: string
  host?: string
  port?: number
  database?: string
  username?: string
  password?: string
  ssl?: boolean
  lastConnected?: Date
  status?: "connected" | "disconnected" | "error" | "testing"
}



export type TServerList = {
    [key: string]: TServer[];
}

