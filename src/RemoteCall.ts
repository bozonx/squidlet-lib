import {JsonTypes} from './interfaces/Types'
import {makeUniqId} from './uniqId'
import IndexedEventEmitter from './IndexedEventEmitter'

export type RemoteCallSendMessage = (host: string, uri: string, payload: Uint8Array) => void

enum REMOTE_CALL_EVENTS {
  incomeMessage,
}


export class RemoteCall {
  sendMessage: RemoteCallSendMessage
  private events = new IndexedEventEmitter()


  constructor(sendMessage: RemoteCallSendMessage) {
    this.sendMessage = sendMessage
  }


  incomeMessage(uri: string, payload: Uint8Array, fromHost: string) {
    this.events.emit(REMOTE_CALL_EVENTS.incomeMessage, uri, payload, fromHost)
  }

  async request(
    host: string,
    uri: string,
    path: string,
    payload: JsonTypes | Uint8Array
  ): Promise<JsonTypes | Uint8Array> {
    const requestId = makeUniqId()
    const completePayload = this.encodePayload(path, payload, requestId)

    await this.sendMessage(host, uri, completePayload)

    return new Promise((resolve, reject) => {
      const handlerIndex = this.events.addListener(REMOTE_CALL_EVENTS.incomeMessage, (
        uri: string,
        payload: Uint8Array,
        fromHost: string
      ) => {
        const incomeRequestId = this.extractRequestIdFromPayload(payload)

        if (incomeRequestId !== requestId) return

        this.events.removeListener(handlerIndex)
        // Extract only payload, path doesn't matter
        const decodedPayload = this.decodePayload(payload)

        resolve(decodedPayload)
      })

      // TODO: add timeout
    })


  }

  async on(): Promise<number> {
    // TODO: сделать спец запрос чтобы на той стороне создался обработчик
    //       который будет пересылать запросы сюда
    // TODO: или может события сделать частью network?
    // TODO: или может это отдельный хэлпер класс
  }

  async once(): Promise<number> {
    // TODO: add
  }

  async off() {
    // TODO: add
  }


  private encodePayload(
    uri: string,
    payload: JsonTypes | Uint8Array,
    requestId: string): Uint8Array
  {
    // TODO: преобразовать аргументы в Uint8Arr
  }

  private decodePayload(payload: Uint8Array): JsonTypes | Uint8Array {
    // TODO: add
  }

  private extractRequestIdFromPayload(payload: Uint8Array): string {
    // TODO: add
  }

}
