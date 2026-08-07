import { createContext } from 'svelte';

export class ScrollAreaState {
  viewport = $state<HTMLDivElement | null>(null);
  content = $state<HTMLDivElement | null>(null);
  scrollLeft = $state(0);
  scrollTop = $state(0);
  clientWidth = $state(0);
  clientHeight = $state(0);
  scrollWidth = $state(0);
  scrollHeight = $state(0);
  scrolling = $state(false);

  update(): void {
    const viewport = this.viewport;
    if (!viewport) return;
    this.scrollLeft = viewport.scrollLeft;
    this.scrollTop = viewport.scrollTop;
    this.clientWidth = viewport.clientWidth;
    this.clientHeight = viewport.clientHeight;
    this.scrollWidth = viewport.scrollWidth;
    this.scrollHeight = viewport.scrollHeight;
  }

  get overflowX() { return this.scrollWidth > this.clientWidth; }
  get overflowY() { return this.scrollHeight > this.clientHeight; }
}

export const [getScrollAreaContext, setScrollAreaContext] = createContext<ScrollAreaState>();
