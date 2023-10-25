import Spinner from "./Spinner";
import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Message from "./Message";
import { useCities } from "../context/CitiesContext";

export default function CountryList() {
    // console.log(cities)

    const { cities, isLoading } = useCities()
    
    console.log('country listy item renedred');


    if (isLoading) {
        return <Spinner />;
    }

    if (!cities.length)
        return (
            <Message message="Add your first city by clicking on a city on the map" />
        );

    const { countries } = cities.reduce(
        (acc, city) => {
            if (!acc.cities.includes(city.country)) {
                return {
                    cities: [...acc.cities, city.country],
                    countries: [...acc.countries, {emoji:city.emoji,country:city.country}],
                };
            }

            return acc;
        },
        {
            cities: [],
            countries: [],
        }
    ); 

    return (
        <>
            <ul className={`${styles.countryList}`}>
                {countries.map((country) => {
                    return <CountryItem key={country.emoji} country={country} />;
                })}
            </ul>
        </>
    );
}
