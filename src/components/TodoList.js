import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TodoItems from './TodoList'
import {API_URL}  from '../constants/config'
import {
  DownOutlined,
  DeleteFilled,
  CheckOutlined,
  CheckCircleTwoTone
} from '@ant-design/icons'
import { Input } from 'antd'

const TodoList = () => {
  const [list, setList] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [itemRemaining, setItemRemaining] = useState(0);

  const [isCompleted, setIsCompleted] = useState(false);
  const [isFilter, setIsFilter] = useState(false);

  const SINGLE_VALUE = 1;
  const PLURAL_TEXT = 'items left';
  const SINGLE_TEXT = 'item left';

  useEffect(
    () => {
      async function getData() {
        const response = await axios.get(`${API_URL}/todos`);
        // if(response.data == null){
        //   setList(list)
        // }
        setList(response.data)
      }
      getData();
    }, []);

  useEffect(
    () => {
      setItemRemaining(list.filter((list) => !list.isComplete).length);
    },
    [list]
  );

  const addItem = (title) => {
    setList([...list, { content: title, isComplete: false, _id: Date.now() }]);
    axios.post(`${API_URL}/todos`, { content: title });
  };

  const checkAll = async () => {
    // none selected -> all selected
    let totalSelected = 0;
    for (const item of list) {
      if (item.isComplete) totalSelected++;
    }

    // < total selected -> all selected
    // all selected -> none selected
    const newSelectedState = totalSelected < list.length; // true
    const todoItems = list.map((item) => {
      item.isComplete = newSelectedState;
      return item;
    });
    setIsComplete(!isComplete);
    setList(todoItems);

    const response = await axios.put(`${API_URL}/todos`);
    if (response.status !==200) { 
       return response
    }
  };

  const deleteId = (_id) => {
    setList(list.filter((item) => item._id !== _id));
    axios.delete(`${API_URL}/todos/${_id}`)
  };

  const onChange = (index, _id) => {
    let lists = list;
    lists[index].isComplete = !list[index].isComplete;
    setList([...list]);
    var url =`${API_URL}/todos/${_id}`;
    axios.patch(url);
  };

  const clear = (_id) => {
    var url =`${API_URL}/todos`;
    axios.delete(url);
    setList(list.filter((item) => item.isComplete === false));
  };

  const editItem = (_id, value) => {
    const index = list.findIndex((item) => {
      return item._id === _id;
    });
    if (index === -1) return;
    const item = Object.assign({}, list[index]);
    const todoItems = Object.assign([], list);
    todoItems[index] = {
      ...item,
      content: value,
    };
    setList(todoItems);
    axios.patch(`${API_URL}/todos/${_id}`, { content: value });
  };

  const handleSetFilter = () => {
    setIsFilter(false);
  };

  const handleSetListStatus = (status) => () => {
    setIsFilter(true);
    setIsCompleted(status);
  };

  const showList = () => {
    let lists = list;
    if (isFilter) {
      lists = list.filter((item) => item.isComplete === isCompleted);
    }
    const resullt = lists.map((item, index) => (
      <li
        style={{
          textDecoration: item.isComplete ? "line-through" : null,
        }}
        key={item._id}
      >
        {item.isComplete ? (
          <CheckOutlined onClick={() => onChange(index, item._id)} alt="not yet"/>
        ) : (
          <CheckCircleTwoTone onClick={() => onChange(index, item._id)} alt="done"/>
        )}
        <Input
          onChange={(e) => editItem(item._id, e.target.value)}
          value={item.content}
          className="edit"
        />
        <DeleteFilled 
          index={item._id}
          onClick={() => deleteId(item._id)}
          className="option"
          alt="delete"
        />
      </li>
    ));
    return resullt;
  };

  return (
    <div className="List">
      <TodoItems addItem={addItem} />
      
      <ul className="theList">
        {showList()}
        {
        list.length &&
          <footer>
            <DownOutlined 
              className={ isComplete ? 'moreOpacity' : 'lessOpacity'}
              onClick={() => checkAll()}
              alt="all"
            />
            <span>
              {itemRemaining} {itemRemaining !== SINGLE_VALUE ? PLURAL_TEXT : SINGLE_TEXT}
            </span>
            <button onClick={handleSetFilter}>All</button>
            <button onClick={handleSetListStatus(false)}>Active</button>
            <button onClick={handleSetListStatus(true)}>Completed</button>
            <button onClick={clear}>Clear Completed</button>
          </footer>
        }
      </ul>
    </div>
  );
};
export default TodoList;