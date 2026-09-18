export interface IRepoOwner {
  login: string;
  avatarUrl: string;
}

/** What identifies a repository and never needs a refresh to be useful. */
export interface IRepoIdentity {
  /** GitHub's numeric id — stable across renames and transfers. */
  id: number;
  fullName: string;
  name: string;
  owner: IRepoOwner;
  description: string | null;
  htmlUrl: string;
  language: string | null;
}

export interface IRepoStats {
  stars: number;
  /** GitHub counts open pull requests as open issues. */
  openIssues: number;
  /** Latest commit on the default branch; null for an empty repository. */
  lastCommitAt: string | null;
}

/** A search hit — identity plus the stats the search API already returns. */
export interface IRepoSummary extends IRepoIdentity {
  stars: number;
  openIssues: number;
}

/** A repository the user watches, as persisted between visits. */
export interface ITrackedRepo extends IRepoIdentity {
  trackedAt: string;
  stats: IRepoStats;
  /** When the stats last came fresh from GitHub; null until the first refresh. */
  refreshedAt: string | null;
}

export interface IRepoSnapshot {
  identity: IRepoIdentity;
  stats: IRepoStats;
}

export interface ISearchPage {
  totalCount: number;
  items: IRepoSummary[];
}
