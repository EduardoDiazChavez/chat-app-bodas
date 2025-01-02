// @CHATS Interfaces de chats

export interface Notification {
  _id: string,
  message: string,
  createdAt: Date,
  readAt?: Date
}

export interface Contact {
  _id: string,
  uid: string,
  type: string,
  onLine: OnLine,
  nickName: string,
  photoURL: string
  correo: string,
  events: Event[]
}
export interface Event {
  _id: string,
  nombre: string
}
export interface Chat {
  _id: string
  addedes: Addedes[]
  messages: MessageChat[]
  createdAt: number
  updatedAt: number
  onLine: OnLine
  title: string
  type: string
  photoURL: string
}
interface OnLine {
  status: boolean
  dateConection: number
}
interface Addedes {
  userUid: string
  type: string
  online: boolean
}

export interface MessageChat {
  type?: string
  emitUserUid?: string
  message?: string
  fileUrl?: string
  language?: string
  audio?: string
  video?: string
  image?: string
  title?: string
  description?: string
  url?: string
  createdAt?: number
  received?: boolean
  read?: boolean
  deletedEmit?: boolean
  deletedReceiv?: boolean
}

interface online {
  status: boolean
  dateConection: number
}

export interface image {
  _id: string
  i1024: string
  i800: string
  i640: string
  i320: string
}