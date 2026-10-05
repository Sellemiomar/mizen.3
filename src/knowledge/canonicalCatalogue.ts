/**
 * Mizen - Canonical Financing Knowledge Catalogue (Live Projection Layer)
 * 
 * PROJECTION LAYER ONLY: This file does NOT contain independently editable financing facts.
 * All products, providers, limits, rates, and criteria are dynamically projected
 * from authoritative claims in the FinancingClaimsRepository via KnowledgeRegistry.
 */

import { 
  FinancingProvider, 
  FinancingProduct, 
  CatalogueMetadata 
} from '../types/knowledge';
import { KNOWLEDGE_REGISTRY } from './knowledgeRegistry';

/**
 * Live projection of canonical providers derived directly from authoritative claims.
 */
export const CANONICAL_PROVIDERS: FinancingProvider[] = new Proxy([] as FinancingProvider[], {
  get(_target, prop) {
    const liveProviders = KNOWLEDGE_REGISTRY.getProviders();
    if (prop === 'length') return liveProviders.length;
    if (prop === Symbol.iterator) return liveProviders[Symbol.iterator].bind(liveProviders);
    if (typeof prop === 'string' && !isNaN(Number(prop))) {
      return liveProviders[Number(prop)];
    }
    const val = (liveProviders as any)[prop];
    return typeof val === 'function' ? val.bind(liveProviders) : val;
  }
});

/**
 * Live projection of canonical products derived directly from authoritative claims.
 * Stale facts cannot survive here because all values are computed live from active claims.
 */
export const CANONICAL_PRODUCTS: FinancingProduct[] = new Proxy([] as FinancingProduct[], {
  get(_target, prop) {
    const liveProducts = KNOWLEDGE_REGISTRY.getProducts();
    if (prop === 'length') return liveProducts.length;
    if (prop === Symbol.iterator) return liveProducts[Symbol.iterator].bind(liveProducts);
    if (typeof prop === 'string' && !isNaN(Number(prop))) {
      return liveProducts[Number(prop)];
    }
    const val = (liveProducts as any)[prop];
    return typeof val === 'function' ? val.bind(liveProducts) : val;
  }
});

/**
 * Live metadata describing catalogue size and freshness.
 */
export const CANONICAL_METADATA: CatalogueMetadata = new Proxy({} as CatalogueMetadata, {
  get(_target, prop) {
    const liveMeta = KNOWLEDGE_REGISTRY.getCatalogueMetadata();
    return (liveMeta as any)[prop];
  }
});
