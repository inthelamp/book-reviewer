import { useStore } from 'react-redux'
import {SignedIn, SignedOut} from './Actions'


const store = useStore()
store.dispatch(SignedIn)


const unsubscribe = store.subscribe(() => {
    console.log('Subscribe store', store.getState())
})


store.dispatch(SignedOut)

unsubscribe()