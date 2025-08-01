
//App.jsx
//testing on mac
import { useState, useEffect, useRef } from 'react';

function App() {
  const [mediaList, setMediaList] = useState([]); 
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({title:'', year:'', type:'', tags: []});

  const [title, setTitle] = useState('');
  const [year, setYear]   = useState('');
  const [type, setType]   = useState('');

  const [globalTags, setGlobalTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [newItemTags, setNewItemTags] = useState([]);
  const [editTagData, setEditTagData] = useState(globalTags);
  const [isEditingTags, setisEditingTags] = useState(false);
  const nextTagID = useRef(1);

  //Meida Creation
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting:', { title, year, type });

    const newMedia = {id: Date.now(), title, year, type, tags: newItemTags};
    setMediaList([...mediaList, newMedia]);
    
  }

  function deleteMedia(itemId) {
    const newArray = mediaList.filter(item => item.id !== itemId);
    setMediaList(newArray);
  }

  //Media /Editing
  function startEdit(item){
    setEditFormData({title: item.title, year: item.year, type: item.type, tags: item.tags})
    setEditId(item.id);
  }

  function saveEdit(itemId) {
    
    setMediaList((prevList) => prevList.map((item) => item.id === itemId ? {...item, ...editFormData} : item));

    setEditFormData({title:'', year:'', type:'', tags: []});
    setEditId(null);
  }

  function cancelEdit() {
    setEditFormData({title:'', year:'', type:'', tags: []});
    setEditId(null);
  }


  //Tag Creation
  function handleTagSubmit(e) {
    e.preventDefault();

    if(tagInput.label && !globalTags.some(tag => tag.label === tagInput.label)){
      setGlobalTags([...globalTags, tagInput]);
    }
    setTagInput('');
    nextTagID.current++;
  }

  function startTagEdit() {
    setisEditingTags(true);
    setEditTagData(globalTags.map(tag => ({...tag})));
  }


  //Tag Editing
  function handleTagEdit(e, index) {
    const newList = [...editTagData];
    newList[index] = {...newList[index], label: e.target.value};
    setEditTagData(newList);
  }

  function handleTagEditSave() {
    setGlobalTags(editTagData);
    setisEditingTags(false);
  }

  function handleTagEditCancel() {
    setEditTagData(globalTags);
    setisEditingTags(false);
  }

  return (
    <div>
    <h1>Add New Tags</h1>
      <form onSubmit={handleTagSubmit}>
        <label htmlFor='tag'>Tag: </label>
        <input type="text" id='title'  name="tag" placeholder='Enter Tag Here' onChange={(e) => setTagInput({id: nextTagID.current, label: e.target.value})}></input>

        <input style={{marginLeft: "8px"}} type="submit" value="Submit"/>
      </form>

    
      <h2>Add New Media</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='title'>Title: </label>
        <input type="text" id="title" name="title" placeholder='Title' onChange={(e) => setTitle(e.target.value)}></input>

        <label htmlFor='year'>Year: </label>
        <input type="text" id="year" name="year" placeholder='Year' onChange={(e) => setYear(e.target.value)}></input>

        <label htmlFor='type'>Type: </label>
        <input type="text" id="type" name="type" placeholder='Type' onChange={(e) => setType(e.target.value)}></input>

        <input style={{marginLeft: "8px"}} type="submit" value="Submit"/>
      
        <p>Select Tags:</p>


        {isEditingTags ? (
          <>
          {editTagData.map((tag,index) => (
              <div key={index}>
                <input type='text' value={tag.label} onChange={(e) => handleTagEdit(e, index)}></input>
                <button type='button' onClick={(e) => {
                  e.preventDefault();
                  setEditTagData(editTagData.filter((_, i) => i !== index));
                }}>❌</button>
              </div>
            ))}
            <button type='button' onClick={() => handleTagEditSave()}>Save Tags</button>
            <button type='button' onClick={() => handleTagEditCancel()}>Cancel Edit</button>
          </>
        ) : (
          <>
          {globalTags.map(tag => (
            <label key={tag.id}>
            {tag.label}
            <input type='checkbox' value={tag.label} onChange={(e) => {
              const checked = e.target.checked;
              const id = tag.id
              
              if(checked){
                setNewItemTags([...newItemTags, id]);
              }
              else{
                setNewItemTags(newItemTags.filter(t => t !== id));
              }
            }}
            
            ></input>
          </label>
          ))}
          <button type="button" onClick={() => startTagEdit()}>Edit Tags</button>
          </>
        )}
      
      </form>

      
      

      <h3>My List</h3>
      <ul>
        {mediaList.map((item) => (
          <li key={item.id}>
            {editId === item.id ? (
              //Edit Mode where we show input fields instead of plain text
              <> 
                <input value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}/>

                <input value={editFormData.year} onChange={(e) => setEditFormData({...editFormData, year: e.target.value})}/>

                <input value={editFormData.type} onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}/> 

                <button onClick={() => saveEdit(item.id)}> Save</button>
                <button onClick={cancelEdit}> Cancel</button>
              </>
            ) : (
              //Normal Mode
            <>
              {item.title} ({item.year}) - {item.type}
              <div>
                Tags: {item.tags.map (id => {
                  const tag = globalTags.find(t => t.id === id);
                  return tag ? tag.label : "";
                }).join(', ')}
              </div>
              <button onClick={() => startEdit(item)}> Edit</button>
              <button onClick={() => deleteMedia(item.id)}> Delete</button>
            </>
            )} 
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;







/*
// App.jsx
import { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(() => {
    const storedCount = localStorage.getItem('count');
    return storedCount !== null ? Number(storedCount) : 0;
  });

  useEffect(() => {
    localStorage.setItem('count', count);
  }, [count]);

  const leftClick = () => setCount(count + 1);

  const rightClick = (e) => {
    e.preventDefault();
    return count == 0 ? null : setCount (count-1);
  }

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={leftClick} onContextMenu={rightClick}>Adjust</button>
      <button onClick={() => setCount(0)}>Reset</button> 
    </div>
  );
}

export default App;*/








/*function App() {

  return (
    <Header title="deez nuts"/>
  );
}

function Header({title}){
  return (
    <h1>This is a Header for {title}</h1>
  )
}

export default App*/
