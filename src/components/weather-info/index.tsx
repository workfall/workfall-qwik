import { component$ } from '@builder.io/qwik';

export interface WeatherInfoProps {
    name: string;
    country: string;
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
}

export const WeatherInfo = component$((props: WeatherInfoProps) => {

  return (
    <>
      <div>
        <h1>Weather Info</h1>
        <p>City: {props.name}</p>
        <p>Country: {props.country}</p>
        <p>Temperature: {props.temp}</p>
        <p>Min Temperature: {props.temp_min}</p>
        <p>Max Temperature: {props.temp_max}</p>
        <p>Humidity: {props.humidity}</p>
      </div>
    </>
  );
});
