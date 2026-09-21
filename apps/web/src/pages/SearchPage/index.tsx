import { GradientText, SearchField } from '@repo-radar/ui';
import { Stars02 } from '@untitledui/icons';

import { REQUEST_STATUS } from '@/types/request';

import SearchResults from './components/SearchResults';
import { useRepoSearch } from './hooks/useRepoSearch';
import {
  Eyebrow,
  Hero,
  HeroLead,
  HeroTitle,
  PageStack,
  SearchBox,
} from './styles';

const EYEBROW_ICON_SIZE = 14;

const SearchPage: React.FC = () => {
  const search = useRepoSearch();

  return (
    <PageStack>
      <title>Search · Repo Radar</title>
      <Hero>
        <Eyebrow>
          <Stars02 size={EYEBROW_ICON_SIZE} aria-hidden />
          Your radar for GitHub
        </Eyebrow>
        <HeroTitle>
          Find repositories <GradientText>worth watching</GradientText>
        </HeroTitle>
        <HeroLead>
          Search GitHub, track the projects that matter, and keep an eye on
          their stars, issues and latest commits.
        </HeroLead>
        <SearchBox>
          <SearchField
            size="lg"
            label="Search GitHub repositories"
            placeholder="Search repositories — try “state management”"
            value={search.input}
            onChange={search.setInput}
            loading={search.status === REQUEST_STATUS.LOADING}
            shortcutKey="/"
          />
        </SearchBox>
      </Hero>
      <SearchResults
        query={search.query}
        results={search.results}
        totalCount={search.totalCount}
        status={search.status}
        error={search.error}
        page={search.page}
        pageCount={search.pageCount}
        goToPage={search.goToPage}
        retry={search.retry}
        onPickExample={search.setInput}
      />
    </PageStack>
  );
};

export default SearchPage;
