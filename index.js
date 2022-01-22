import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import { Navigation } from 'react-native-navigation'
import App from './App'
import * as AnimScreens from './src/screens/animations'
import { ShowMore } from './src/screens/animations/TopbarMenuScreen/ShowMore'
import {
    DragToSortScreen,
    GestureScreen,
    Worklets2Screen,
    WorkletScreen
} from './src/screens/playground'
import { Colors } from './src/theme'

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
    {
        name: 'SeletectableListScreen',
        component: AnimScreens.SelectableListScreen
    },
    { name: 'TopbarMenuScreen', component: AnimScreens.TopbarMenuScreen },
    { name: 'ShowMore', component: ShowMore },
    {
        name: 'ViewPagerHeaderScreen',
        component: AnimScreens.ViewPagerHeaderScreen
    },
    {
        name: 'LineGraphScreen',
        component: AnimScreens.LineGraphScreen
    },
    {
        name: 'GraphModal',
        component: AnimScreens.GraphModal
    },
    {
        name: 'ZoomableLineChartScreen',
        component: AnimScreens.ZoomableLineChartScreen
    },
    {
        name: 'D3ChartScreen',
        component: AnimScreens.D3ChartScreen
    },
    {
        name: 'ModalDemoScreen',
        component: AnimScreens.ModalDemoScreen
    },
    {
        name: 'ModalScreen',
        component: AnimScreens.ModalScreen
    }
]

_SCREENS.forEach((v) => {
    Navigation.registerComponent(v.name, () =>
        gestureHandlerRootHOC(v.component)
    )
})

const FIRST_SCREEN = __DEV__ ? 'ModalDemoScreen' : 'WelcomeScreen'

Navigation.setDefaultOptions({
    layout: {
        backgroundColor: Colors.backgroundColor
    },
    topBar: {
        title: {
            color: Colors.primary,
            alignment: 'center'
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
