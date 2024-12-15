import "@/styles/globals.css";
import "@fontsource/inter";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "leaflet/dist/leaflet.css";
import { AppProviders } from "@/modules";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type { AppProps } from "next/app";

ChartJS.register(
  ArcElement,
  Tooltip,
  LinearScale,
  Title,
  ChartDataLabels,
  CategoryScale,
  BarElement,
  Legend
);
export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
      <Component {...pageProps} />
    </AppProviders>
  );
}
