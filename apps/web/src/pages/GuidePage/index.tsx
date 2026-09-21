import { Link, Panel } from '@repo-radar/ui';

import { PageLead, PageStack, PageTitle, Prose } from './styles';

/** A static page: everything the app does that is not obvious from looking. */
const GuidePage: React.FC = () => (
  <PageStack>
    <title>Guide · Repo Radar</title>
    <div>
      <PageTitle>How to get the most out of Repo Radar</PageTitle>
      <PageLead>
        Repo Radar watches GitHub repositories for you. Everything lives in this
        browser — there is no account, and nothing is uploaded.
      </PageLead>
    </div>

    <Panel title="Finding repositories">
      <Prose>
        <p>
          GitHub searches a repository&rsquo;s{' '}
          <strong>name, description and topics</strong>. It does{' '}
          <strong>not</strong> search the owner&rsquo;s username — so searching{' '}
          <code>mattpocock</code> returns other people&rsquo;s repositories that
          happen to be named after him, and not his own.
        </p>
        <p>To search precisely, use GitHub&rsquo;s qualifiers:</p>
        <ul>
          <li>
            <code>user:mattpocock</code> — everything owned by that account.
          </li>
          <li>
            <code>org:vercel</code> — everything owned by an organisation.
          </li>
          <li>
            <code>language:rust</code> — written mainly in one language.
          </li>
          <li>
            <code>stars:&gt;1000</code> — popular ones only.
          </li>
          <li>
            <code>topic:state-management</code> — tagged with a topic.
          </li>
          <li>
            <code>pushed:&gt;2026-01-01</code> — active recently.
          </li>
        </ul>
        <p>
          They combine:{' '}
          <code>user:vercel language:typescript stars:&gt;500</code>. The full
          list is in{' '}
          <Link
            href="https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub&rsquo;s search documentation
          </Link>
          .
        </p>
        <p>
          Searching waits until you stop typing, and a new search cancels the
          one before it — so the answer you see always belongs to the words
          currently in the box.
        </p>
      </Prose>
    </Panel>

    <Panel title="Tracking and trends">
      <Prose>
        <p>
          <strong>Track</strong> adds a repository to your radar. The dashboard
          shows its stars, open issues and last commit — and GitHub counts open
          pull requests as issues, which is why that number is often higher than
          the issue tab suggests.
        </p>
        <p>
          The arrow beside the stars is the change{' '}
          <strong>since you started watching</strong>, not since yesterday.
          GitHub does not publish historical star counts, so the only record
          that exists is the one this app starts keeping the moment you track
          something. Refresh occasionally and the trend fills in.
        </p>
        <p>
          <strong>Reset trend</strong> throws that record away and starts
          measuring from today. There is no way to get the old readings back, so
          it asks first.
        </p>
      </Prose>
    </Panel>

    <Panel title="Refreshing, and why it is rationed">
      <Prose>
        <p>
          Without signing in, GitHub allows <strong>60 requests an hour</strong>{' '}
          per address. Each repository costs two — one for the repository, one
          for its latest commit — so refreshing twenty repositories spends forty
          of them at once.
        </p>
        <p>
          The app spends carefully on your behalf: opening the dashboard
          refreshes only what has gone stale, a refresh already in flight is
          never asked for twice, and <strong>Refresh all</strong> tells you what
          it will cost before you press it. If the budget cannot cover it, the
          button turns off and says what is left rather than failing halfway.
        </p>
        <p>
          When it runs out, nothing is broken — the numbers you already have
          stay on screen with their age beside them, and the budget refills
          within the hour.
        </p>
      </Prose>
    </Panel>

    <Panel title="Sharing your radar">
      <Prose>
        <p>
          <strong>Share radar</strong> copies a link containing the names of the
          repositories you track. Whoever opens it is shown the list and asked
          whether to add them — the link proposes, it never changes
          anyone&rsquo;s radar on its own.
        </p>
        <p>
          The link carries repository names and nothing else. None of your data
          leaves your browser.
        </p>
      </Prose>
    </Panel>

    <Panel title="Appearance and keyboard">
      <Prose>
        <ul>
          <li>
            <code>/</code> jumps to the search box from anywhere on the page.
          </li>
          <li>
            The theme menu offers light, dark, or following your system. The
            choice is remembered and applied before the page first paints, so
            there is no flash of the wrong one.
          </li>
          <li>
            If your system asks for reduced motion, the starfield and every
            other animation stop.
          </li>
        </ul>
      </Prose>
    </Panel>
  </PageStack>
);

export default GuidePage;
