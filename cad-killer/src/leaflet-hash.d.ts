declare module 'leaflet-hash' {
    import { Map } from 'leaflet';
    export function hash(map: Map): void;
}

declare namespace L {
    interface HashStatic {
        new (map: Map): Hash;
        parseHash(hash: string): { center: LatLng, zoom: number } | false;
        formatHash(map: Map): string;
    }

    interface Hash {
        map: Map | null;
        lastHash: string | null;
        movingMap: boolean;
        changeDefer: number;
        changeTimeout: number | null;
        isListening: boolean;
        hashChangeInterval: number | null;

        parseHash: (hash: string) => { center: LatLng, zoom: number } | false;
        formatHash: (map: Map) => string;
        init: (map: Map) => void;
        removeFrom: (map: Map) => void;
        onMapMove: () => void;
        update: () => void;
        onHashChange: () => void;
        startListening: () => void;
        stopListening: () => void;
    }

    interface Map {
        addHash: () => void;
        removeHash: () => void;
    }

    let hash: HashStatic;
}