import React, { useEffect, useState } from "react";

function Todo() {
  const [state, setState] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newtask, setNewtask] = useState(false);
  const [task_name, setTaskName] = useState("");
  const [id, setId] = useState(NaN);
  // check if the mode is for editing
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setState(true);
    fetch("https://allang-todo.herokuapp.com/tasks/todo/").then((response) => {
      response.json().then((data) => {
        setState(false);
        console.log(data);
        setTasks(data);
      });
    });
  }, []);

  // Adding a new task
  const newTask = async (e) => {
    e.preventDefault();
    setState(true);
    console.log(task_name);
    const request = await fetch(
      "https://allang-todo.herokuapp.com/tasks/todo/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_name: task_name }),
      }
    );
    const response = await request.json();
    setState(false);
    console.log(response);
    window.location.href = "/";
  };
  const editTask = async (e, id) => {
    e.preventDefault();
    setState(true);
    const request = await fetch(
      `https://allang-todo.herokuapp.com/tasks/todo/${id}`,
      {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ task_name: task_name }),
      }
    );
    const resp = await request.json();
    console.log(resp);
    setState(false);
    window.location.href = "/";
  };
  // Delete Task
  const delTask = async (e, id) => {
    e.preventDefault();
    setState(true);
    const request = await fetch(
      `https://allang-todo.herokuapp.com/tasks/todo/${id}/`,
      {
        method: "DELETE",
      }
    );
    const resp = await request.text();
    console.log(resp);
    setState(false);
    window.location.href = "/";
  };
  return (
    <div id="container">
      <h3>Plan Your Day</h3>
      {/* Loading indicator */}
      {!state ? (
        <div>
          {state ? (
            <p style={{ textAlign: "center" }}>fetching your data</p>
          ) : (
            ""
          )}
          {tasks.constructor === Array ? (
            tasks.map((data) => {
              return (
                <div className="items" key={data.id}>
                  <div className="task-controls">
                    <input
                      disabled={data.completed}
                      checked={data.completed}
                      onChange={() => {
                        setState(true);
                        fetch(
                          `https://allang-todo.herokuapp.com/tasks/todo/${data.id}/`,
                          {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              task_name: data.task_name,
                              completed: true,
                            }),
                          }
                        ).then((complete) => {
                          complete.json().then((afirm) => {
                            setState(false);
                            console.log("Task completed", afirm);
                            window.location.href = "/";
                          });
                        });
                      }}
                      type="checkbox"
                      style={{ marginRight: "10px", color: "red" }}
                    />
                    <p className={data.completed ? "completed" : ""}>
                      {data.task_name}
                    </p>
                  </div>
                  {!data.completed ? (
                    <div className="actions">
                      <p
                        id="edit"
                        onClick={() => {
                          setNewtask(true);
                          setTaskName(data.task_name);
                          setEdit(true);
                          setId(data.id);
                        }}
                      >
                        Edit
                      </p>
                      <p
                        id="delete"
                        onClick={(e) => {
                          delTask(e, data.id);
                        }}
                      >
                        Delete
                      </p>
                    </div>
                  ) : (
                    <div className="actions">
                      <p
                        id="edit"
                        onClick={() => {
                          setState(true);
                          fetch(
                            `https://allang-todo.herokuapp.com/tasks/todo/${data.id}/`,
                            {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                task_name: data.task_name,
                                completed: false,
                              }),
                            }
                          ).then((complete) => {
                            complete.json().then((afirm) => {
                              console.log("Task completed", afirm);
                              window.location.href = "/";
                              setState(false);
                            });
                          });
                        }}
                      >
                        Undo
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>Something went wrong</p>
          )}
          <p
            style={{
              marginLeft: "13px",
              cursor: "pointer",
              backgroundColor: "rgba(127, 255, 212, 0.685)",
              maxWidth: "100px",
              padding: "5px",
              textAlign: "center",
              display: newtask ? "none" : "block",
            }}
            onClick={() => setNewtask(!newtask)}
          >
            Add Task +
          </p>
          {newtask ? (
            <form
              onSubmit={(e) => (edit ? editTask(e, id) : newTask(e))}
              className="form"
            >
              <input
                type="text"
                className="input-task"
                placeholder="new task"
                value={task_name}
                onChange={(e) => setTaskName(e.target.value)}
              />
              <div>
                <button type="submit" className="button add">
                  Add
                </button>
                <button
                  className="button cancel"
                  onClick={() => setNewtask(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p></p>
          )}
        </div>
      ) : (
        <p
          style={{
            margin: "auto auto",

            marginTop: "50%",
            marginLeft: "40%",
          }}
        >
          Loading...
        </p>
      )}
    </div>
  );
}

export default Todo;
