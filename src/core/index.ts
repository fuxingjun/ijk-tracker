import { TrackerConfig } from "../types";
import type { DefaultOptions, Options } from "../types";
import { createHistoryEvent } from "../utils";

export default class Tracker {
  public data: Options;

  constructor(options: Options) {
    this.data = Object.assign(this.initDefault(), options);
    this.installTracker();
  }

  private initDefault(): DefaultOptions {
    window.history.pushState = createHistoryEvent("pushState");
    window.history.replaceState = createHistoryEvent("replaceState");

    return {
      sdkVersion: TrackerConfig.version,
      historyTracker: false,
      hashTracker: false,
      domTracker: false,
      jsError: false,
    } as DefaultOptions
  }

  private captureEvents<T>(eventList: string[], targetKey: string, data?: T) {
    eventList.forEach(event => {
      window.addEventListener(event, () => {
        console.log("监听到了", event)
        this.reportTracker({
          event,
          targetKey,
          data,
        })
      })
    })
  }

  public setUSerId<T extends DefaultOptions['uuid']>(uuid: T) {
    this.data.uuid = uuid;
  }

  public setExtra<T extends DefaultOptions["extra"]>(extra: T) {
    this.data.extra = extra;
  }

  /**
   * 开启捕获数据
   * @private
   */
  private installTracker() {
    if (this.data.historyTracker) {
      this.captureEvents(["pushState", "replaceState", "popState"], "history-pv")
    }
    if (this.data.hashTracker) {
      this.captureEvents(["hashchange"], "hash-pv")
    }
    if (this.data.domTracker) {
      const mouseEventList: string[] = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover']
      this.targetKeyReport(mouseEventList);
    }
    if (this.data.jsError) {
      this.errorEvent();
      this.promiseRejected();
    }
  }

  /**
   * 上报带有tracker-key的元素数据
   * @param eventList
   * @private
   */
  private targetKeyReport(eventList: string[]) {
    eventList.forEach(event => {
      window.addEventListener(event, (e) => {
        const target = e.target as HTMLElement;
        const trackerKey = target.getAttribute("tracker-key");
        if (!trackerKey) return;
        this.reportTracker({
          trackerKey,
          event,
        })
      })
    })
  }

  /**
   * js 报错
   * @private
   */
  private errorEvent() {
    window.addEventListener("error", (event) => {
      this.reportTracker({
        event: "jsError",
        trackerKey: "message",
        message: event.message,
      })
    })
  }

  /**
   * promise 没有catch
   * @private
   */
  private promiseRejected() {
    window.addEventListener("unhandledrejection", event => {
      event.promise.catch(error => {
        this.reportTracker({
          event: "unhandledrejection",
          trackerKey: "message",
          message: error,
        })
      })
    })
  }

  /**
   * 暴露上报数据方法
   * @param data
   */
  public sendTracker<T>(data: T) {
    this.reportTracker(data);
  }

  /**
   * 上报数据
   * @param data
   * @private
   */
  private reportTracker<T>(data: T) {
    const params = Object.assign(this.data, data, { time: Date.now() })

    const formData = new FormData()
    formData.append("data", JSON.stringify(params))

    navigator.sendBeacon(this.data.requestUrl, formData);
  }
}
