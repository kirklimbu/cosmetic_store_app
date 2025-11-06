import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server-sfadsaf';

// const bootstrap = () => bootstrapApplication(App, config);

export default function render(req: Request) {
  return bootstrapApplication(App, config);
}
