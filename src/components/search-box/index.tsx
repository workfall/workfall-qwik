import { component$, createContextId, Resource, useResource$, useStyles$, useSignal } from "@builder.io/qwik";
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

export const LocationDataContext = createContextId<LocationData>('locationData');

export const getLocationData = async (search: string, controller?: AbortController) => {
    const url = `https://weatherapi-com.p.rapidapi.com/search.json?q=${search}`;
    
    const response = await fetch(url, {
        signal: controller?.signal, 
        headers: {
            'X-RapidAPI-Key': 'b4f553c90bmsh592dd8c5885875bp1302a8jsn581b3431b255',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        },
    });
    const data = await response.json();
    
    return data;
};



export const SearchBox = component$(() => {
    useStyles$(styles);
    const searchTerm = useSignal<string>('');


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

    // const weatherStore = useStore<WeatherData>({
    //     name: 'weatherStore',
    // });

    // useContextProvider(WeatherDataContext, weatherStore);

    return (
        <>
            <h1>Search for your location</h1>

            <div>
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

                    return <div class="search-container">

                        <div class="dropdown">
                            {locations.map && locations.map((item) => <p class="dropdown-select">{item.name}, {item.country}</p>)}
                            {/* <p class="dropdown-select">item</p> */}
                        </div>
                    </div>;
                }}
            />
        </>
    );
});