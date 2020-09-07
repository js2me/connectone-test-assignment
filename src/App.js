import React, {
  useState,
  useRef,
  useEffect,
  useCallback
} from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.scss";



const RecordItem = ({ id, text, isComplete, onDeleteClick, onEditClick, onCompleteClick }) => {
  const handleDeleteClick = useCallback(() => onDeleteClick(id, isComplete), [id, isComplete, onDeleteClick])
  const handleEditClick = useCallback(() => onEditClick(id, isComplete), [id, isComplete, onEditClick])
  const handleCompleteClick = useCallback(() => onCompleteClick(id), [id, onCompleteClick])

  return (
    <div className="record-item">
      <p className={`record-item__text ${isComplete ? "record-item__text--complete" : ""}`}>{text}</p>
      <div className="record-item__action-block">
        <span
          className={`record-item__action record-item__action--danger ${isComplete ? "record-item__action--complete" : ""}`}
          onClick={handleDeleteClick}
        >
          [у]
        </span>
        <span
          className={`record-item__action ${isComplete ? "record-item__action--complete" : ""}`}
          onClick={handleEditClick}
        >
          [и]
        </span>
        <span
          className="record-item__action record-item__action--no-margin-right"
          onClick={handleCompleteClick}
        >
          [з]
        </span>
      </div>
    </div>
  )
};

const AddNewRecordForm = ({ onAddNewRecord }) => {
  const [inputText, setInputText] = useState("");

  const handleChangeInputText = useCallback((e) => {
    setInputText(e.target.value)
  }, [])

  const handleFormSubmit = useCallback(e => {
    e.preventDefault();

    setInputText("")
    onAddNewRecord(inputText)
  }, [inputText, onAddNewRecord])

  return (
    <form className="form" onSubmit={handleFormSubmit}>
      <input
        className="form__input"
        value={inputText}
        name="inputText"
        onChange={handleChangeInputText}
        placeholder="событие"
      />
      <input
        className="form__submit"
        type="submit"
        value="Добавить"
      />
    </form>
  )
}

const RecordInput = ({ id, text, inputRef, onRecordInputSave, onRecordInputCancel }) => {
  const [tempText, setTempText] = useState(text)

  const handleRecordInputChange = useCallback(e => {
    setTempText(e.target.value)
  }, [])

  const handleRecordInputSave = useCallback(() => {
    onRecordInputSave(id, tempText);
  }, [id, onRecordInputSave, tempText])

  return (
    <div className="record-item">
      <input
        className="record-item__input"
        ref={inputRef}
        name={`RecordInput_${id}`}
        value={tempText}
        onChange={handleRecordInputChange}
      />
      <div className="record-item__action-block">
        <span
          className="record-item__action record-item__action--success"
          onClick={handleRecordInputSave}
        >
          [п]
        </span>
        <span
          className="record-item__action record-item__action--danger record-item__action--no-margin-right"
          onClick={onRecordInputCancel}
        >
          [о]
        </span>
      </div>
    </div>
  );
};

const App = () => {
  const [records, setRecords] = useState(localStorage.getItem("records") ? JSON.parse(localStorage.getItem("records")) : []);
  const [editedRecords, setEditedRecords] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  console.count("APP render");

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, [editedRecords]);

  const handleAddNewRecord = useCallback((recordText) => {

    if (recordText !== "") {
      const newRecords = [
        ...records,
        {
          id: uuidv4(),
          text: recordText,
          isEditing: false,
          isComplete: false
        }
      ];

      localStorage.setItem("records", JSON.stringify(newRecords));
      setRecords(newRecords);
    }
  }, [records]);

  const onDeleteClick = useCallback((id, isComplete) => {
    if (isComplete) return;

    const newRecords = records.filter(rec => rec.id !== id);
    localStorage.setItem("records", JSON.stringify(newRecords));
    setRecords(newRecords);
  }, [records]);

  const onEditClick = useCallback((id, isComplete) => {
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
  }, [records]);

  const onRecordInputSave = useCallback((id, newText) => {
    const newRecords = editedRecords.map(rec => {
      if (rec.id === id) {
        return {
          ...rec,
          text: newText,
          isEditing: false
        }
      } else {
        return rec;
      }
    });

    localStorage.setItem("records", JSON.stringify(newRecords));
    setRecords(newRecords);
    setIsEditing(false);
  }, [editedRecords]);

  const onRecordInputCancel = useCallback(() => {
    setIsEditing(false);
  }, [])

  const onCompleteClick = useCallback(id => {
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
  }, [records]);

  return (
    <div className="container">
      {isEditing && editedRecords?.length > 0 &&
        editedRecords.map(rec => rec.isEditing
          ? <RecordInput key={rec.id} id={rec.id} text={rec.text} onRecordInputSave={onRecordInputSave} onRecordInputCancel={onRecordInputCancel} />
          : <RecordItem key={rec.id} id={rec.id} text={rec.text} isComplete={rec.isComplete} onDeleteClick={onDeleteClick} onEditClick={onEditClick} onCompleteClick={onCompleteClick} />
        )
      }
      {!isEditing && records?.length === 0 && <p className="no-records">Записей нет</p>}
      {!isEditing && records?.length > 0 &&
        records.map(rec => <RecordItem key={rec.id} id={rec.id} text={rec.text} isComplete={rec.isComplete} onDeleteClick={onDeleteClick} onEditClick={onEditClick} onCompleteClick={onCompleteClick} />)
      }
      {!isEditing && <AddNewRecordForm onAddNewRecord={handleAddNewRecord} />}
    </div>
  );
};

export default App;
