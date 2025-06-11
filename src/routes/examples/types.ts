type AaplRow = {
    Date: Date;
    Open: number;
    High: number;
    Low: number;
    Close: number;
    Volume: number;
    [`Adj Close`]: number;
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

type BeagleRow = {
    lon: number;
    lat: number;
};

type RiaaRow = {
    year: Date;
    format: string;
    group: string;
    revenue: number;
};

type MetrosRow = {
    Metro: string;
    POP_1980: number;
    LPOP_1980: number;
    R90_10_1980: number;
    POP_2015: number;
    LPOP_2015: number;
    R90_10_2015: number;
    nyt_display: string;
    state_display: string;
    highlight: number;
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
    beagle: BeagleRow[];
    riaa: RiaaRow[];
    metros: MetrosRow[];
};
