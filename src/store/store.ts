import { createStore, Store } from 'redux';
import { ISpotifyStatusState, defaultState } from '../state/state';
import rootReducer from '../reducers/root-reducer';

export type SpotifyStore = Store<ISpotifyStatusState>;

let store: SpotifyStore;

export function getStore() {
    if (!store) {
        store = createStore(rootReducer, defaultState);
    }
    return store;
}

export function getState() {
    return getStore().getState();
}

/**
 * True if on last state of Spotify it was muted(volume was equal 0)
 */
export function isMuted() {
    const state = getState();
    return state && state.playerState.volume === 0;
}