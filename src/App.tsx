import {useEffect,useState, useContext} from "react"
import {app, db} from "firebaseApp"
import {getAuth, onAuthStateChanged} from "firebase/auth"
import {ToastContainer} from "react-toastify"
import Router from "./components/Router"
import "react-toastify/dist/ReactToastify.css";
import Loader from "components/Loader"
import ThemeContext from "context/ThemeContext"
function App() {
  const context = useContext(ThemeContext);
  const auth=getAuth(app);
  const [init, setInit]=useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated]=useState<boolean>(
    !!auth?.currentUser
  );

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setInit(true);
    });
  }, [auth]);
  return (
    <>
      <div className={context.theme === "light" ? "white" : "dark"}>
        <ToastContainer />
        {init ? <Router isAuthenticated={isAuthenticated} /> : <Loader />}
      </div>
      
    </>
  );
}

export default App;
