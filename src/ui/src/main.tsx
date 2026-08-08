import "bootstrap/dist/css/bootstrap.min.css";

import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ToastProvider } from "./components/ToastProvider";

ReactDOM.render(
	<BrowserRouter>
		<ToastProvider>
			<App />
		</ToastProvider>
	</BrowserRouter>,
	document.getElementById("root") as HTMLElement,
);
