/** Repositories offered by a shared link: `?add=owner/name,owner/name`. */
export const SHARED_REPOS_PARAM = 'add';

/** A link is an invitation, not a bulk import — and each repo costs requests. */
export const MAX_SHARED_REPOS = 20;

const FULL_NAME_PATTERN = /^[\w.-]+\/[\w.-]+$/;

/** A link is untrusted input: anything not shaped like owner/name is dropped. */
export const isRepoFullName = (value: string): boolean =>
  FULL_NAME_PATTERN.test(value);
