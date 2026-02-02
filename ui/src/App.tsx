import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import { TripCreatorPage } from "./pages/TripCreatorPage";
import { TripInspectorPage } from "./pages/TripInspectorPage";
import { TripManagerPage } from "./pages/TripManagerPage";

const airline = "Ryanair";

function App() {
  return (
    <Container fluid className="min-vh-100 py-4 bg-light">
      <Routes>
        <Route path="/trips" element={<TripManagerPage />} />
        <Route path="/trips/new" element={<TripCreatorPage selectedAirline={airline} />} />
        <Route path="/trips/:id" element={<TripInspectorPage />} />
        <Route path="/" element={<Navigate to="/trips" replace />} />
      </Routes>
    </Container>
  );
}

export default App;


