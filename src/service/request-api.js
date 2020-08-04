import callApi from '../ultis/api-call'

export const apiCompletedAll = () => {
  return callApi('todos', "put")
}

export const apiAdd = (data) => {
  return callApi('todos', "post", data)
}

export const apiDeleteCompleted = (data) => {
  return callApi('todos', "delete", data)
}

export const apiChangeStatus = (item) => {
  let _id = item._id;
  let url = `todos/select/${_id}`;
  return callApi(url, "patch")
}

export const apiDeleteId = (item) => {
  let _id = item._id;
  let url = `todos/${_id}`;
  return callApi(url, "delete")
}

export const apiEditItem = (data, _id) => {
  let url = `todos/${_id}`;
  return callApi(url, "patch", data);
}