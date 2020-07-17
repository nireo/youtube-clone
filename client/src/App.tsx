import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Navbar } from "./components/layout/Navbar";
import { DrawerWrapper } from "./components/layout/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";

function App() {
  const darkTheme = createMuiTheme({
    palette: {
      type: "dark"
    }
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DrawerWrapper />
    </ThemeProvider>
  );
}

export default App;
