type AaplRow = {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    adj_close: number;
};

type SimpsonsRow = {
    episode: string;
    season: string;
    /**
     * the imdb rating of the episode
     */
    imdb_rating: number;
    title: string;
};

type PenguinsRow = {
    species: string;
    island: string;
    bill_length_mm: number;
    bill_depth_mm: number;
    flipper_length_mm: number;
    body_mass_g: number;
};

type LanguagesRow = {
    Language: string;
    Remarks: string;
    Family: string;
    Branch: string;
    [`First-language`]: string;
    [`Second-language`]: string;
    [`Total speakers`]: number;
};

type EarthquakeFeature = {
    type: 'Feature';
    properties: {
        mag: number;
        place: string;
        time: number;
        updated: number;
        url: string;
        detail: string;
        status: 'reviewed';
        tsunami: number;
        sig: number;
        net: string;
        code: string;
        ids: string;
        sources: string;
        types: string;
        nst: number;
        dmin: number;
        rms: number;
        gap: number;
        magType: string;
        type: 'earthquake';
        title: string;
    };
    geometry: {
        type: 'Point';
        coordinates: [number, number, number];
    };
    id: string;
};

export type ExamplesData = {
    aapl: AaplRow[];
    simpsons: SimpsonsRow[];
    penguins: PenguinsRow[];
    languages: LanguagesRow[];
    earthquakes: {
        type: 'FeatureCollection';
        features: EarthquakeFeature[];
    };
    world: any;
};
