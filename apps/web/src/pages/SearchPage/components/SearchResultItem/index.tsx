import {
  LanguageDot,
  Metric,
  formatCompactNumber,
  formatNumber,
} from '@repo-radar/ui';
import { AlertCircle, Star01 } from '@untitledui/icons';

import RepoIdentity from '@/components/RepoIdentity';
import TrackButton from '@/components/TrackButton';

import { ItemMain, ItemMeta, ItemRoot } from './styles';
import type { ISearchResultItemProps } from './types';

const ICON_SIZE = 14;

const SearchResultItem: React.FC<ISearchResultItemProps> = ({ repo }) => (
  <ItemRoot>
    <ItemMain>
      <RepoIdentity repo={repo} />
      <ItemMeta>
        {repo.language && <LanguageDot language={repo.language} />}
        <Metric
          icon={<Star01 size={ICON_SIZE} />}
          label="Stars"
          tooltip={formatNumber(repo.stars)}
        >
          {formatCompactNumber(repo.stars)}
        </Metric>
        <Metric
          icon={<AlertCircle size={ICON_SIZE} />}
          label="Open issues"
          tooltip={formatNumber(repo.openIssues)}
        >
          {formatCompactNumber(repo.openIssues)}
        </Metric>
      </ItemMeta>
    </ItemMain>
    <TrackButton repo={repo} />
  </ItemRoot>
);

export default SearchResultItem;
