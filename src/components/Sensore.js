import { getDatabase, ref, set, onValue , remove, update, serverTimestamp} from 'firebase/database'
import { useState, useEffect} from 'react';
import { useAuth } from '../context/authContext';
// import {db} from "../firebase.config"
// import {uid} from 'uid'
 
export default function SensorList(){

    const { user } = useAuth(); // Obtenemos el uid del contexto de autenticación
    const uidUser = user.uid;
    const dbPath ='UsersData/' + uidUser+ "/readings";
    const dbRef = ref(getDatabase(), dbPath);
    console.log(dbRef)

    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [tempUuid, setTempUuid] = useState("");
  
  
    const handleTodoChange = (e) => {
      setTodo(e.target.value);
    };
  
    //read
    useEffect(() => {
      onValue(dbRef, (snapshot) => {
        setTodos([]);
        const data = snapshot.val();
        if (data !== null) {
          Object.values(data).map((todo) => {
            setTodos((oldArray) => [...oldArray, todo]);
          });
        }
      });
    }, []);
  
    //write
    const writeToDatabase = () => {
      set(dbRef, {
        todo,
        uidUser
      });
  
      setTodo("");
    };
  
    //update
    const handleUpdate = (todo) => {
      setIsEdit(true);
      setTempUuid(todo.uidUser);
      setTodo(todo.todo);
    };
  
    const handleSubmitChange = () => {
      update(dbRef, {
        todo,
        uidUser: tempUuid,
      });
  
      setTodo("");
      setIsEdit(false);
    };
  
    //delete
    const handleDelete = (todo) => {
      remove(dbRef);
    };
   
    return(
        <div>
            <div className="App">
          <input type="text" value={todo} onChange={handleTodoChange} />
          {isEdit ? (
            <>
              <button onClick={handleSubmitChange}>Submit Change</button>
              <button
                onClick={() => {
                  setIsEdit(false);
                  setTodo("");
                }}
              >
                X
              </button>
            </>
          ) : (
            <button onClick={writeToDatabase}>submit</button>
          )}
          {todos.map((todo) => (
            <>
              <h1>{todo.todo}</h1>
              <button onClick={() => handleUpdate(todo)}>update</button>
              <button onClick={() => handleDelete(todo)}>delete</button>
            </>
          ))}
        </div>
    </div>
    );
}
