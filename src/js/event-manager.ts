/**
 * __vite-browser-external:events:3 Uncaught Error: Module "events" has been externalized for browser compatibility. Cannot access "events.EventEmitter" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details. at Object.get (__vite-browser-external:events:3:13) at event-manager.ts:1:30 get @ __vite-browser-external:events:3 (anonymous) @ event-manager.ts:1
 */
// import { EventEmitter } from 'events'

// export const EventManager = new EventEmitter()

// src/js/event-manager.ts
import mitt, { type EventType } from 'mitt'
import type { GuideUIItem } from '../js/map-manager'

// 定义事件类型
export type AppEvent = {
  RenderMapGuideUI: GuideUIItem[]
}

declare module 'mitt' {
  export interface EventsMap extends Record<EventType, any> {}
}

export const EventManager = mitt<AppEvent>()
