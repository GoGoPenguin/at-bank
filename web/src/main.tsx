import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./i18n";

// Start worker
// In order for our mock definition to execute during the runtime, it needs to be imported into our application's code.
// However, since mocking is a development-oriented technique, we will be importing our `src/mocks/browser.js` file
// conditionally, depending on the current environment.
async function enableMocking() {
  if (process.env.NODE_ENV === "development") {
    const { worker } = await import("./mock/browser.ts");
    return worker.start();
  }
}

// Create a client
const queryClient = new QueryClient();

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
});
