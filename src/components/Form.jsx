// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import useUrlPosition from "../hooks/useUrlPosition";
import Flag from "./Flag";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../context/CitiesContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BASE_URL = "https://api.bigdatacloud.net";

function Form() {
    const { lng, lat } = useUrlPosition("lng", "lat");

    const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
    const [cityName, setCityName] = useState("");
    const [country, setCountry] = useState("");
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState("");
    const [emoji, setEmoji] = useState("");
    const [geocodingError, setGeocodingError] = useState("");
    const { addCity, isLoading } = useCities();
    const navigate = useNavigate();

    useEffect(() => {
        (async function () {
            if (!lat && !lng) return;
            try {
                setIsLoadingGeocoding(true);
                setGeocodingError("");

                const res = await fetch(
                    `${BASE_URL}/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
                );
                // if (!res.ok) throw new Error("Couldn't fetch data");
                const data = await res.json();

                if (!data.countryCode)
                    throw new Error(
                        "That doesn't seeem to be a city. Click somewhere else 😉"
                    );

                setCityName(data.city || data.locality || "");
                setCountry(data.countryName || "");
                setEmoji(data.countryCode);
            } catch (error) {
                setGeocodingError(error.message);
            } finally {
                setIsLoadingGeocoding(false);
            }
        })();
    }, [lat, lng]);



    async function handleAddCity(e) {
        e.preventDefault();

        if(!cityName || !date) return;

        const cityData = {
            cityName,
            country,
            emoji: emoji.toLowerCase(),
            date,
            position: { lat, lng },
            notes,
            id: new Date().getTime(),
        };

        await addCity(cityData);
        navigate("/app/cities");
    }

    if (!lat && !lng)
        return <Message message="Start by clicking something on the map" />;

    if (isLoadingGeocoding) return <Spinner />;

    if (geocodingError) return <Message message={geocodingError} />;

    return (
        <form className={`${styles.form} ${isLoading ? styles.loading : ''}`} onSubmit={handleAddCity}>
            <div className={styles.row}>
                <label htmlFor="cityName">City name</label>
                <input
                    id="cityName"
                    onChange={(e) => setCityName(e.target.value)}
                    value={cityName}
                />
                <span>
                    <Flag country={emoji.toLowerCase() || "ro"} />
                </span>
            </div>

            <div className={styles.row}>
                <label htmlFor="date">When did you go to {cityName}?</label>
                {/* <input
                    id="date"
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                /> */}
                <DatePicker
                    id="date"
                    onChange={(date) => setDate(date)}
                    selected={date}
                    dateFormat={"dd/MM/yyyy"}
                />
            </div>

            <div className={styles.row}>
                <label htmlFor="notes">
                    Notes about your trip to {cityName}
                </label>
                <textarea
                    id="notes"
                    onChange={(e) => setNotes(e.target.value)}
                    value={notes}
                />
            </div>

            <div className={styles.buttons}>
                <Button type="primary">Add</Button>

                <BackButton />
            </div>
        </form>
    );
}

export default Form;
