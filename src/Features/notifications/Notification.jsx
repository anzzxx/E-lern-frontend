import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../../Redux/Slices/notificationSlice";

const useWebSocket = () => {
  const dispatch = useDispatch();
  const token = useSelector((state)=>state.auth.accessToken)
  useEffect(() => {
   
    if (!token) {
      console.error("No token found. WebSocket connection not established.");
      return;
    }

    const socket = new WebSocket(`wss://api.elern.shop/ws/notify/?token=${token}`);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };
    console.log('onmesage');
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      
      dispatch(addNotification({message:data.message})); // Add new notification to Redux store
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [dispatch]);

  return null; // No need to return anything since Redux handles state
};

export default useWebSocket;
