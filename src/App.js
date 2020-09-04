import React, {
  useState,
  useRef,
  useEffect
} from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.scss";

const App = () => {
  const [records, setRecords] = useState(JSON.parse(localStorage.getItem("records") || "[]"));
  const [editedRecords, setEditedRecords] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, [editedRecords]);

  const onInputChange = evt => {
    setInputText(evt.target.value);
  };

  const onFormSubmit = evt => {
    evt.preventDefault();

    if (inputText !== "") {
      const newRecords = [
        ...records,
        {
          id: uuidv4(),
          text: inputText,
          isEditing: false,
          isComplete: false
        }
      ];

      localStorage.setItem("records", JSON.stringify(newRecords));
      setRecords(newRecords);
      setInputText("");
    }
  };

  const onDeleteClick = (id, isComplete) => {
    if (isComplete) return;

    const newRecords = records.filter(rec => rec.id !== id);
    localStorage.setItem("records", JSON.stringify(newRecords));
    setRecords(newRecords);
  };

  const onEditClick = (id, isComplete) => {
    if (isComplete) return;

    setIsEditing(true);

    const editedRecords = records.map(rec => {
      if (rec.id === id) {
        return {
          ...rec,
          isEditing: true
        }
      } else {
        return rec;
      }
    });

    setEditedRecords(editedRecords);
  };

  const onRecordInputChange = (text, id) => {
    const newRecords = editedRecords.map(rec => {
      if (rec.id === id) {
        return {
          ...rec,
          text
        }
      } else {
        return rec;
      }
    });

    setEditedRecords(newRecords);
  };

  const onRecordInputSave = id => {
    const newRecords = editedRecords.map(rec => {
      if (rec.id === id) {
        return {
          ...rec,
          isEditing: false
        }
      } else {
        return rec;
      }
    });

    localStorage.setItem("records", JSON.stringify(newRecords));
    setRecords(newRecords);
    setIsEditing(false);
  };

  const onRecordInputCancel = () => {
    setIsEditing(false);
  };

  const onCompleteClick = id => {
    const newRecords = records.map(rec => {
      if (rec.id === id) {
        return {
          ...rec,
          isComplete: !rec.isComplete
        }
      } else {
        return rec;
      }
    });

    localStorage.setItem("records", JSON.stringify(newRecords));
    setRecords(newRecords);
  };

  const RecordItem = ({ id, text, isComplete }) => {
    return (
      <div className="record-item">
        <p className={`record-item__text ${isComplete ? "record-item__text--complete" : ""}`}>{text}</p>
        <div className="record-item__action-block">
          <span
            className={`record-item__action record-item__action--danger ${isComplete ? "record-item__action--complete" : ""}`}
            onClick={() => onDeleteClick(id, isComplete)}
          >
            [у]
          </span>
          <span
            className={`record-item__action ${isComplete ? "record-item__action--complete" : ""}`}
            onClick={() => onEditClick(id, isComplete)}
          >
            [и]
          </span>
          <span
            className="record-item__action record-item__action--no-margin-right"
            onClick={() => onCompleteClick(id)}
          >
            [з]
          </span>
        </div>
      </div>
    )
  };

  const RecordInput = ({ id, text }) => {
    return (
      <div className="record-item">
        <input
          className="record-item__input"
          ref={inputRef}
          name={`RecordInput_${id}`}
          value={text}
          onChange={evt => onRecordInputChange(evt.target.value, id)}
        />
        <div className="record-item__action-block">
          <span
            className="record-item__action record-item__action--success"
            onClick={() => onRecordInputSave(id)}
          >
            [п]
          </span>
          <span
            className="record-item__action record-item__action--danger record-item__action--no-margin-right"
            onClick={() => onRecordInputCancel()}
          >
            [о]
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      {isEditing && editedRecords?.length > 0 &&
        editedRecords.map(rec => rec.isEditing
          ? <RecordInput key={rec.id} id={rec.id} text={rec.text} />
          : <RecordItem key={rec.id} id={rec.id} text={rec.text} isComplete={rec.isComplete} />
        )
      }
      {!isEditing && records?.length === 0 && <p className="no-records">Записей нет</p>}
      {!isEditing && records?.length > 0 &&
        records.map(rec => <RecordItem key={rec.id} id={rec.id} text={rec.text} isComplete={rec.isComplete} />)
      }
      {!isEditing &&
        <form className="form" onSubmit={onFormSubmit}>
          <input
            className="form__input"
            value={inputText}
            name="inputText"
            onChange={onInputChange}
            placeholder="событие"
          />
          <input
            className="form__submit"
            type="submit"
            value="Добавить"
          />
        </form>
      }
    </div>
  );
};

export default App;
