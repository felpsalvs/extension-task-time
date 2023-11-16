import { useEffect, useState } from "react";
import { BiMessageSquareAdd } from "react-icons/bi";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Task from "./components/Task";
import EditModal from "./components/EditModal";
import AddTaskModal from "./components/AddTaskModal";
import "react-toastify/dist/ReactToastify.css";
const serverUrl = process.env.REACT_APP_STRAPI_SERVER;

function App() {
  const [tasks, setTasks] = useState([]);
  const [fetchError, setFetchError] = useState([]);
  const [tasksCompleted, setTasksCompleted] = useState([]);
  const [taskToUpdate, setTaskToUpdate] = useState({});
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const updateChromeBadge = (value) => {
    const { chrome } = window;
    chrome.action?.setBadgeText({ text: value });
    chrome.action?.setBadgeBackgroundColor({ color: "#fff" });
  };

  const getAllTask = async () => {
    setFetchError("");

    try {
      const res = await axios.get(`${serverUrl}/api/tasks`);

      const {
        data: { data },
      } = res;

      const tasks = data
        .filter((task) => !task.attributes.completed)
        .map((task) => {
          if (Date.now() > parseInt(task?.attributes?.realTime)) {
            task.attributes.realTime = 0;
            return task;
          }
          return task;
        });

      const completedTasks = data.filter((task) => task.attributes.completed);
      setTasksCompleted(completedTasks);
      updateChromeBadge(completedTasks.length.toString());
      setTasks(tasks.reverse());
    } catch (err) {
      setFetchError(err.message);
    }
  };
  useEffect(() => {
    getAllTask();
  }, []);

  return (
    <div>
      <div className="w-full flex justify-center rounded">
        <div className="w-96 sm:w-1/3 overflow-scroll border p-5 mb-20 relative bg-slate-50">
          <div>
            <h1 className="text-focus-in text-4xl font-bold text-slate-900">
              Temporizador
            </h1>
            <span className="text-slate-400">aproveite o dia :D</span>
          </div>
          <div>
            <h1 className="font-bold text-lg my-5">Tasks</h1>
            {fetchError && (
              <div className="text-red-500 text-center">
                Something went wrong
              </div>
            )}
            <div>
              {tasks.length ? (
                tasks?.map((task) => (
                  <Task
                    key={task.id}
                    updateChromeBadge={updateChromeBadge}
                    setTaskToUpdate={setTaskToUpdate}
                    setShowUpdateModal={setShowUpdateModal}
                    showUpdateModal={showUpdateModal}
                    task={task}
                  />
                ))
              ) : (
                <div className="text-center">No tasks at the moment</div>
              )}
            </div>
          </div>
          <div>
            <h2 className="font-bold text-lg my-4">Completed Tasks</h2>
            {fetchError && (
              <div className="text-red-500 text-center">
                Something went wrong
              </div>
            )}
            <div>
              {tasksCompleted.length ? (
                tasksCompleted?.map((task) => (
                  <Task key={task.id} task={task} />
                ))
              ) : (
                <div className="text-center">No tasks at the moment</div>
              )}
            </div>
          </div>
          <div className="fixed bottom-5 z-50 rounded w-full left-0 flex flex-col justify-center items-center">
            <button
              type="button"
              onClick={() => {
                setShowAddTaskModal(true);
              }}
              className="bg-white p-3 rounded-full"
            >
              <BiMessageSquareAdd
                className="text-green-500 bg-white"
                size={25}
              />
            </button>
          </div>
        </div>
        <ToastContainer />

        <EditModal
          setShowUpdateModal={setShowUpdateModal}
          showUpdateModal={showUpdateModal}
          task={taskToUpdate}
        />
        <AddTaskModal
          showAddTaskModal={showAddTaskModal}
          setShowAddTaskModal={setShowAddTaskModal}
        />
      </div>
    </div>
  );
}

export default App;
