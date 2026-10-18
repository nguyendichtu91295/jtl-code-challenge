import { atom } from "jotai";
import { createStore } from "jotai/vanilla";
import type { PersistenceStatus } from "./fakeApi";

export const persistenceStatusAtom = atom<PersistenceStatus>("available");
export const appStateStore = createStore();
