declare module '@metascraper/helpers' {
  export function toRule(
    mapper: (value: any, opts?: any) => any,
    opts?: any
  ): (ruleFn: ($ : any) => any | undefined | null) => any;

  export function $filter($ : any, element: any): string | undefined | null;

  export function $jsonld(path: string): ($ : any) => any | undefined | null;

  export function title(str: string): string;

  export function image(str: string): string | undefined;

  export function description(str: string): string;

  export function $html(selector: string): ($ : any) => string | undefined | null;

  export function $text(selector: string): ($ : any) => string | undefined | null;

  export function html2text(html: string): string;

  export function normalize(str: string): string;

  export function isValidUrl(url: string): boolean;
}

