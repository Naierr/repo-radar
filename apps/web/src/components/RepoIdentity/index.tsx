import { VisuallyHidden } from '@repo-radar/ui';

import {
  Description,
  IdentityRoot,
  OwnerAvatar,
  RepoLink,
  RepoName,
} from './styles';
import type { IRepoIdentityProps } from './types';

/** Owner avatar, `owner/name` linking to GitHub, and the description. */
const RepoIdentity: React.FC<IRepoIdentityProps> = ({ repo }) => (
  <IdentityRoot>
    <OwnerAvatar src={repo.owner.avatarUrl} alt="" />
    <div>
      <RepoLink href={repo.htmlUrl} target="_blank" rel="noopener noreferrer">
        {repo.owner.login}/<RepoName>{repo.name}</RepoName>
        <VisuallyHidden> (opens GitHub in a new tab)</VisuallyHidden>
      </RepoLink>
      {repo.description && <Description>{repo.description}</Description>}
    </div>
  </IdentityRoot>
);

export default RepoIdentity;
