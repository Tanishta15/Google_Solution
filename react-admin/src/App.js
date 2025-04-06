import { useState } from "react";

import { Routes, Route } from "react-router-dom";

import Topbar from "./scenes/global/Topbar";

//import Sidebar from "./scenes/global/Sidebar";

import Dashboard from "./scenes/dashboard";

import Bar from "./scenes/bar";

import Line from "./scenes/line";

import Pie from "./scenes/pie";

import Geography from "./scenes/geography";

import { CssBaseline, ThemeProvider } from "@mui/material";

import { ColorModeContext, useMode } from "./theme";

  

function App() {

 const [theme, colorMode] = useMode();

 const [isSidebar, setIsSidebar] = useState(true);

  

 return (

  <ColorModeContext.Provider value={colorMode}>

   <ThemeProvider theme={theme}>

    <CssBaseline />

    <div className="app">

    <isSidebar isSidebar={isSidebar} />

     <main className="content">

      <Topbar setIsSidebar={setIsSidebar} />

      <Routes>

       <Route path="/" element={<Dashboard />} />

       <Route path="/bar" element={<Bar />} />

       <Route path="/pie" element={<Pie />} />

       <Route path="/line" element={<Line />} />

       <Route path="/geography" element={<Geography />} />

      </Routes>

     </main>

    </div>

   </ThemeProvider>

  </ColorModeContext.Provider>

 );

}

  

export default App;