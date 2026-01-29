"use client";

import store from "@/redux/store";
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { hydrateCart } from "@/redux/cartSlice";

// Component to hydrate cart on client-side mount
const CartHydrator = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrateCart());
  }, [dispatch]);

  return children;
};

const ReduxProviderWrapper = ({ children }) => {
  return (
    <Provider store={store}>
      <CartHydrator>{children}</CartHydrator>
    </Provider>
  );
};

export default ReduxProviderWrapper;
