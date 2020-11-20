import { Navigation } from 'react-native-navigation'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import {
    GestureScreen,
    WorkletScreen,
    DragToSortScreen,
    Worklets2Screen
} from './src/screens/lessons'
import * as AnimScreens from './src/screens/animations'
import { Colors } from './src/theme'
import App from './App'

const _SCREENS = [
    { name: 'WelcomeScreen', component: App },
    { name: 'WorkletScreen', component: WorkletScreen },
    { name: 'Worklet2Screen', component: Worklets2Screen },
    { name: 'GestureScreen', component: GestureScreen },
    { name: 'DragToSortScreen', component: DragToSortScreen },
    { name: 'DraggableListScreen', component: AnimScreens.DraggableListScreen },
    { name: 'DynamicItemsScreen', component: AnimScreens.DynamicItemsScreen },
    { name: 'GalleryScreen', component: AnimScreens.GalleryScreen },
    { name: 'BarChartScreen', component: AnimScreens.BarChartScreen },
    { name: 'CalendarScreen', component: AnimScreens.CalendarScreen },
    { name: 'PaginateScreen', component: AnimScreens.PaginateScreen },
    { name: 'SeletectableListScreen', component: AnimScreens.SelectableListScreen }
]

_SCREENS.forEach((v) => {
    Navigation.registerComponent(v.name, () =>
        gestureHandlerRootHOC(v.component)
    )
})

const FIRST_SCREEN = __DEV__ ? 'SeletectableListScreen' : 'WelcomeScreen'

Navigation.setDefaultOptions({
    layout: {
        backgroundColor: Colors.backgroundColor
    },
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
