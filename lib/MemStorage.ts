import {IndexedEvents} from './IndexedEvents.js';


type ChangeEventHandler = (dir: string, name: string, value: any, oldValue: any) => void

export interface MemStorageBase {
  readonly changeEvent: IndexedEvents<ChangeEventHandler>
  initStorage(storage: Record<string, Record<string, any>>): Promise<void>
  get(dir: string, name: string): Promise<any>
  getNames(dir: string): Promise<string[]>
  set(dir: string, name: string, value: any): Promise<void>
  remove(dir: string, name: string): Promise<void>
  clear(dir: string): Promise<void>
}


/**
 * It is storage in memory.
 * It means that all the data will be lost on system stop.
 */
export class MemStorage implements MemStorageBase {
  readonly changeEvent = new IndexedEvents<ChangeEventHandler>()

  private storage: Record<string, Record<string, any>> = {}


  /**
   * If need you can init storage for example loaded from file
   */
  async initStorage(storage: Record<string, Record<string, any>>) {
    this.storage = storage
  }

  async get(dir: string, name: string): Promise<any> {
    return this.storage[dir][name]
  }

  async getNames(dir: string): Promise<string[]> {
    return Object.keys(this.storage[dir])
  }

  async set(dir: string, name: string, value: any) {
    if (!this.storage[dir]) this.storage[dir] = {}

    const oldValue = this.storage[dir][name]

    this.storage[dir][name] = value

    this.changeEvent.emit(dir, name, value, oldValue)
  }

  async remove(dir: string, name: string) {
    if (!this.storage[dir]) return

    const oldValue = this.storage[dir][name]

    delete this.storage[dir][name]

    this.changeEvent.emit(dir, name, undefined, oldValue)
  }

  async clear(dir: string) {
    const oldDir = this.storage[dir]

    delete this.storage[dir]

    for (const name of Object.keys(oldDir)) {
      this.changeEvent.emit(dir, name, undefined, oldDir[name])
    }
  }

}
