/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as beneficiaries from "../beneficiaries.js";
import type * as consumptionData from "../consumptionData.js";
import type * as creditScoring from "../creditScoring.js";
import type * as debug from "../debug.js";
import type * as digitalLending from "../digitalLending.js";
import type * as init from "../init.js";
import type * as initializeData from "../initializeData.js";
import type * as initializeDemo from "../initializeDemo.js";
import type * as roles from "../roles.js";
import type * as sampleData from "../sampleData.js";
import type * as util from "../util.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  beneficiaries: typeof beneficiaries;
  consumptionData: typeof consumptionData;
  creditScoring: typeof creditScoring;
  debug: typeof debug;
  digitalLending: typeof digitalLending;
  init: typeof init;
  initializeData: typeof initializeData;
  initializeDemo: typeof initializeDemo;
  roles: typeof roles;
  sampleData: typeof sampleData;
  util: typeof util;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
