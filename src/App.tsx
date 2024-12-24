import { Board } from "./components/Board";
import { BrowserRouter, Route, Routes } from "react-router";
import Editor from "./components/Editor";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Collage Board Builder
            </h1>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Board />} />
            <Route path="/editor" element={<Editor />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}
export default App;
