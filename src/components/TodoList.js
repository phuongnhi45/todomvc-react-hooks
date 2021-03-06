import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TodoItems from './TodoItems'
// import TodoHandle from './TodoHandle'
import { API_URL } from '../constants/config'
import { apiCompletedAll } from '../service/request-api'
import {
  DownOutlined,
  DeleteFilled,
  CheckOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Input, Button } from "antd";

const TodoList = () => {
  const [list, setList] = useState([]);
  const [itemRemaining, setItemRemaining] = useState(0);

  const [isCompleted, setIsCompleted] = useState(false);
  const [isFilter, setIsFilter] = useState(false);

  const SINGLE_VALUE = 1;
  const PLURAL_TEXT = "items left";
  const SINGLE_TEXT = "item left";

  useEffect(() => {
    async function getData() {
      const response = await axios.get(`${API_URL}/todos`);
      setList(response.data);
      if (response.data == null) {
        setList(list);
      }
    }
    getData();
  }, [list]);

  useEffect(() => {
    setItemRemaining(list.filter((list) => !list.isComplete).length);
  }, [list]);

  const addItem = (title) => {
    axios.post(`${API_URL}/todos`, { content: title });
    setList([...list, { content: title, isComplete: false, _id: Date.now() }]);
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

    const response = await apiCompletedAll();
    if (response.status !== 200 || response.success) {
      alert("error");
    } else {
      setList(todoItems);
    }
  };

  const deleteId = (_id) => {
    axios.delete(`${API_URL}/todos/${_id}`);
    setList(list.filter((item) => item._id !== _id));
  };

  const onChange = (index, _id) => {
    let lists = list;
    lists[index].isComplete = !list[index].isComplete;

    var url = `${API_URL}/todos/select/${_id}`;
    axios.patch(url);
    setList([...list]);
  };

  const clear = (_id) => {
    var url = `${API_URL}/todos`;
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
    axios.patch(`${API_URL}/todos/${_id}`, { content: value });
    setList(todoItems);
  };

  const handleSetFilter = () => {
    setIsFilter(false);
  };

  const handleSetListStatus = (status) => () => {
    setIsFilter(true);
    setIsCompleted(status);
  };

  const displayList = () => {
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
          <CheckCircleOutlined
            style={{ color: "brown" }}
            onClick={() => onChange(index, item._id)}
            alt="done"
          />
        ) : (
          <CheckOutlined
            onClick={() => onChange(index, item._id)}
            alt="not yet"
          />
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
        {displayList()}
        {list.length && (
          <footer>
            <DownOutlined
              className={itemRemaining === 0 ? "moreOpacity" : "lessOpacity"}
              onClick={() => checkAll()}
              alt="all"
            />
            <span>
              {itemRemaining}{" "}
              {itemRemaining !== SINGLE_VALUE ? PLURAL_TEXT : SINGLE_TEXT}
            </span>
            <Button onClick={handleSetFilter}>All</Button>
            <Button onClick={handleSetListStatus(false)}>Active</Button>
            <Button onClick={handleSetListStatus(true)}>Completed</Button>
            {itemRemaining < list.length && (
              <Button onClick={clear}>Clear Completed</Button>
            )}
          </footer>
          // <TodoHandle checkAll={checkAll}/>
        )}
      </ul>
    </div>
  );
};
export default TodoList;
