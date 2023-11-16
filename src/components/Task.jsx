import React, { useEffect, useState, useCallback } from "react";
import { BiEditAlt } from "react-icons/bi";
import { BsCheck2Square } from "react-icons/bs";
import { RxTrash } from "react-icons/rx";
import Tooltip from "react-simple-tooltip";
import axios from "axios";
import moment from "moment";
const serverUrl = process.env.REACT_APP_STRAPI_SERVER;

export default function Tasks({ task, setShowUpdateModal, setTaskToUpdate }) {
  const [count, setCount] = useState(0);
  const [timeString, setTimeString] = useState("");

  let dateCreated = new Date(task?.attributes?.dateCreated);
  dateCreated = moment(dateCreated).calendar();

  const getTimeString = useCallback(() => {
    console.log("get time string do run oo");
    const mins = Math.floor(
      (parseInt(task?.attributes?.realTime) - Date.now()) / 60000
    );
    const seconds =
      Math.round((parseInt(task?.attributes?.realTime) - Date.now()) / 1000) %
      60;
    if (mins <= 0 && seconds <= 0) {
      setTimeString("done");
      return;
    }
    let timeString = "starting counter";
    timeString = `${mins} min ${seconds} secs`;
    setTimeString(timeString);
  }, [task]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((count) => count + 1);
      getTimeString();
    }, 1000);
    return () => clearInterval(timer);
  }, [getTimeString]);
  return (
    <div
      className={`${
        task?.attributes?.completed ? "bg-green-500 text-white" : "bg-white"
      } scale-in-center p-8 hover:shadow-xl rounded-3xl shadow-md my-5 relative`}
    >
      <div className="flex justify-center w-full">
        <span className="absolute top-0 text-sm font-thin border p-1">
          {dateCreated}
        </span>
      </div>

      <div className="flex items-center justify-between mb-5">
        {!task?.attributes?.completed ? (
          <div className="w-1/4">
            <Tooltip content="Mark as completed!">
              <button
                type="button"
                disabled={task?.attributes?.completed}
                onClick={markCompleted}
                className="p-2 rounded"
              >
                <BsCheck2Square className="text-2xl hover:text-green-500" />
              </button>
            </Tooltip>
          </div>
        ) : null}
        <div className="w-2/4 flex flex-col">
          <span className="text-focus-in font-bold text-base">
            {task?.attributes?.title}
          </span>
          {parseInt(task?.attributes?.realTime) ? (
            <span className="font-thin">{timeString}</span>
          ) : (
            <span className="font-thin">done</span>
          )}
        </div>
        <div className="w-1/4 flex justify-end">
          {!task?.attributes?.completed ? (
            <Tooltip content="Edit task title!">
              {" "}
              <button
                type="button"
                onClick={() => {
                  setTaskToUpdate(task);
                  setShowUpdateModal(true);
                }}
              >
                <BiEditAlt className="text-2xl hover:text-blue-500" />
              </button>
            </Tooltip>
          ) : null}
          <Tooltip content="Delete this task?">
            <button type="button" onClick={handleDelete}>
              <RxTrash className="text-2xl hover:text-red-500" />
            </button>
          </Tooltip>
        </div>
      </div>
      <p className="absolute bottom-0 my-3 text-center text-sm w-full left-0">
        {task?.attributes?.taskTime} minute(s) task
      </p>
    </div>
  );
}
