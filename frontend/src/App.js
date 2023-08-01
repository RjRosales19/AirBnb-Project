import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";

import AllSpots from "./components/AllSpots";

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
        <Route exact path="/" component={AllSpots}>

        </Route>
        <Route path="/spots/new">

        </Route>
        <Route path="/spots/:spotId">

        </Route>
        <Route path="/spots/:spotId/edit">

        </Route >

      </Switch>
      }
    </>
  );
}

export default App;
