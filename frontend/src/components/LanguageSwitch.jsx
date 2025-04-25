import { MenuItem, Select } from '@mui/material';
import { ReactCountryFlag } from 'react-country-flag';
import { useTranslation } from 'react-i18next';

const LanguageSwitch = () => {
  const { i18n } = useTranslation();
  const langs = ['gb', 'fr', 'nl'];

  const handleChange = async (event) =>
    await i18n.changeLanguage(event.target.value);

  return (
    <Select
      value={i18n.language ?? 'gb'}
      onChange={handleChange}
      sx={{
        width: '25%',
        boxShadow: 'none',
        '.MuiOutlinedInput-notchedOutline': { border: 0 },
        '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
          border: 0,
        },
        '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
          {
            border: 0,
          },
      }}
    >
      {langs.map((lang) => (
        <MenuItem
          key={lang}
          value={lang}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ReactCountryFlag
            countryCode={lang}
            svg
            className="flag"
            style={{
              width: '2rem',
              height: '2rem',
            }}
          />
        </MenuItem>
      ))}
    </Select>
  );
};

export default LanguageSwitch;
