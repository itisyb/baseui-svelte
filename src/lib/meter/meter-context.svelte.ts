import { createContext } from 'svelte';
export class MeterState { value = $state(0); min = $state(0); max = $state(100); labelId = $state(''); get percentage() { return this.max === this.min ? 0 : Math.max(0, Math.min(100, ((this.value - this.min) / (this.max - this.min)) * 100)); } }
export const [getMeterContext, setMeterContext] = createContext<MeterState>();
