import {
  BrandMark,
  ColorModeMenu,
  CounterLabel,
  LinearProgress,
  Link,
  Starfield,
} from '@repo-radar/ui';
import { Eye, SearchLg } from '@untitledui/icons';
import { Suspense } from 'react';
import { Outlet } from 'react-router';

import RateLimitIndicator from '@/components/RateLimitIndicator';
import { ROUTES } from '@/constants/routes';
import { useAppSelector } from '@/hooks/useReduxHooks';
import { selectTrackedRepoCount } from '@/store/trackedRepos';

import {
  Brand,
  Footer,
  Header,
  HeaderActions,
  HeaderInner,
  Main,
  Nav,
  NavItem,
  SkipLink,
} from './styles';

const NAV_ICON_SIZE = 16;
const MAIN_ID = 'main';

/** The frame every page renders in — it never unmounts between routes. */
const AppLayout: React.FC = () => {
  const trackedCount = useAppSelector(selectTrackedRepoCount);

  return (
    <>
      <Starfield />
      <SkipLink href={`#${MAIN_ID}`}>Skip to content</SkipLink>
      <Header>
        <HeaderInner>
          <Brand to={ROUTES.SEARCH}>
            <BrandMark size="md" />
            Repo Radar
          </Brand>
          <Nav aria-label="Main">
            <NavItem to={ROUTES.SEARCH} end>
              <SearchLg size={NAV_ICON_SIZE} aria-hidden />
              Search
            </NavItem>
            <NavItem to={ROUTES.TRACKED}>
              <Eye size={NAV_ICON_SIZE} aria-hidden />
              Tracked
              <CounterLabel count={trackedCount} />
            </NavItem>
          </Nav>
          <HeaderActions>
            <RateLimitIndicator />
            <ColorModeMenu />
          </HeaderActions>
        </HeaderInner>
      </Header>
      <Main id={MAIN_ID} tabIndex={-1}>
        {/* A lazy page loads inside the frame, so the header never blanks. */}
        <Suspense fallback={<LinearProgress aria-label="Loading page" />}>
          <Outlet />
        </Suspense>
      </Main>
      <Footer>
        Data from the{' '}
        <Link
          href="https://docs.github.com/en/rest"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub REST API
        </Link>
        . Tracked repositories stay in this browser.
      </Footer>
    </>
  );
};

export default AppLayout;
