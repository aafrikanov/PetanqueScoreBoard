import { useEffect } from "react";
import { useTimer } from "../context/TimerContext";
import "./TimerWidgetPage.css";

const WIDGET_EMBED_CLASS = "widget-embed";
const TIMER_POLL_INTERVAL_MS = 1000;

export function TimerWidgetPage() {
  const { timer, refreshTimer } = useTimer();

  useEffect(() => {
    document.documentElement.classList.add(WIDGET_EMBED_CLASS);
    document.body.classList.add(WIDGET_EMBED_CLASS);
    return () => {
      document.documentElement.classList.remove(WIDGET_EMBED_CLASS);
      document.body.classList.remove(WIDGET_EMBED_CLASS);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(refreshTimer, TIMER_POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refreshTimer]);

  const seconds = Math.max(0, Math.floor(timer.secondsLeft));
  const isZero = seconds === 0;
  const isBlink = seconds > 0 && seconds <= 5;

  return (
    <div className="timer-widget">
      <div
        className={`timer-widget-value ${isZero ? "timer-widget-value--zero" : ""} ${isBlink ? "timer-widget-value--blink" : ""}`}
        aria-live="polite"
        aria-label={`Осталось ${seconds} секунд`}
      >
        {seconds}
      </div>
    </div>
  );
}
