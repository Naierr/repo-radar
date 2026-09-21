import {
  EmptyState,
  ErrorNotice,
  Pagination,
  Panel,
  Skeleton,
  VisuallyHidden,
  formatNumber,
  useNow,
} from '@repo-radar/ui';
import { SearchLg, Telescope } from '@untitledui/icons';

import { REQUEST_STATUS } from '@/types/request';
import { describeError, isRetryable } from '@/utils/describeError';

import SearchResultItem from '../SearchResultItem';
import SearchTips from '../SearchTips';
import {
  PaginationBar,
  ResultList,
  SkeletonLines,
  SkeletonRow,
  SkeletonRows,
  TopProgress,
} from './styles';
import type { ISearchResultsProps } from './types';

const EMPTY_ICON_SIZE = 22;
const SKELETON_ROW_COUNT = 5;
const CLOCK_TICK_MS = 30_000;

const SearchResults: React.FC<ISearchResultsProps> = ({
  query,
  results,
  totalCount,
  status,
  error,
  page,
  pageCount,
  goToPage,
  retry,
  onPickExample,
}) => {
  const now = useNow(CLOCK_TICK_MS);
  const isLoading = status === REQUEST_STATUS.LOADING;

  if (!query) {
    return (
      <Panel>
        <EmptyState
          icon={<Telescope size={EMPTY_ICON_SIZE} />}
          title="Scan GitHub for repositories"
          description={<SearchTips onPick={onPickExample} />}
        />
      </Panel>
    );
  }

  if (status === REQUEST_STATUS.FAILED && error) {
    return (
      <ErrorNotice
        message={describeError(error, now)}
        onRetry={isRetryable(error) ? retry : undefined}
      />
    );
  }

  if (status === REQUEST_STATUS.SUCCEEDED && results.length === 0) {
    return (
      <Panel>
        <EmptyState
          icon={<SearchLg size={EMPTY_ICON_SIZE} />}
          title={`No repositories match “${query}”`}
          description={
            <>
              Check the spelling, or try fewer or broader words.
              <SearchTips onPick={onPickExample} />
            </>
          }
        />
      </Panel>
    );
  }

  return (
    <Panel
      title={
        // While a fresh query loads there is no count yet, and the previous
        // one belonged to a different search.
        totalCount > 0 ? (
          <span role="status">
            {formatNumber(totalCount)}{' '}
            {totalCount === 1 ? 'repository' : 'repositories'} for “{query}”
          </span>
        ) : undefined
      }
      disablePadding
    >
      {isLoading && <TopProgress aria-label="Loading results" />}
      {isLoading ? (
        <>
          <VisuallyHidden role="status">Searching…</VisuallyHidden>
          <SkeletonRows aria-hidden>
            {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
              <SkeletonRow key={index}>
                <Skeleton variant="circular" width={32} height={32} />
                <SkeletonLines>
                  <Skeleton width="40%" />
                  <Skeleton width="80%" />
                </SkeletonLines>
              </SkeletonRow>
            ))}
          </SkeletonRows>
        </>
      ) : (
        <ResultList>
          {results.map((repo) => (
            <SearchResultItem key={repo.id} repo={repo} />
          ))}
        </ResultList>
      )}
      {pageCount > 1 && (
        <PaginationBar>
          <Pagination
            count={pageCount}
            page={page}
            disabled={isLoading}
            shape="rounded"
            onChange={(_event, nextPage) => {
              goToPage(nextPage);
            }}
          />
        </PaginationBar>
      )}
    </Panel>
  );
};

export default SearchResults;
