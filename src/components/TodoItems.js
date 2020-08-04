import React, { useState } from 'react'
import { Input } from 'antd'
import PropTypes from 'prop-types'

const TodoItems = ({addItem}) => {
  const [title, setTitle] = useState('');
  const handleSubmit = (e) =>{
    e.preventDefault();
    if (!title) return;
    addItem(title);
    setTitle('');
  }

  return (
    <form className="List" onSubmit={handleSubmit}>
      <Input className="type" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" required type="text"/>
    </form>
  );
}

TodoItems.protoTypes = {
  addItem: PropTypes.func
}
export default TodoItems