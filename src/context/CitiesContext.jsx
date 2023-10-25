import {
    createContext,
    useEffect,
    useContext,
    useReducer,
    useCallback,
} from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext(null);

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
};

function reducer(state, action) {
    switch (action.type) {
        case "loading":
            return { ...state, isLoading: action.payload };
        case "setCities":
            return { ...state, cities: action.payload };
        case "setCurrCity":
            return { ...state, currentCity: action.payload };
        case "addCity": {
            const newCities = [...state.cities, action.payload];
            return { ...state, cities: newCities, currentCity: action.payload };
        }
        case "removeCity":
            return {
                ...state,
                cities: state.cities.filter((city) => {
                    return city.id !== action.payload;
                }),
                currentCity: {},
            };

        default:
            throw new Error("no state");
    }
}

function CitiesProvider({ children }) {
    // const [cities, setCities] = useState([]);
    // const [isLoading, dispatch]{ payloadaction:'loading',:=} useState(false);
    // const [currentCity, setCurrentCity] = useState({});

    const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
        reducer,
        initialState
    );

    useEffect(() => {
        const getCities = async () => {
            try {
                // setIsLoading(true);
                dispatch({ type: "loading", payload: true });
                // dispatch({ type: "loading", payload: true });
                const res = await fetch(`${BASE_URL}/cities`);
                if (!res.ok) return new Error("Cities could not be fetched");
                const data = await res.json();
                dispatch({ type: "setCities", payload: data });
            } catch (error) {
                console.error(error);
            } finally {
                dispatch({ type: "loading", payload: false });
            }
        };

        getCities();
    }, []);

    const getCity = useCallback(
        async function getCity(id) {
            if (Number(id) === Number(currentCity.id)) return;

            dispatch({ type: "loading", payload: true });
            try {
                const res = await fetch(`${BASE_URL}/cities/${id}`);
                if (!res.ok) return new Error("Cities could not be fetched");
                const data = await res.json();
                dispatch({ type: "setCurrCity", payload: data });
            } catch (error) {
                console.error(error);
            } finally {
                dispatch({ type: "loading", payload: false });
            }
        },
        [currentCity.id]
    );

    async function addCity(newCity) {
        try {
            dispatch({ type: "loading", payload: true });
            const res = await fetch(`${BASE_URL}/cities`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();

            if (!data.id) throw new Error("Could not add City to the list");

            // setCities((prev) => {
            //     return [...prev, data];
            // });
            dispatch({ type: "addCity", payload: data });
        } catch (error) {
            console.error(error);
        } finally {
            dispatch({ type: "loading", payload: false });
        }
    }

    async function removeCity(cityId) {
        try {
            dispatch({ type: "loading", payload: true });
            const res = await fetch(`${BASE_URL}/cities/${cityId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Could not remove city");
            // setCities((prevCities) => {
            //     return prevCities.filter((prevCity) => prevCity.id !== cityId);
            // });
            dispatch({ type: "removeCity", payload: cityId });
        } catch (error) {
            console.error(error);
        } finally {
            dispatch({ type: "loading", payload: false });
        }
    }

    return (
        <CitiesContext.Provider
            value={{
                test: "test",
                cities,
                isLoading,
                currentCity,
                getCity,
                addCity,
                removeCity,
            }}
        >
            {children}
        </CitiesContext.Provider>
    );
}

function useCities() {
    const context = useContext(CitiesContext);
    if (!context)
        throw new Error("use Context was used outside the CitiesProvider");
    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCities };
