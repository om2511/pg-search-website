// src/utils/LazyComponents.js
import { lazy } from 'react';

export const LazyListings = lazy(() => import('../pages/Listings'));
export const LazyPGDetails = lazy(() => import('../pages/PGDetails'));
export const LazyAddPG = lazy(() => import('../pages/AddPG'));