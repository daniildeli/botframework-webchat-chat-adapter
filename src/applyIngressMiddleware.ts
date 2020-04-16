import { AdapterEnhancer, IngressMiddlewareAPI, IngressFunction } from './types/AdapterTypes';

import createApplyMiddleware, { Middleware } from './internals/createApplyMiddleware';

type IngressMiddleware<TActivity> = Middleware<TActivity, IngressFunction<TActivity>>;

// This will convert multiple middlewares into a single enhancer.
// Enhancer is another middleware for the constructor of adapter. Essentially HOC for adapter.
// We can chain multiple enhancer together, and plug-in multiple features to a single adapter.
// In the future, if we decided to change Adapter, middleware written by user can still be reused. We won't introduce breaking changes.
export default function applyIngressMiddleware<TActivity>(
  ...middlewares: IngressMiddleware<TActivity>[]
): AdapterEnhancer<TActivity> {
  return createApplyMiddleware<TActivity, IngressMiddlewareAPI<TActivity>, IngressFunction<TActivity>>(
    api => api.ingress,
    fn => ({ ingress: fn })
  )(...middlewares);
}

export type { IngressMiddleware };
