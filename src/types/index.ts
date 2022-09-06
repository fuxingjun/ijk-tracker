/**
 * 默认选项
 */
export interface DefaultOptions {
  uuid?: string,
  /**
   * 接口地址
   */
  requestUrl: string,
  /**
   * history 上报
   */
  historyTracker: boolean,
  /**
   * hash 上报
   */
  hashTracker: boolean,
  /**
   * 携带 tracker-key 点击事件上报
   */
  domTracker: boolean,
  sdkVersion: string | number,
  /**
   * 透传字段
   */
  extra?: Record<string, any>,
  /**
   * js 和 promise 异常上报
   */
  jsError: boolean,
}

export interface Options extends Partial<DefaultOptions> {
  requestUrl: string
}

export enum TrackerConfig {
  version = "1.0.0"
}
