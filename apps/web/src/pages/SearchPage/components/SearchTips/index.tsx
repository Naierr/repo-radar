import { Link } from '@repo-radar/ui';
import { Link as RouterLink } from 'react-router';

import { ROUTES } from '@/constants/routes';

import { TipButton, TipsRoot } from './styles';
import type { ISearchTipsProps } from './types';

/**
 * GitHub searches a repository's name, description and topics — never its
 * owner's login. Searching "mattpocock" therefore returns other people's
 * forks named after him and not his own `skills`, which is surprising enough
 * to be worth saying before it happens rather than after.
 */
const EXAMPLES = [
  'user:mattpocock',
  'language:rust stars:>1000',
  'topic:state-management',
];

const SearchTips: React.FC<ISearchTipsProps> = ({ onPick }) => (
  <TipsRoot>
    <span>Searches names, descriptions and topics — not owners. Try</span>
    {EXAMPLES.map((example) => (
      <TipButton
        key={example}
        type="button"
        onClick={() => {
          onPick(example);
        }}
      >
        {example}
      </TipButton>
    ))}
    <Link component={RouterLink} to={ROUTES.GUIDE}>
      More in the guide
    </Link>
  </TipsRoot>
);

export default SearchTips;
