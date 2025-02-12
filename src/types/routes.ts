// types/routes.ts
import { RouteObject } from 'react-router-dom';

export type AppRoute = RouteObject & {
  handle?: {
    seo?: { title: string };
    featureFlags?: string[];
    analytics?: { trackPageView: boolean };
  };
  guards?: Array<(element: JSX.Element) => JSX.Element>;
  metadata?: {
    title: string;
    description: string;
    requiresAnonymous?: boolean;
  };
};

export function defineRoute(config: AppRoute): AppRoute {
  return {
    ...config,
    element: config.element && wrapWithGuards(config.element as JSX.Element, config.guards),
    metadata: config.metadata,
  };
}

function wrapWithGuards(element: JSX.Element, guards?: Array<(e: JSX.Element) => JSX.Element>): JSX.Element {
  if (!guards || guards.length === 0) return element;
  return guards.reduce((acc, guard) => guard(acc), element);
}
