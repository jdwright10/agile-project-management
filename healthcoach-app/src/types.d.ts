// Type declarations for modules without types
declare module 'react-native-vector-icons/MaterialCommunityIcons';
declare module 'vision-camera-code-scanner';

// Add missing RelativeTimeFormat to Intl
interface RelativeTimeFormatOptions {
  localeMatcher?: 'lookup' | 'best fit';
  numeric?: 'always' | 'auto';
  style?: 'long' | 'short' | 'narrow';
}

interface RelativeTimeFormat {
  format(value: number, unit: string): string;
  formatToParts(value: number, unit: string): any[];
  resolvedOptions(): Intl.ResolvedRelativeTimeFormatOptions;
}

interface ResolvedRelativeTimeFormatOptions {
  locale: string;
  numeric: 'always' | 'auto';
  style: 'long' | 'short' | 'narrow';
}

declare namespace Intl {
  class RelativeTimeFormat {
    constructor(locales?: string | string[], options?: RelativeTimeFormatOptions);
    format(value: number, unit: Intl.RelativeTimeUnit): string;
    formatToParts(value: number, unit: Intl.RelativeTimeUnit): Array<{
      type: string;
      value: string;
    }>;
    resolvedOptions(): ResolvedRelativeTimeFormatOptions;
  }

  type RelativeTimeUnit =
    | 'year'
    | 'years'
    | 'quarter'
    | 'quarters'
    | 'month'
    | 'months'
    | 'week'
    | 'weeks'
    | 'day'
    | 'days'
    | 'hour'
    | 'hours'
    | 'minute'
    | 'minutes'
    | 'second'
    | 'seconds';
}

// Augment String prototype for padStart
interface String {
  padStart(targetLength: number, padString?: string): string;
} 