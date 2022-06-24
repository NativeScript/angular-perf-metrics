import { InjectionToken } from "@angular/core";


export const BENCHMARK_MODE = new InjectionToken<'fast' | 'normal' | 'no-ui'>("BENCHMARK_MODE");

export const ROUTE_PROVIDER = new InjectionToken<string>('routeProvider');