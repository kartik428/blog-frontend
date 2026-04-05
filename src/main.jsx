import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { Toaster } from "./components/ui/sonner.jsx";
import ThemeProvider from "./components/ThemeProvider.jsx";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const persister = persistStore(store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
        <Toaster />
      </PersistGate>
    </Provider>
  </StrictMode>
);
