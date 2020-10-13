import { useRef } from 'react'
import Animated, {
    useSharedValue as REAuseSharedValue,

} from 'react-native-reanimated'

export function useSharedValue<T>(value: T, shouldRebuild = false) {
    const ref = useRef<T | null>(null);
    if (ref.current === null || shouldRebuild) {
      ref.current = value;
    }
  
    return REAuseSharedValue(ref.current);
  }
