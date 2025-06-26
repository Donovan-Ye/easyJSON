import { setupGlobalGraphStyle } from "@/lib/graph/layout";
import { px2num } from "@/lib/utils";
import { MyWorker } from "@/lib/worker/worker";
import { useEffect } from "react";
import { wrap } from "comlink";

const useInitial = () => {
  useEffect(() => {
    // initial worker
    window.rawWorker = new Worker(
      new URL("@/lib/worker/worker.ts", import.meta.url),
      {
        type: "module",
      }
    );
    window.worker = wrap<MyWorker>(window.rawWorker);
    window.addEventListener("beforeunload", () => {
      console.l("worker is terminated.");
      window.rawWorker?.terminate();
    });

    // measure graph style
    const el = document.getElementById("width-measure")!;
    const span = el.querySelector("span")!;
    const { lineHeight } = getComputedStyle(span);
    const { borderWidth } = getComputedStyle(el);
    const { paddingLeft, paddingRight } = getComputedStyle(
      el.querySelector(".graph-kv")!
    );
    const { marginRight, maxWidth: maxKeyWidth } = getComputedStyle(
      el.querySelector(".graph-k")!
    );
    console.log("maxKeyWidth", maxKeyWidth);

    const { maxWidth: maxValueWidth } = getComputedStyle(
      el.querySelector(".graph-v")!
    );
    const measured = {
      fontWidth: span.offsetWidth / span.textContent!.length,
      kvHeight: px2num(lineHeight),
      padding: px2num(paddingLeft) + px2num(paddingRight),
      borderWidth: px2num(borderWidth),
      kvGap: px2num(marginRight),
      maxKeyWidth: px2num(maxKeyWidth),
      maxValueWidth: px2num(maxValueWidth),
    };

    setupGlobalGraphStyle(measured);
    window.worker.setupGlobalGraphStyle(measured);
    console.l("finished measuring graph base style:", measured);
  }, []);
};

export default useInitial;
