import { component$, createContextId, Resource, useResource$, useStyles$, useSignal, useContextProvider, useStore } from "@builder.io/qwik";
import styles from "./index.scss?inline";

export interface SearchBoxProps { }

export type LocationData = {
    country: string;
    id: number;
    lat: number;
    lon: number;
    name: string;
    region: string;
    url: string;
};

export const LocationDataContext = createContextId<LocationData[]>('locationData');

export const getLocationData = async (search: string, controller?: AbortController) => {
    const url = `https://weatherapi-com.p.rapidapi.com/search.json?q=${search}`;

    const response = await fetch(url, {
        signal: controller?.signal,
        headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY as string,
            'X-RapidAPI-Host': process.env.RAPID_API_HOST as string
        },
    });
    const data = await response.json();

    return data;
};



export const SearchBox = component$(() => {
    useStyles$(styles);
    const searchTerm = useSignal<string>('');

    const locationData = useStore<Record<string, LocationData[]>>({
        value: [],
    })


    const weatherResource = useResource$<LocationData[]>(({ cleanup, track }) => {
        // track the `searchTerm` signal so that when it changes we re-run this function.
        track(() => searchTerm.value);

        // Create an abort controller so that we can cancel the fetch if the signal changes.
        const controller = new AbortController();
        cleanup(() => controller.abort());
        console.log('searchTerm.value', searchTerm.value);


        // Fetch the data and return the promises.
        return getLocationData(searchTerm.value, controller);
    });

    useContextProvider(LocationDataContext, locationData.value);

    return (
        <>
            <div class="search-page">
                <h1>Search for your location to get weather updates</h1>

                <div class="input-container">
                    <input type="text" value={searchTerm.value} onInput$={(e: Event) => (searchTerm.value = (e.target as HTMLInputElement).value)} />
                </div>
                <Resource
                    value={weatherResource}
                    onPending={() => <div>Loading...</div>}
                    onRejected={() => <div>Failed to load weather</div>}
                    onResolved={(locations) => {
                        console.log('weather', locations);
                        if (locations.length === 0) {
                            return <h2>No data</h2>
                        }

                        locationData.value = locations;

                        return <div class="results-container">

                            <div class="dropdown">
                                {locations.map && locations.map((item) => <p class="dropdown-select">{item.name}, {item.country}</p>)}
                                {/* <p class="dropdown-select">item</p> */}
                            </div>
                        </div>;
                    }}
                />
            </div>
        </>
    );
});

