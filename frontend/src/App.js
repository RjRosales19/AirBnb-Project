import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";

import AllSpots from "./components/AllSpots";
import SpotDetails from "./components/SpotDetails";
import CreateSpotForm from "./components/ManageSpots/CreateSpotForm";
import ManageSpots from "./components/ManageSpots";
import UpdatedSpot from "./components/ManageSpots/UpdateSpot"

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);



  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
      <Switch>
        <Route exact path="/">
          <AllSpots />
        </Route>
        <Route path="/spots/new">
          <CreateSpotForm />
        </Route>
        <Route path="/spots/current">
          <ManageSpots />
        </Route >
        <Route path="/spots/:spotId/edit">
          <UpdatedSpot />
        </Route >
        <Route path="/spots/:spotId">
          <SpotDetails />
        </Route>

      </Switch>
      }
    </>
  );
}

export default App;
