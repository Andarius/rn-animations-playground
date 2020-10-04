import { Navigation } from 'react-native-navigation'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import {
    GestureScreen,
    WorkletScreen,
    DragToSortScreen
} from './src/screens/lessons'
import { DraggableListScreen } from './src/screens/others'
import { Colors } from './src/theme'
import App from './App'

const _SCREENS = [
    { name: 'WelcomeScreen', component: App },
    { name: 'WorkletScreen', component: WorkletScreen },
    { name: 'GestureScreen', component: GestureScreen },
    { name: 'DragToSortScreen', component: DragToSortScreen },
    { name: 'DraggableListScreen', component: DraggableListScreen }
]

_SCREENS.forEach((v) => {
    Navigation.registerComponent(v.name, () =>
        gestureHandlerRootHOC(v.component)
    )
})

const FIRST_SCREEN = __DEV__ ? 'DraggableListScreen' : 'WelcomeScreen'

Navigation.setDefaultOptions({
    topBar: {
        title: {
            color: Colors.primary
        },
        backButton: {
            visible: true,
            color: Colors.primary,
            // iOS
            showTitle: false
        }
    }
})
Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: FIRST_SCREEN
                        }
                    }
                ]
            }
        }
    })
})
