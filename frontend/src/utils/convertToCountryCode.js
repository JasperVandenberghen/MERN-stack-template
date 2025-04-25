import { getCountryCode } from 'countries-list';

const convertToCountryCode = (countryName) => {
  switch (countryName) {
    case 'England':
      return 'GB-ENG';
    case 'Scotland':
      return 'GB-SCT';
    case 'Wales':
      return 'GB-WLS';
    default:
      return getCountryCode(countryName);
  }
};

export default convertToCountryCode;
