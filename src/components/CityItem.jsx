import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../context/CitiesContext";
import Flag from "./Flag";

const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
    }).format(new Date(date));

export default function CityItem({ city }) {
    const { currentCity } = useCities();
    const { cityName, emoji, date, id, position: { lat, lng } = {} } = city;
    const { removeCity } = useCities();

    function handleRemoveCity(id) {
        removeCity(id);
    }

    return (
        <li>
            <Link
                className={`${styles.cityItem} ${
                    id === currentCity.id ? styles["cityItem--active"] : ""
                }`}
                to={`${id}?lat=${lat}&lng=${lng}`}
            >
                <span className={styles.emoji}>
                    <Flag country={emoji} />{" "}
                </span>
                <h3 className={styles.name}>{cityName}</h3>
                <time className={styles.date}> ({formatDate(date)}) </time>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleRemoveCity(id);
                    }}
                    className={styles.deleteBtn}
                >
                    &times;
                </button>
            </Link>
        </li>
    );
}
