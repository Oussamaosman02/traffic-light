import { component$, useClientEffect$, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import data from "../components/data.json";

export default component$(() => {
  const state = useStore({
    secs: new Date().getSeconds(),
    min: new Date().getMinutes(),
    hour: new Date().getHours(),
    green: false,
    falta: 73,
  });
  useClientEffect$(() => {
    const interval = setInterval(() => {
      state.secs = new Date().getSeconds();
      state.min = new Date().getMinutes();
      state.hour = new Date().getHours();
      const now = new Date().getTime();
      data.forEach((d) => {
        const start = new Date().setMinutes(
          d.timeStart.minutes,
          d.timeStart.seconds
        );
        const end = new Date().setMinutes(d.timeEnd.minutes, d.timeEnd.seconds);
        if (now >= start && now <= end) {
          state.green = d.code === "green";
          state.falta = Math.floor((end - now) / 1000);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  });
  return (
    <div style={{ backgroundColor: state.green ? 'green' : 'red' }} class="container">
      <h1>
        Son las: {state.hour}:{state.min}:{state.secs}
      </h1>
      <h2>
        Faltan:
        {state.falta > 60
          ? ` 1 minuto y ${state.falta - 60} segundos`
          : ` ${state.falta} segundos`}
      </h2>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Semáforo",
  meta: [
    {
      name: "description",
      content: "web de tiempos del semáforo",
    },
  ],
};
