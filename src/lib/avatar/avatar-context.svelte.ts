import { createContext } from 'svelte';

export type AvatarImageStatus = 'idle' | 'loading' | 'loaded' | 'error';

export class AvatarState {
  status = $state<AvatarImageStatus>('idle');
}

export const [getAvatarContext, setAvatarContext] = createContext<AvatarState>();
