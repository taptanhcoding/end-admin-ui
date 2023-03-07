import  {useState,useEffect} from 'react'

export default function useDelayInput(value,delay=300) {
    const [debount,setDebount] = useState('')
    useEffect(() =>{
      let setT = setTimeout(() => setDebount(value),delay)
      return () => clearTimeout(setT)
    },[value])

    return debount
}