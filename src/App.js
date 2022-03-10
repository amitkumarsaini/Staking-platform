import "./App.css";
import Application from "./Application";
import { Provider } from "react-redux";
import configureStore from "./store";
let { store, persistor } = configureStore();
function App() {
  return (
    <Provider store={store}>
      <Application />
    </Provider>
  );
}
export const storeInstance = store;
export default App;
