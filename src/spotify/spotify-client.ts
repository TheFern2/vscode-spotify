import {OsAgnosticSpotifyClient} from './os-agnostic-spotify-client';
import {OsxSpotifyClient} from './osx-spotify-client';
import {OsxHttpSpotifyClient} from './osx-http-spotify-client';
import {ISpotifyStatusStatePartial} from '../state/state';
import {getUseCombinedApproachOnMacOS} from '../config/spotify-config';
import * as os from 'os';

export class SpoifyClientSingleton {
    private static spotifyClient: SpotifyClient;
    public static getSpotifyClient() {
        if (this.spotifyClient) {
            return this.spotifyClient;
        }
        this.spotifyClient = (os.platform() === 'darwin') ?
            (getUseCombinedApproachOnMacOS() ? new OsxHttpSpotifyClient() : new OsxSpotifyClient()) :
            new OsAgnosticSpotifyClient();
        return this.spotifyClient;
    }
}

export function createCancelablePromise<T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
    let cancel: () => void = null as any;
    const promise = new Promise<T>((resolve, reject) => {
        cancel = () => {
            reject('canceled');
        }
        executor(resolve, reject);
    })
    return { promise, cancel }
}

export interface SpotifyClient {
    next(): void;
    previous(): void;
    play(): void;
    pause(): void;
    playPause(): void;
    muteVolume(): void;
    unmuteVolume(): void;
    muteUnmuteVolume(): void;
    volumeUp(): void;
    volumeDown(): void;
    toggleRepeating(): void;
    toggleShuffling(): void;
    pollStatus(cb: (status: ISpotifyStatusStatePartial) => void, getInterval: () => number): { promise: Promise<void>, cancel: () => void };
}
