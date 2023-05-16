import { writable } from 'svelte/store';
import { type Theme } from '../model/MyLinks-interface';

const defaultTheme: Theme = {
  faviconColor: 'blue',
};

export interface AppConfig {
  theme: Theme;
  faviconService?: string;
  hideShortcuts: boolean;
}

const defaultAppConfig: AppConfig = {
  theme: defaultTheme,
  hideShortcuts: false
};

// deep copy the configuration
export const appConfigClone = (): AppConfig => JSON.parse(JSON.stringify(defaultAppConfig)) as AppConfig;

export interface ApplicationStore {
  config: AppConfig;
}

const defaultValue: ApplicationStore = { config: defaultAppConfig };

export const applicationStore = writable(defaultValue);
