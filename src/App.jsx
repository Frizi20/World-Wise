import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { CitiesProvider } from "./context/CitiesContext";
import { FakeAuthProvider } from "./context/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import { Suspense, lazy } from "react";

import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import SpinnerFullPage from "./components/SpinnerFullPage";

// import HomePage from "./pages/HomePage";
// import Product from "./pages/Product";
// import Pricing from "./pages/Pricing";
// import Login from "./pages/Login";
// import AppLayout from "./pages/AppLayout";
// import PageNotFound from "./pages/PageNotFound";

const HomePage = lazy(()=>import('./pages/Homepage'))
const PageNotFound = lazy(()=>import('./pages/PageNotFound'))
const AppLayout = lazy(()=>import('./pages/AppLayout'))
const Login = lazy(()=>import('./pages/Login'))
const Pricing = lazy(()=>import('./pages/Pricing'))
const Product = lazy(()=>import('./pages/Product'))

// dist/assets/index-de02af29.css   30.41 kB │ gzip:   5.10 kB
// dist/assets/index-32d3a65b.js   525.29 kB │ gzip: 148.84 kB




window.nrRenders = 0;

export default function App() {
    window.nrRenders += 1;

    return (
        <FakeAuthProvider>
            <CitiesProvider>
                <BrowserRouter>
                <Suspense fallback={<SpinnerFullPage />}>

                    <Routes>
                        <Route index element={<HomePage />} />
                        <Route path="product" element={<Product />} />
                        <Route path="pricing" element={<Pricing />} />
                        <Route path="login" element={<Login />} />
                        <Route
                            path="app"
                            element={
                                <ProtectedRoute>
                                    <AppLayout />
                                </ProtectedRoute>
                            }
                        >
                            {/* <Route index element={ <CityList cities={cities} isLoading={isLoading} /> } /> */}

                            <Route
                                index
                                element={<Navigate replace to={"cities"} />}
                            />

                            <Route
                                path="cities"
                                element={
                                    <CityList
                                    // cities={cities}
                                    // isLoading={isLoading}
                                    />
                                }
                            />
                            <Route
                                path="cities/:id"
                                element={
                                    <City
                                    // cities={cities}
                                    // isLoading={isLoading}
                                    />
                                }
                            />
                            <Route
                                path="countries"
                                element={
                                    <CountryList
                                    // cities={cities}
                                    // isLoading={isLoading}
                                    />
                                }
                            />
                            <Route path="form" element={<Form />} />
                        </Route>
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </Suspense>
                </BrowserRouter>
            </CitiesProvider>
        </FakeAuthProvider>
    );
}
