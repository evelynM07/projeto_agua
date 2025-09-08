import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import Progress from "./components/Progress";

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{headerShown: false}} name={"Home"} component={HomeScreen}/>
            <Stack.Screen options={{headerShown: false}} name={"Progress"} component={Progress}/>
        </Stack.Navigator>
      </NavigationContainer>
  )
}