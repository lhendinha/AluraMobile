import { Navigation } from 'react-native-navigation';
import Login from './components/Login';
import Feed from './components/Feed';
import Initializing from './components/Initializing';


export function registerScreens() {
  Navigation.registerComponent('Login', () => Login);
  Navigation.registerComponent('Feed', () => Feed);
  Navigation.registerComponent('PerfilUsuario', () => Feed);
  Navigation.registerComponent('Initializing', () => Initializing);
}