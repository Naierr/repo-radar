import { getLanguageColor } from '../../utils/languageColors';
import { Dot, LanguageRoot } from './styles';
import type { ILanguageDotProps } from './types';

/** A repository's primary language, in the colour GitHub gives it. */
const LanguageDot: React.FC<ILanguageDotProps> = ({ language }) => (
  <LanguageRoot>
    <Dot dotColor={getLanguageColor(language)} aria-hidden />
    {language}
  </LanguageRoot>
);

export default LanguageDot;
