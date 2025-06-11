
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { LocationProvider } from "./contexts/LocationContext";
import CurrentWeatherPage from "./pages/CurrentWeather";
import HourlyWeatherPage from "./pages/HourlyWeather";
import DailyWeatherPage from "./pages/DailyWeather";
import FavoritesWeatherPage from "./pages/FavoritesWeather";
import PrecipitationMap from "./pages/PrecipitationMap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LocationProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Switch>
            <Route path="/" component={CurrentWeatherPage} />
            <Route path="/hourly" component={HourlyWeatherPage} />
            <Route path="/daily" component={DailyWeatherPage} />
            <Route path="/favorites" component={FavoritesWeatherPage} />
            <Route path="/precipitation-map" component={PrecipitationMap} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </LocationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
