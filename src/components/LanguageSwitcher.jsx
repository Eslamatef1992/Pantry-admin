import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n/i18n';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  return (
    <div className="lang-switch">
      <button className={i18n.language === 'en' ? 'active' : ''} onClick={() => changeLanguage('en')}>
        EN
      </button>
      <button className={i18n.language === 'ar' ? 'active' : ''} onClick={() => changeLanguage('ar')}>
        AR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
