import countries from 'i18n-iso-countries';

import enLocale from 'i18n-iso-countries/langs/en.json';
import esLocale from 'i18n-iso-countries/langs/es.json';

import { type AppLanguage } from './translations';

countries.registerLocale(enLocale);
countries.registerLocale(esLocale);

export type CountryOption = {
  code: string;
  flag: string;
  name: string;
};

export const getCountryFlag = (
  countryCode: string
) => {
  const normalizedCode =
    countryCode.trim().toUpperCase();

  if (!/^[A-Z]{2}$/.test(normalizedCode)) {
    return '🌍';
  }

  return normalizedCode
    .split('')
    .map((character) =>
      String.fromCodePoint(
        127397 + character.charCodeAt(0)
      )
    )
    .join('');
};

export const getCountryOptions = (
  language: AppLanguage
): CountryOption[] => {
  const countryNames = countries.getNames(
    language,
    {
      select: 'official',
    }
  );

  return Object.entries(countryNames)
    .map(([code, name]) => ({
      code,
      flag: getCountryFlag(code),
      name,
    }))
    .sort((firstCountry, secondCountry) =>
      firstCountry.name.localeCompare(
        secondCountry.name,
        language,
        {
          sensitivity: 'base',
        }
      )
    );
};

export const getCountryName = (
  countryCode: string,
  language: AppLanguage
) => {
  if (!countryCode.trim()) {
    return '';
  }

  return (
    countries.getName(
      countryCode.toUpperCase(),
      language,
      {
        select: 'official',
      }
    ) || ''
  );
};