/**
 * Type declarations for @metascraper/helpers
 * 
 * This file provides TypeScript support for the metascraper helpers module
 */

export function toRule(
  ruleFn: ($ : any) => any | undefined | null
): ($ : any) => any | undefined | null;

export function $filter($ : any, element: any): string | undefined | null;

export function $jsonld(path: string): ($ : any) => any | undefined | null;

export function title(str: string): string;

export function $html(selector: string): ($ : any) => string | undefined | null;

export function $text(selector: string): ($ : any) => string | undefined | null;

export function html2text(html: string): string;

export function normalize(str: string): string;

export function isValidUrl(url: string): boolean;
